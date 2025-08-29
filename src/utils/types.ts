export interface Users {
  username?: string;
  email: string;
  password?: string;
}

export interface Login {
  identifier: string;
  password?: string;
}

export interface UserFeedback {
  targetUser?: string;
}

export interface FeedbackItem {
  id: number;
  timestamp: string;
  sender: string;
  context: string;
  sentiment: string;
  summary: string;
  constructiveCriticism: string;
}

export interface FeedbackRequest {
  userId?: string;
  anon_identifier: string;
  feedback_text?: string;
  context_text?: string;
  anon_email?: string;
}

export interface FeedbackFormProps {
  userId: string;
}
