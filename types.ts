export enum InterviewPhase {
  CONFIG = 'CONFIG',
  IN_PROGRESS = 'IN_PROGRESS',
  GENERATING_FEEDBACK = 'GENERATING_FEEDBACK',
  ENDED = 'ENDED'
}

export interface InterviewConfig {
  candidateName: string;
  companyName: string;
  jobRole: string;
  companyUrl: string;
  language: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface FeedbackReport {
  score: number;
  report: string;
}

export interface UserProfile {
  name: string;
  picture: string | null; // Base64 string
}
