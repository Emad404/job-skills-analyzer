import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// System Prompt
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a job market analyst with expertise in current industry requirements.

When given a job title, respond ONLY with a valid JSON object in this exact format:
{
  "skills": ["skill1", "skill2", "skill3"],
  "tools": ["tool1", "tool2", "tool3"],
  "certifications": ["cert1", "cert2", "cert3"]
}

Rules:
- Return 5-8 items per category
- Focus on what's actually required in the job market TODAY
- Skills = soft/hard skills (e.g., Data Analysis, Critical Thinking)
- Tools = software/platforms (e.g., Python, SQL, Excel)
- Certifications = recognized certificates (e.g., Google Data Analytics)
- Do NOT include any text outside the JSON object
- Do NOT include markdown or code blocks`;

// ─────────────────────────────────────────────────────────────────────────────
// JSON Guardrails
// ─────────────────────────────────────────────────────────────────────────────
function extractJson(raw: string): AnalysisResult {
  const stripped = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("NO_JSON: No JSON object found in response.");
  }

  const parsed = JSON.parse(match[0]) as Partial<AnalysisResult>;

  if (
    !Array.isArray(parsed.skills) ||
    !Array.isArray(parsed.tools) ||
    !Array.isArray(parsed.certifications)
  ) {
    throw new Error(
      "INVALID_SHAPE: Response JSON is missing one or more required array keys."
    );
  }

  return {
    skills: parsed.skills.filter((s): s is string => typeof s === "string"),
    tools: parsed.tools.filter((t): t is string => typeof t === "string"),
    certifications: parsed.certifications.filter(
      (c): c is string => typeof c === "string"
    ),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/analyze
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[/api/analyze] GEMINI_API_KEY is not set.");
    return NextResponse.json(
      { error: "Server configuration error. Please contact the administrator." },
      { status: 500 }
    );
  }

  let jobTitle: string;
  try {
    const body = await request.json();
    jobTitle = (body?.jobTitle ?? "").toString().trim();
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Expected JSON body with a 'jobTitle' field." },
      { status: 400 }
    );
  }

  if (!jobTitle) {
    return NextResponse.json(
      { error: "Job title is required." },
      { status: 400 }
    );
  }

  if (jobTitle.length > 100) {
    return NextResponse.json(
      { error: "Job title must be 100 characters or fewer." },
      { status: 400 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const geminiResult = await model.generateContent(`Job title: ${jobTitle}`);
    const rawText = geminiResult.response.text();

    const analysisResult = extractJson(rawText);

    if (
      analysisResult.skills.length === 0 &&
      analysisResult.tools.length === 0 &&
      analysisResult.certifications.length === 0
    ) {
      return NextResponse.json({ error: "EMPTY_RESULT" }, { status: 422 });
    }

    return NextResponse.json({ result: analysisResult }, { status: 200 });

  } catch (error) {
    console.error("[/api/analyze] Unhandled error:", error);

    if (
      error instanceof SyntaxError ||
      (error instanceof Error && error.message.startsWith("NO_JSON")) ||
      (error instanceof Error && error.message.startsWith("INVALID_SHAPE"))
    ) {
      return NextResponse.json(
        { error: "The AI returned an unreadable response. Please try a different job title." },
        { status: 502 }
      );
    }

    if (error instanceof Error && error.message.toLowerCase().includes("credit balance")) {
      return NextResponse.json(
        { error: "Your API key is out of credits or invalid." },
        { status: 402 }
      );
    }

    if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    if (error instanceof Error && error.message.toLowerCase().includes("api key")) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your server configuration." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}