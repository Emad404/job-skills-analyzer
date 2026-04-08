/**
 * Represents the structured analysis result returned by the Gemini API
 * for a given job title.
 */
export interface AnalysisResult {
  /** Soft and hard skills required for the role (5–8 items) */
  skills: string[];
  /** Software, platforms, and tools required for the role (5–8 items) */
  tools: string[];
  /** Recognized certifications recommended for the role (5–8 items) */
  certifications: string[];
}

/**
 * Shape of the POST request body sent to /api/analyze
 */
export interface AnalyzeRequest {
  jobTitle: string;
}

/**
 * Shape of a successful response from /api/analyze
 */
export interface AnalyzeResponse {
  result: AnalysisResult;
}

/**
 * Shape of an error response from /api/analyze
 */
export interface AnalyzeErrorResponse {
  error: string;
}
