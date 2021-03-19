export interface Question {
  questionId: number;
  question: string;
}

export interface QuestionsResponseData {
  questions: Question[] | null;
}

export interface GetQuestionsAPIResponse {
  status: number;
  message: string;
  data: QuestionsResponseData | null;
}
