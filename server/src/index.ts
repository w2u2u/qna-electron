import http from "http";
import express, { Express, Request, Response } from "express";
import { QnA } from "./interfaces/qna";
import { ServeError } from "./interfaces/serverError";

const app: Express = express();
const PORT: string = process.env.PORT || "3001";
const qnaList: QnA[] = require("../data/qna.json");

// Service Uptime / Health Check
app.get("/", (_: Request, res: Response) => res.sendStatus(200));

// data: { questions: [] || null }
app.get("/questions", (_: Request, res: Response) => {
  const questions = qnaList.map((data) => {
    const { answer, ...questionData } = data;
    return questionData;
  });

  res.json({
    status: 200,
    message: "ok",
    data: {
      questions: questions || null,
    },
  });
});

// data: { question: {} || null }
app.get("/questions/:questionId", (req: Request, res: Response) => {
  const { questionId } = req.params;
  const qid = Number(questionId);

  if (qid || !Number.isNaN(qid)) {
    const question = qnaList.find((data) => data.questionId === qid);

    res.json({
      status: 200,
      message: "ok",
      data: {
        question: question || null,
      },
    });
  } else {
    res.status(400).json({
      status: 400,
      message: "Question id is invalid.",
    });
  }
});

// data: { answer: {} || null }
app.get("/questions/:questionId/answer", (req: Request, res: Response) => {
  const { questionId } = req.params;
  const qid = Number(questionId);

  if (qid || !Number.isNaN(qid)) {
    const answer = qnaList.find((data) => data.questionId === qid)?.answer;

    res.json({
      status: 200,
      message: "ok",
      data: {
        answer: answer || null,
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
