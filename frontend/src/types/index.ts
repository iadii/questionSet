export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
  category: "DSA" | "LLD" | "HLD" | "BEHAVIORAL" | "CS_FUNDAMENTALS";
  frequency: number;
  leetcodeUrl?: string;
  articleUrl?: string;
  videoUrl?: string;
  companyTags?: string[];
  hints?: string[];
}

export interface UserProgressDTO {
  questionId: string;
  status: "NOT_STARTED" | "ATTEMPTED" | "SOLVED" | "REVISION_NEEDED";
  nextRevisionDate: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
