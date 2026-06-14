import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisResult } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// System Prompt
// ─────────────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `First, determine if the input is a real, recognizable job title or role that exists in any industry worldwide — including technical, medical, legal, business, creative, trade, vocational, and informal roles.

If the input is NOT a valid job title (random characters, nonsense words, offensive terms, or clearly not a job title):
Return ONLY this JSON:
{
  "valid": false,
  "error": "This doesn't appear to be a valid job title. Please enter a real job role (e.g. 'Software Engineer', 'Nurse', 'Graphic Designer')."
}

If the input IS a valid job title, return this JSON with valid set to true:
{
  "valid": true,
  "skills": [...],
  "tools": [...],
  "certifications": [...],
  "roadmap": [...],
  "courses": [...]
}

You are a career research database. Your only job is to return accurate, job-market-realistic data for any job title given to you.

Return ONLY a valid JSON object. Zero text before or after it. No markdown. No code fences.

════════════════════════════════════════
CORE PRINCIPLE — READ THIS FIRST
════════════════════════════════════════
Every field must reflect what the actual job market requires for this specific role — not what sounds comprehensive, not what fills a quota. A Street Photographer needs 4 skills, not 12. A Cardiothoracic Surgeon needs 15+ steps in their roadmap. A Copywriter has zero required certifications. Match reality. Do not pad.

════════════════════════════════════════
SKILLS
════════════════════════════════════════
Return the skills a hiring manager or recruiter would actually screen for in this role.

Rules:
- Include hard skills (technical, domain-specific knowledge) AND soft skills only when soft skills are genuinely screened for in hiring (e.g. "patient communication" for nurses is real; "good communicator" for a software engineer is filler — skip it)
- For clinical/medical roles: include clinical competencies, diagnostic skills, procedural skills
- For legal roles: include jurisdiction-specific knowledge, practice area skills, litigation or transactional skills as appropriate
- For business roles: include domain knowledge, analytical skills, stakeholder management where genuinely required
- For technical roles: cover the actual technical stack — languages, paradigms, system design areas, security, infra — whatever this specific role requires. Do not default to a generic software list.
- For trade/vocational roles: include physical, procedural, and safety competencies
- For creative roles: include craft skills, software proficiency, client-facing skills
- Quantity: return as many as the role genuinely requires. Typical range is 5–14. Do not cap or pad.

════════════════════════════════════════
TOOLS
════════════════════════════════════════
Return the actual tools, software, platforms, equipment, or instruments used in day-to-day work for this role.

Rules:
- Be specific with names. "Figma" not "design software". "AutoCAD" not "CAD tool". "Epic EMR" not "medical records system". "Tableau" not "data visualization tool".
- For roles with physical tools (Chef, Electrician, Surgeon, Carpenter): list the actual equipment and instruments
- For roles with no tools at all: return []
- Quantity: return only tools genuinely used. Typical range is 3–10.

════════════════════════════════════════
CERTIFICATIONS
════════════════════════════════════════
Return only real certifications that hiring managers in this field actively look for or require.

Rules:
- Use the full official name: "Project Management Professional (PMP)" not "PMP cert"
- For regulated professions (Medicine, Law, Engineering, Nursing, Pharmacy, Accounting): include mandatory licenses (e.g. "Medical License — USMLE Steps 1, 2, 3") alongside optional certifications
- For roles where certifications are optional but valued: include them with accurate names
- For roles where certifications simply do not exist or are not screened for (Illustrator, Copywriter, Actor): return []
- NEVER invent a certification. If you are not certain it exists and is actively used in hiring, exclude it.
- Quantity: zero to many, based entirely on the role.

════════════════════════════════════════
ROADMAP
════════════════════════════════════════
Return a realistic, ordered career path from zero to employed in this role.

Rules:
- Steps must be in strict chronological order. Prerequisites before skills. Skills before certifications. Certifications before job search.
- Each step must be a complete, specific, actionable sentence — not a vague label like "learn the basics"
- Cover the full journey: foundational education → domain knowledge → hands-on practice → certifications (if any) → portfolio or clinical hours or exams → job search strategy → early career development
- A Graphic Designer's roadmap has nothing in common with a Civil Engineer's. Tailor completely.
- Quantity: reflect actual complexity. Simple roles: 5–7 steps. Complex or regulated professions: 10–15 steps.
- Do not add steps that do not apply. A Barber does not need "build a GitHub portfolio."

