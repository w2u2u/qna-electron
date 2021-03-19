export interface Question {
  questionId: number;
  question: string;
}

export interface GetQuestionsAPIResponse {
  status: number;
  message: string;
  data: Question[] | null;
}
