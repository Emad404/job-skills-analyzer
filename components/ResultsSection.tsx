import { Briefcase, Wrench, Medal } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import type { AnalysisResult } from "@/types";

interface ResultsSectionProps {
  result: AnalysisResult;
}

const CARD_CONFIG = [
  {
    key: "skills" as const,
    title: "Skills",
    icon: <Briefcase className="w-4 h-4" strokeWidth={1.75} />,
    colorScheme: "indigo" as const,
    delay: 0,
  },
  {
    key: "tools" as const,
    title: "Tools",
    icon: <Wrench className="w-4 h-4" strokeWidth={1.75} />,
    colorScheme: "cyan" as const,
    delay: 60,
  },
  {
    key: "certifications" as const,
    title: "Certifications",
    icon: <Medal className="w-4 h-4" strokeWidth={1.75} />,
    colorScheme: "emerald" as const,
    delay: 120,
  },
] as const;

export default function ResultsSection({ result }: ResultsSectionProps) {
  return (
    <section aria-label="Job analysis results" className="w-full">
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
          Requirements
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {CARD_CONFIG.map(({ key, title, icon, colorScheme, delay }) => (
          <ResultCard
            key={key}
            title={title}
            icon={icon}
            items={result[key]}
            colorScheme={colorScheme}
            animationDelay={delay}
          />
        ))}
      </div>
    </section>
  );
}
