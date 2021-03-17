// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
interface questionAnswer {
  question: string;
  answerId: number;
  answer: string;
}
const questionAnswerList: questionAnswer[] = [
  { question: "q-1", answerId: 1, answer: "a-1" },
  { question: "q-2", answerId: 2, answer: "a-2" },
  { question: "q-3", answerId: 3, answer: "a-3" },
  { question: "q-4", answerId: 4, answer: "a-4" },
];

const list = document.createElement("ul");

questionAnswerList.forEach(({ question, answerId }) => {
  const btnShowAns = document.createElement("button");
  btnShowAns.innerHTML = `Question: ${question}`;
  btnShowAns.onclick = () => {
    window.ipc.selectQuestion(answerId);
  };

  const questionEl = document.createElement("li");
  questionEl.appendChild(btnShowAns);
  list.appendChild(questionEl);
});

const app = document.getElementById("app");
app.appendChild(list);

window.ipc.onQuestionSelected((id) => console.log(id));
