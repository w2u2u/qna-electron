import { net, IncomingMessage } from "electron";
import {
  Config,
  Question,
  GetQuestionsAPIResponse,
  GetAnswerAPIResponse,
} from "../types";

// Get questions to main window
export function getQuestions(config: Config): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    const req = net.request(`http://${config.QuestionApiService}`);

    req
      .on("response", (res: IncomingMessage) => {
        res
          .on("data", (chunk: Buffer) => {
            const questionsResponse: GetQuestionsAPIResponse = JSON.parse(
              `${chunk}`
            );
            if (questionsResponse.data && questionsResponse.data.questions) {
              resolve(questionsResponse.data.questions);
            } else {
              reject(new Error("Questions response is invalid structure"));
            }
          })
          .on("end", () => {});
      })
      .on("error", (err: Error) => {
        reject(new Error(`Server not response with: ${err}`));
      })
      .end();
  });
}

// Get answer to answer window
export function getAnswerByQuestionId(
  questionId: number,
  config: Config
): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = net.request(
      `http://${config.QuestionApiService}/${questionId}/answer`
    );

    req
      .on("response", (res: IncomingMessage) => {
        res
          .on("data", (chunk: Buffer) => {
            const answerResponse: GetAnswerAPIResponse = JSON.parse(`${chunk}`);
            if (answerResponse.data && answerResponse.data.answer) {
              resolve(answerResponse.data.answer);
            } else {
              reject(new Error("Answer response is invalid structure"));
            }
          })
          .on("end", () => {});
      })
      .on("error", (err: Error) =>
        reject(new Error(`Server not response with: ${err}`))
      )
      .end();
  });
}
