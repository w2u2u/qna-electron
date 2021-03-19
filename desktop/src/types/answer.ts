export interface AnswerResponseData {
  answer: string | null;
}

export interface GetAnswerAPIResponse {
  status: number;
  message: string;
  data: AnswerResponseData | null;
}