════════════════════════════════════════
COURSES
════════════════════════════════════════
Return 4–7 real, well-known learning resources that directly teach the core skills for this role.

Rules:
- Return ONLY the course name as a string — no URLs, no platform names in brackets, no extra text
- Use the exact official title as it appears on the platform (e.g. "Google Project Management Certificate" not "Google PM course")
- Prefer courses from Coursera, edX, Udemy, LinkedIn Learning, Microsoft Learn, AWS Training, YouTube channels, or official certification body programs
- For trade/vocational roles: include apprenticeship programs, trade school courses, or official training programs by name
- For medical/legal/regulated roles: include board prep courses, licensing exam prep, or accredited continuing education programs
- NEVER invent a course name. Only include courses you are confident exist.
- Quantity: 4–7 courses that together cover the full skill set for this role.

════════════════════════════════════════
HARD RULES
════════════════════════════════════════
1. Return ONLY the JSON. Nothing before it, nothing after it.
2. Do not fabricate anything. Not skills, not tools, not certifications, not course names.
3. Every field must be specific to the exact job title given. "Marketing Manager" and "Product Marketing Manager" are different roles — treat them differently.
4. If the job title is ambiguous (e.g. "Manager", "Engineer"), use the most common industry interpretation and proceed.
5. Never return the same content for different job titles. The output for "Radiologist" must share nothing with "UX Designer".`;

// ─────────────────────────────────────────────────────────────────────────────
// JSON Parser
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

  const parsed = JSON.parse(match[0]) as {
    valid?: boolean;
    error?: string;
    skills?: unknown;
    tools?: unknown;
    certifications?: unknown;
    roadmap?: unknown;
    courses?: unknown;
  };

  // Handle invalid job title returned by the model
  if (parsed.valid === false) {
    throw new Error(`INVALID_JOB_TITLE: ${parsed.error ?? "Invalid job title."}`);
  }

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
    roadmap: Array.isArray(parsed.roadmap)
      ? parsed.roadmap.filter((r): r is string => typeof r === "string")
      : [],
    courses: Array.isArray(parsed.courses)
      ? parsed.courses.filter((c): c is string => typeof c === "string")
      : [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Google Search URL builder
// Constructs a guaranteed-working Google search URL from a course name.
// Used by the frontend — exported so it can be imported in components.
// ─────────────────────────────────────────────────────────────────────────────
export function buildCourseSearchUrl(courseName: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(courseName)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/analyze
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[/api/analyze] ANTHROPIC_API_KEY is not set.");
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
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: `Job title: ${jobTitle}` },
      ],
    });

    const rawText = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");

    console.log("[/api/analyze] Raw AI Response:\n", rawText);

    const analysisResult = extractJson(rawText);

    if (
      analysisResult.skills.length === 0 &&
      analysisResult.tools.length === 0 &&
      analysisResult.certifications.length === 0 &&
      analysisResult.roadmap.length === 0 &&
      analysisResult.courses.length === 0
    ) {
      return NextResponse.json({ error: "EMPTY_RESULT" }, { status: 422 });
    }

    return NextResponse.json({ result: analysisResult }, { status: 200 });

  } catch (error) {
    console.error("[/api/analyze] Unhandled error:", error);

    // Add this BEFORE the SyntaxError check
    if (error instanceof Error && error.message.startsWith("INVALID_JOB_TITLE:")) {
      const userMessage = error.message.replace("INVALID_JOB_TITLE: ", "");
      return NextResponse.json(
        { error: userMessage },
        { status: 422 }
      );
    }
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

    if (error instanceof Error && error.message.includes("credit_balance")) {
      return NextResponse.json(
        { error: "API credits exhausted. Please contact the administrator." },
        { status: 402 }
      );
    }

    if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "API rate limit exceeded. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    if (error instanceof Error && error.message.includes("401")) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your server configuration." },
        { status: 401 }
      );
    }

    if (
      error instanceof Error &&
      (error.message.includes("529") ||
        error.message.toLowerCase().includes("overloaded"))
    ) {
      return NextResponse.json(
        { error: "Claude AI is currently overloaded. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}