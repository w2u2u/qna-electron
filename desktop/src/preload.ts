// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from "electron";
import { Question } from "./types/question";

declare global {
  interface Window {
    ipc: {
      selectQuestion: (questionId: number) => void;
      onQuestionSelected: (func: (questionId: number) => void) => void;
      onQuestionsLoaded: (func: (questions: Question[]) => void) => void;
      onAnswerLoaded: (func: (answer: string) => void) => void;
      onErrorAPI: (func: (err: Error) => void) => void;
    };
  }
}

contextBridge.exposeInMainWorld("ipc", {
  selectQuestion: (questionId: number) => {
    ipcRenderer.send("question:select", questionId);
  },
  onQuestionSelected: (func: (questionId: number) => void) => {
    ipcRenderer.on("question:selected", (event, questionId) => {
      func(questionId);
    });
  },
  onQuestionsLoaded: (func: (questions: Question[]) => void) => {
    ipcRenderer.on("question:list", (event, questions) => {
      func(questions);
    });
  },
  onAnswerLoaded: (func: (answer: string) => void) => {
    ipcRenderer.on("answer:loaded", (event, answer) => {
      func(answer);
    });
  },
  onErrorAPI: (func: (err: Error) => void) => {
    ipcRenderer.on("error:api", (event, err: Error) => {
      func(err);
    });
  },
});
