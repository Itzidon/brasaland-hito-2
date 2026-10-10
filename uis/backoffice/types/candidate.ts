export type CandidateStatus =
  | "received"
  | "in_progress"
  | "selected"
  | "discarded";

export type CandidateStage =
  | "pending"
  | "review"
  | "personal_interview"
  | "technical_interview"
  | "offer_presented";

export type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  experience_years: number;
  status: CandidateStatus;
  stage: CandidateStage;
  applied_at: string;
};
export type CandidateNote = {
  id: string;
  content: string;
  created_at: string;
};
export type CandidateFormData = {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  experience_years: number;
  status: CandidateStatus;
  stage: CandidateStage;
};