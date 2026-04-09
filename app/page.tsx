"use client";

import { useState } from "react";
import { BrainCircuit, AlertCircle, Zap, Copy, Check, ExternalLink } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import ResultsSection from "@/components/ResultsSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import { getCachedResult, setCachedResult } from "@/lib/cache";
import type { AnalysisResult } from "@/types";

// ─── State type ───────────────────────────────────────────────────────────────
type AppState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AnalysisResult; fromCache: boolean }
  | { status: "unrecognized" }
  | { status: "error"; message: string };

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [appState, setAppState] = useState<AppState>({ status: "idle" });
  const [copiedSection, setCopiedSection] = useState<"roadmap" | "courses" | null>(null);

  const handleCopy = (section: "roadmap" | "courses", content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const trimmed = jobTitle.trim();
    if (!trimmed || appState.status === "loading") return;

    // 1. Check LocalStorage cache first (PRD §13.D)
    const cached = getCachedResult(trimmed);
    if (cached) {
      setAppState({ status: "success", result: cached, fromCache: true });
      return;
    }

    // 2. No cache hit — call the API
    setAppState({ status: "loading" });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: trimmed }),
      });

      const data = await response.json();

      // 422 = EMPTY_RESULT → unrecognized job title (PRD §13.C)
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

      // 3. Cache successful result in LocalStorage (PRD §13.D)
      setCachedResult(trimmed, data.result);
      setAppState({ status: "success", result: data.result, fromCache: false });
    } catch {
      setAppState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  const isLoading = appState.status === "loading";

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* ── Ambient background glow (dark mode only) ──────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Top-center blue/violet blob */}
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-600/10 via-violet-600/8 to-transparent blur-3xl dark:from-blue-600/15 dark:via-violet-600/10" />
        {/* Bottom right accent */}
        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-3xl dark:bg-violet-600/8" />
      </div>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="mb-16 flex items-center justify-between">
          {/* Logo + wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/20">
              <BrainCircuit className="h-5 w-5 text-white" strokeWidth={1.75} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Job Skills Analyzer
            </span>
          </div>

          <ThemeToggle />
        </header>

        {/* ── Hero section ─────────────────────────────────────────────── */}
        <section className="mb-12 text-center">

          {/* Main heading */}
          <h1 className="mx-auto mb-4 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Discover What Any{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
              Job Role
            </span>{" "}
            Requires
          </h1>

          {/* Sub-heading */}
          <p className="mx-auto max-w-lg text-base text-slate-700 dark:text-white sm:text-lg">
            Type any job title and get an instant breakdown of the skills, tools,
            and certifications the market demands today.
          </p>
        </section>

        {/* ── Search bar ───────────────────────────────────────────────── */}
        <div className="mb-14">
          <SearchBar
            value={jobTitle}
            onChange={setJobTitle}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        {/* ── Results area ─────────────────────────────────────────────── */}
        <div>

          {/* Loading skeleton */}
          {appState.status === "loading" && <LoadingSpinner />}

          {/* Success — show results */}
          {appState.status === "success" && (
            <div className="space-y-12">
              <div>
                {/* Cache badge */}
                {appState.fromCache && (
                  <div className="mb-4 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Loaded from cache
                    </span>
                  </div>
                )}
                <ResultsSection result={appState.result} />
              </div>

              {appState.result.roadmap && appState.result.roadmap.length > 0 && (
                <section className="animate-fade-in-up" style={{ animationDelay: "240ms" }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Career Roadmap
                    </h2>
                    <button
                      onClick={() => {
                        const text = appState.result.roadmap!.map((s, i) => `${i + 1}. ${s}`).join("\n");
                        handleCopy("roadmap", text);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {copiedSection === "roadmap" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSection === "roadmap" ? "Copied!" : "Copy list"}
                    </button>
                  </div>
                  
                  <div className="border-l-2 border-slate-200 dark:border-slate-700 ml-3 pl-6 space-y-6">
                    {appState.result.roadmap.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Step marker */}
                        <span className="absolute -left-[35px] flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 border-2 border-white dark:bg-slate-800 dark:border-slate-950 text-slate-600 dark:text-slate-300 text-xs font-bold font-mono shadow-sm">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300 pt-0.5">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {appState.result.courses && appState.result.courses.length > 0 && (
                <section className="animate-fade-in-up" style={{ animationDelay: "320ms" }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Recommended Courses
                    </h2>
                    <button
                      onClick={() => {
                        const text = appState.result.courses!.map(c => 
                          `${c}: https://www.youtube.com/results?search_query=Best+courses+for+${encodeURIComponent(c)}`
                        ).join("\n");
                        handleCopy("courses", text);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {copiedSection === "courses" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSection === "courses" ? "Copied!" : "Copy courses"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {appState.result.courses.map((course, idx) => {
                      const isPartner = /(Google|IBM|Meta)/i.test(course);
                      const targetUrl = isPartner
                        ? `https://www.google.com/search?q=site:coursera.org+${encodeURIComponent(course)}`
                        : `https://www.google.com/search?q=${encodeURIComponent(course + " official course link")}`;

                      return (
                        <div
                          key={idx}
                          className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-all hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 gap-3"
                        >
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {course}
                          </span>
                          
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 w-fit"
                          >
                            {isPartner ? "Enroll Now" : "View Course"}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Unrecognized job title (422) */}
          {appState.status === "unrecognized" && (
            <EmptyState isUnrecognized />
          )}

          {/* Error state */}
          {appState.status === "error" && (
            <div className="animate-fade-in-up flex flex-col items-center gap-4 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10">
                <AlertCircle
                  className="h-7 w-7 text-red-500 dark:text-red-400"
                  strokeWidth={1.75}
                />
              </div>
              <div className="max-w-sm">
                <h2 className="mb-1 text-base font-semibold text-slate-800 dark:text-slate-100">
                  Something went wrong
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {appState.message}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-1 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* Idle — subtle prompt */}
          {appState.status === "idle" && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm font-medium text-slate-700 dark:text-white">
                Enter a job title above to get started
              </p>
              {/* Popular role quick-picks */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {[
                  "Data Analyst",
                  "Software Engineer",
                  "UX Designer",
                  "Product Manager",
                  "DevOps Engineer",
                  "Cybersecurity Analyst",
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setJobTitle(role);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
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
