export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum Category {
  DSA = "DSA",
  LLD = "LLD",
  HLD = "HLD",
  BEHAVIORAL = "BEHAVIORAL",
  CS_FUNDAMENTALS = "CS_FUNDAMENTALS",
}

export enum ProgressStatus {
  NOT_STARTED = "NOT_STARTED",
  ATTEMPTED = "ATTEMPTED",
  SOLVED = "SOLVED",
  REVISION_NEEDED = "REVISION_NEEDED",
}

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  category: Category;
  frequency: number;
  leetcodeUrl?: string;
  articleUrl?: string;
  videoUrl?: string;
  companyTags?: string[];
  hints?: string[];
}

export interface UserProgressDTO {
  questionId: string;
  status: ProgressStatus;
  nextRevisionDate: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
