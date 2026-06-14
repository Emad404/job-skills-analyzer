"use client";

import { useState } from "react";
import { AlertCircle, Copy, Check, ExternalLink } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import ResultsSection from "@/components/ResultsSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import type { AnalysisResult } from "@/types";

type AppState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AnalysisResult }
  | { status: "unrecognized" }
  | { status: "error"; message: string };

const QUICK_ROLES = [
  "Data Analyst",
  "Software Engineer",
  "UX Designer",
  "Product Manager",
  "DevOps Engineer",
  "Cybersecurity Analyst",
];

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [appState, setAppState] = useState<AppState>({ status: "idle" });
  const [copiedSection, setCopiedSection] = useState<"roadmap" | "courses" | null>(null);

  const handleCopy = (section: "roadmap" | "courses", content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSubmit = async () => {
    const trimmed = jobTitle.trim();
    if (!trimmed || appState.status === "loading") return;

    setAppState({ status: "loading" });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: trimmed }),
      });

      const data = await response.json();

      if (response.status === 422) {
        setAppState({ status: "unrecognized" });
        return;
      }

      if (!response.ok) {
        setAppState({
          status: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setAppState({ status: "success", result: data.result });
    } catch {
      setAppState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  const isLoading = appState.status === "loading";

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[720px] px-6 pt-16 pb-16">

        {/* Nav */}
        <nav className="flex items-center justify-between mb-12">
          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            JSA
          </span>
          <ThemeToggle />
        </nav>

        {/* Hero */}
        <section className="mb-12">
          <h1
            className="font-bold mb-4"
            style={{
              fontSize: "2.25rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: "var(--text-primary)",
            }}
          >
            What does any{" "}
            <span style={{ color: "var(--accent)" }}>job role</span>
            <br />
            actually require?
          </h1>
          <p
            className="text-[15px] leading-relaxed max-w-[480px]"
            style={{ color: "var(--text-secondary)" }}
          >
            Enter a job title below and get a structured breakdown of the exact
            skills, tools, and certifications hiring managers look for today.
          </p>
        </section>

        {/* Search */}
        <div className="mb-12">
          <SearchBar
            value={jobTitle}
            onChange={setJobTitle}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        {/* Results */}
        <div>

          {appState.status === "loading" && <LoadingSpinner />}

          {appState.status === "success" && (
            <div className="space-y-12">

              <ResultsSection result={appState.result} />

              {appState.result.roadmap.length > 0 && (
                <section className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                  <SectionHeader
                    label="Career Roadmap"
                    onCopy={() => {
                      const text = appState.result.roadmap.map((s, i) => `${i + 1}. ${s}`).join("\n");
                      handleCopy("roadmap", text);
                    }}
                    copied={copiedSection === "roadmap"}
                  />
                  <ol>
                    {appState.result.roadmap.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex gap-5 py-4"
                        style={{
                          borderTop: idx === 0 ? "none" : `1px solid var(--border)`,
                        }}
                      >
                        <span
                          className="flex-shrink-0 text-xs font-bold tabular-nums w-4 mt-0.5"
                          style={{ color: "var(--accent)" }}
                        >
                          {idx + 1}
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {appState.result.courses.length > 0 && (
                <section className="animate-fade-in-up" style={{ animationDelay: "240ms" }}>
                  <SectionHeader
                    label="Recommended Courses"
                    onCopy={() => {
                      const text = appState.result.courses.join("\n");
                      handleCopy("courses", text);
                    }}
                    copied={copiedSection === "courses"}
                  />
                  <div>
                    {appState.result.courses.map((courseName, idx) => (
                      <div
                        key={courseName}
                        className="flex items-center justify-between py-4"
                        style={{
                          borderTop: idx === 0 ? "none" : `1px solid var(--border)`,
                        }}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span
                            className="flex-shrink-0 text-xs font-mono font-semibold w-5 text-right tabular-nums"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="text-sm font-medium truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {courseName}
                          </span>
                        </div>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(courseName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 ml-6 inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                          style={{ color: "var(--accent)" }}
                        >
                          View
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {appState.status === "unrecognized" && <EmptyState isUnrecognized />}

          {appState.status === "error" && (
            <div className="animate-fade-in-up py-14">
              <div className="flex items-start gap-4 max-w-sm">
                <div
                  className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg border"
                  style={{
                    borderColor: "rgba(239,68,68,0.3)",
                    backgroundColor: "rgba(239,68,68,0.05)",
                  }}
                >
                  <AlertCircle
                    className="h-5 w-5"
                    strokeWidth={1.75}
                    style={{ color: "#ef4444" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    {appState.message.includes("quota") ? "API Quota Exceeded" :
                     appState.message.includes("overloaded") ? "Service Unavailable" :
                     "Something went wrong"}
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                    {appState.message}
                  </p>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors duration-150 border"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--surface-3)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {appState.status === "idle" && (
            <div className="py-4">
              <p
                className="font-medium uppercase mb-3"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                }}
              >
                Popular roles
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setJobTitle(role)}
                    className="chip-role rounded px-3 py-1.5 text-xs font-medium"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

function SectionHeader({
  label,
  onCopy,
  copied,
}: {
  label: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between mb-1 pb-3 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <h2
        className="font-semibold uppercase"
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.06em",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </h2>
      <button
        onClick={onCopy}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 border"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface-2)",
          color: "var(--text-secondary)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--surface-3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--surface-2)";
        }}
      >
        {copied ? (
          <Check className="w-3 h-3" strokeWidth={2.5} style={{ color: "var(--accent)" }} />
        ) : (
          <Copy className="w-3 h-3" strokeWidth={2} />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
