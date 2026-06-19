export enum QuizType {
  General = 'General',
  MensFellowship = 'Mens Fellowship',
  WomensFellowship = 'Womens Fellowship',
  YouthFellowship = 'Youth Fellowship'
}

export enum QuestionType {
  SingleSelect = 'Single Select',
  MultiSelect = 'Multi Select',
  Matches = 'Matches',
  FillInTheBlanks = 'Fill in the blanks',
  TrueFalse = 'True or False',
  ImageQuestion = 'Image Question'
}

export interface QuizQuestion {
  id?: string;
  question_id?: number | string;
  uid?: string; // Stable tracking ID
  text: string;
  type: QuestionType;
  options?: string[]; // For SingleSelect, MultiSelect, ImageQuestion (radio)
  matches?: { left: string; right: string }[]; // For Matches
  answer: any; // string, string[], or { [key: string]: string }
  points: number;
  imageUrl?: string; // For ImageQuestion
  imageAnswerType?: 'radio' | 'text'; // For ImageQuestion
}

export interface QuizSection {
  id?: string;
  section_id?: number | string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface Quiz {
  id: string;
  quiz_id?: number | string; // Mapping from backend
  title: string;
  description: string;
  type: QuizType;
  sections: QuizSection[];
  createdAt: Date;
  active: boolean;
  is_freezed?: boolean;
  end_date?: string;
}

export interface UserInfo {
  name: string;
  mobile: string;
  subscriptionId?: string;
  address1?: string;
  address2?: string;
  city?: string;
  pincode?: string;
}

export type QuizStatus = 'none' | 'saved' | 'submitted';

export interface QuizAnswerPayload {
  question_id: string;
  answer: any;
}

export interface QuizSubmission {
  quiz_id: string;
  user_id: string; // mobile or subscriptionId
  status: 'saved' | 'submitted';
  answers: QuizAnswerPayload[];
  feedback?: string;
}

export interface QuizSubmissionResult {
  submission_id: number;
  status: 'saved' | 'submitted';
  score?: number;
  total_points?: number;
  percentage?: number;
  answers?: {
    question_id: string;
    user_answer: any;
    correct_answer?: any;
    is_correct?: boolean;
    points_awarded?: number;
  }[];
}
export interface QuizStats {
  attended: number;
  submitted: number;
  saved: number;
  averageScore?: number;
}

export interface QuizLeaderboardEntry {
  userName: string;
  mobile: string;
  score: number;
  submittedAt: string;
  rank?: number;
}
