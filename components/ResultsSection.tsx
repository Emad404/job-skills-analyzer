import { Briefcase, Wrench, Medal, Map, BookOpen } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import type { AnalysisResult } from "@/types";

interface ResultsSectionProps {
  result: AnalysisResult;
}

// Card configuration — icon, title, color scheme, and stagger delay
const CARD_CONFIG = [
  {
    key: "skills" as const,
    title: "Skills",
    icon: <Briefcase className="w-5 h-5" strokeWidth={1.75} />,
    colorScheme: "blue" as const,
    delay: 0,
  },
  {
    key: "tools" as const,
    title: "Tools",
    icon: <Wrench className="w-5 h-5" strokeWidth={1.75} />,
    colorScheme: "violet" as const,
    delay: 80,
  },
  {
    key: "certifications" as const,
    title: "Certifications",
    icon: <Medal className="w-5 h-5" strokeWidth={1.75} />,
    colorScheme: "amber" as const,
    delay: 160,
  },
  {
    key: "roadmap" as const,
    title: "Career Roadmap",
    icon: <Map className="w-5 h-5" strokeWidth={1.75} />,
    colorScheme: "emerald" as const,
    delay: 240,
  },
  {
    key: "courses" as const,
    title: "Recommended Courses",
    icon: <BookOpen className="w-5 h-5" strokeWidth={1.75} />,
    colorScheme: "rose" as const,
    delay: 320,
  },
] as const;

export default function ResultsSection({ result }: ResultsSectionProps) {
  return (
    <section aria-label="Job analysis results" className="w-full">
      {/* Section heading */}
      <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6 font-medium">
        Here&rsquo;s what the job market requires for this role
      </p>

      {/* Responsive card grid: 1 col → 3 col */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
