import { app, BrowserWindow, ipcMain, globalShortcut } from "electron";
import * as path from "path";
import { config } from "./config";
import { Question } from "./types";
import { getQuestions, getAnswerByQuestionId } from "./api";

let mainWindowInstance: BrowserWindow | null;
let answerWindowInstance: BrowserWindow | null;

function newMainWindow(): BrowserWindow {
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

  return mainWindow;
}

function newAnsWindow(): BrowserWindow {
  const answerWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nativeWindowOpen: true,
    },
    width: 800,
  });

  answerWindow.loadFile(path.join(__dirname, "../src/windows/ans/index.html"));

  return answerWindow;
}

// Prevent window refresh
function preventedRefresh(win: BrowserWindow): BrowserWindow {
  win.on("focus", () => {
    globalShortcut.registerAll(
      ["CommandOrControl+R", "CommandOrControl+Shift+R", "F5"],
      () => {}
    );
  });

  win.on("blur", () => {
    globalShortcut.unregisterAll();
  });

  return win;
}

// IPC: (question:select) Update selected question id
ipcMain.on(
  "question:select",
  async (_: Electron.IpcMainEvent, questionId: number) => {
    if (answerWindowInstance) {
      try {
        const answer = await getAnswerByQuestionId(questionId, config);
        ipcAnswerLoaded(answerWindowInstance, answer);
      } catch (err) {
        ipcErrorAPI(answerWindowInstance, err);
      }
    } else {
      answerWindowInstance = preventedRefresh(newAnsWindow());

      const answerWindowTimeout = setTimeout(
        () => answerWindowInstance?.close(),
        5000
      );

      // When close answer window clear instance and timeout
      answerWindowInstance.on("close", () => {
        answerWindowInstance = null;
        clearTimeout(answerWindowTimeout);
      });

      // When ready to show fetch data to display
      answerWindowInstance.once("ready-to-show", async () => {
        if (answerWindowInstance) {
          try {
            const answer = await getAnswerByQuestionId(questionId, config);
            ipcAnswerLoaded(answerWindowInstance, answer);
          } catch (err) {
            ipcErrorAPI(answerWindowInstance, err);
          }
        }
      });
    }
  }
);

// IPC: (answer:loaded) Update loaded answer data
function ipcAnswerLoaded(win: BrowserWindow, answer: string) {
  win?.webContents.send("answer:loaded", answer);
}

// IPC: (question:list) Update list of question data
function ipcQuestionList(win: BrowserWindow, questions: Question[]) {
  win?.webContents.send("question:list", questions);
}

// IPC: (error:api) Inform when api got any errors
function ipcErrorAPI(win: BrowserWindow, err: Error) {
  win?.webContents.send("error:api", err);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  mainWindowInstance = preventedRefresh(newMainWindow());

  app.on("activate", async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindowInstance = preventedRefresh(newMainWindow());
    }
  });

  mainWindowInstance.once("ready-to-show", async () => {
    if (mainWindowInstance) {
      try {
        const questions = await getQuestions(config);
        ipcQuestionList(mainWindowInstance, questions);
      } catch (err) {
        ipcErrorAPI(mainWindowInstance, err);
      }
    }
  });
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
