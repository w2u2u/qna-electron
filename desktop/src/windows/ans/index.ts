const container = document.getElementById("ans-container");
const text = document.createTextNode("ans!!");

container?.appendChild(text);

window.ipc.onAnswerLoaded((answer) => {
  text.textContent = `Answer: ${answer}`;
});
