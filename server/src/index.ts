import http from "http";
import express, { Express, Request, Response } from "express";
import { QnA } from "./interfaces/qna";
import { ServeError } from "./interfaces/serverError";

const app: Express = express();
const PORT: string = process.env.PORT || "3001";
const qnaList: QnA[] = require("../data/qna.json");

app.get("/", (_: Request, res: Response) => res.sendStatus(200));

app.get("/questions", (_: Request, res: Response) =>
  res.json({
    status: 200,
    message: "ok",
    data: qnaList.map((data) => {
      const { answer, ...questionData } = data;
      return questionData;
    }),
  })
);

app.get("/questions/:questionId", (req: Request, res: Response) => {
  const { questionId } = req.params;
  const qid = Number(questionId);
  if (qid || !Number.isNaN(qid)) {
    res.json({
      status: 200,
      message: "ok",
      data: qnaList.find((data) => data.questionId === qid),
    });
  } else {
    res.status(400).json({
      status: 400,
      message: "Question id is invalid.",
    });
  }
});

app.get("/questions/:questionId/answer", (req: Request, res: Response) => {
  const { questionId } = req.params;
  const qid = Number(questionId);
  if (qid || !Number.isNaN(qid)) {
    res.json({
      status: 200,
      message: "ok",
      data: {
        answer: qnaList.find((data) => data.questionId === qid)?.answer,
      },
    });
  } else {
    res.status(400).json({
      status: 400,
      message: "Question id is invalid.",
    });
  }
});

const server = http.createServer(app);

server.on("error", (err: ServeError) => {
  switch (err.code) {
    case "EADDRINUSE":
      console.error(`Port (:${PORT}) is already in use`);
      break;
    default:
      console.error(err);
  }
});

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
