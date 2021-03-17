// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from "electron";
declare global {
  interface Window {
    ipc: {
      onQuestionSelected: (func: (questionId: number) => any) => void;
      selectQuestion: (questionId: number) => void;
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
});
