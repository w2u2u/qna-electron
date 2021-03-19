const container = document.getElementById("ans-container");
const text = document.createTextNode("");

container?.appendChild(text);

window.ipc.onAnswerLoaded((answer) => {
  text.textContent = `Answer: ${answer}`;
});

window.ipc.onErrorAPI((err: Error) => {
  text.textContent = "Failed to load questions";
});
