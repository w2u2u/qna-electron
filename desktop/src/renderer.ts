// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
const app = document.getElementById("app");
const list = document.createElement("ul");

app?.appendChild(list);

window.ipc.onQuestionsLoaded((questions) =>
  questions.forEach(({ questionId, question }) => {
    const btnShowAns = document.createElement("button");
    btnShowAns.innerHTML = `Question: ${question}`;
    btnShowAns.onclick = () => {
      window.ipc.selectQuestion(questionId);
    };

    const questionEl = document.createElement("li");
    questionEl.appendChild(btnShowAns);
    list.appendChild(questionEl);
  })
);
