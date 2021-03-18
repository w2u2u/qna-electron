import {
  app,
  BrowserWindow,
  ipcMain,
  net,
  IncomingMessage,
  globalShortcut,
} from "electron";
import * as path from "path";

let mainWindowInstance: BrowserWindow;
let answerWindowInstance: BrowserWindow;

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nativeWindowOpen: true,
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  preventWindowRefresh(mainWindow);

  return mainWindow;
}

function createAnsWindow(): BrowserWindow {
  const answerWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nativeWindowOpen: true,
    },
    width: 800,
  });

  answerWindow.loadFile(path.join(__dirname, "../src/windows/ans/index.html"));

  preventWindowRefresh(answerWindow);

  return answerWindow;
}

// Prevent window refresh
function preventWindowRefresh(win: BrowserWindow) {
  win.on("focus", () => {
    globalShortcut.registerAll(
      ["CommandOrControl+R", "CommandOrControl+Shift+R", "F5"],
      () => {}
    );
  });

  win.on("blur", () => {
    globalShortcut.unregisterAll();
  });
}

// Select question
ipcMain.on(
  "question:select",
  (event: Electron.IpcMainEvent, questionId: number) => {
    if (!answerWindowInstance || answerWindowInstance.isDestroyed()) {
      answerWindowInstance = createAnsWindow();

      setTimeout(() => answerWindowInstance.close(), 5000);
    }

    if (questionId && typeof questionId === "number") {
      // for 1st opening
      answerWindowInstance.once("ready-to-show", () => {
        getAnswerByQuestionId(questionId);
      });

      // just update content
      getAnswerByQuestionId(questionId);
    }
  }
);

// Get questions to main window
function getQuestions() {
  const req = net.request("http://localhost:3001/questions");

  req
    .on("response", (res: IncomingMessage) => {
      res
        .on("data", (chunk: Buffer) => {
          mainWindowInstance.webContents.send(
            "question:list",
            JSON.parse(`${chunk}`).data
          );
        })
        .on("end", () => {});
    })
    .on("error", (err: Error) =>
      console.error("Server not response with: ", err)
    )
    .end();
}

// Get answer to answer window
function getAnswerByQuestionId(questionId: number) {
  const req = net.request(
    `http://localhost:3001/questions/${questionId}/answer`
  );

  req
    .on("response", (res: IncomingMessage) => {
      res
        .on("data", (chunk: Buffer) => {
          answerWindowInstance.webContents.send(
            "answer:loaded",
            JSON.parse(`${chunk}`).data?.answer
          );
        })
        .on("end", () => {});
    })
    .on("error", (err: Error) =>
      console.error("Server not response with: ", err)
    )
    .end();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  mainWindowInstance = createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      mainWindowInstance = createWindow();
  });

  mainWindowInstance.once("ready-to-show", () => getQuestions());
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
