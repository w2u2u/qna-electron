const container = document.getElementById("ans-container");
const text = document.createTextNode("ans!!");
container.appendChild(text);

window.ipc.onQuestionSelected((questionId) => {
  text.textContent = `Answer for ${questionId}`;
});
