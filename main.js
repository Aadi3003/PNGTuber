const { app, BrowserWindow, ipcMain } = require('electron');

let controlWindow;
let avatarWindow;

function createWindows() {
  // 🎛️ Control panel
  controlWindow = new BrowserWindow({
    width: 500,
    height: 300,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  controlWindow.loadFile('control.html');

  // 🧊 Avatar window
  avatarWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: "AvatarPNG",
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,   // 👈 needed for IPC cleanup
      contextIsolation: false
    }
  });

  avatarWindow.loadFile('index.html');
}

app.whenReady().then(createWindows);


// 🎮 IPC controls

ipcMain.on('start-avatar', () => {
  avatarWindow.show();
});

ipcMain.on('stop-avatar', () => {
  avatarWindow.hide();
});

ipcMain.on('exit-app', () => {
  if (avatarWindow) {
    avatarWindow.webContents.send('cleanup'); // 👈 tell renderer to stop mic
  }

  setTimeout(() => {
    app.quit(); // 👈 give it time to clean up
  }, 100);
});