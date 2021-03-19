// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from "electron";
import { Question } from "./types/question";

declare global {
  interface Window {
    ipc: {
      onQuestionSelected: (func: (questionId: number) => any) => void;
      selectQuestion: (questionId: number) => void;
      onQuestionsLoaded: (func: (questions: Question[]) => any) => void;
      onAnswerLoaded: (func: (answer: string) => any) => void;
    };
  }
}

contextBridge.exposeInMainWorld("ipc", {
  onQuestionSelected: (func: (questionId: number) => any) => {
    ipcRenderer.on("question:selected", (event, questionId) => {
      func(questionId);
    });
  },
  selectQuestion: (questionId: number) => {
    ipcRenderer.send("question:select", questionId);
  },
  onQuestionsLoaded: (func: (questions: Question[]) => any) => {
    ipcRenderer.on("question:list", (event, questions) => {
      func(questions);
    });
  },
  onAnswerLoaded: (func: (answer: string) => any) => {
    ipcRenderer.on("answer:loaded", (event, answer) => {
      func(answer);
    });
  },
});
