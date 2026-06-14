export interface AnalysisResult {
  skills: string[];
  tools: string[];
  certifications: string[];
  roadmap: string[];
  courses: string[];
}

export interface AnalyzeRequest {
  jobTitle: string;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
}

export interface AnalyzeErrorResponse {
  error: string;
}
