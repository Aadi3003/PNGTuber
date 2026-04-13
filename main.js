const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let controlWindow;
let avatarWindow;

// 📁 user storage
const userDir = app.getPath('userData');
const configPath = path.join(userDir, 'config.json');

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
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  avatarWindow.loadFile('index.html');

  // 🔄 Load config or defaults
  avatarWindow.webContents.on('did-finish-load', () => {
    const config = loadConfig();

    const defaultIdle = path.join(__dirname, 'assets', 'idle.png');
    const defaultTalk = path.join(__dirname, 'assets', 'talk.png');

    const idlePath = config.idle || defaultIdle;
    const talkPath = config.talk || defaultTalk;

    // Save defaults if first run
    if (!config.idle && !config.talk) {
      saveConfig({ idle: idlePath, talk: talkPath });
    }

    sendImage('set-idle', idlePath);
    sendImage('set-talk', talkPath);
  });
}

app.whenReady().then(createWindows);


// 🎮 CONTROLS

ipcMain.on('start-avatar', () => {
  if (avatarWindow) avatarWindow.show();
});

ipcMain.on('stop-avatar', () => {
  if (avatarWindow) avatarWindow.hide();
});

ipcMain.on('exit-app', () => {
  if (avatarWindow) {
    avatarWindow.webContents.send('cleanup');
  }

  setTimeout(() => {
    app.quit();
  }, 100);
});


// 🖼️ FILE PICKERS

ipcMain.handle('select-idle', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg'] }]
  });

  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('select-talk', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg'] }]
  });

  return result.canceled ? null : result.filePaths[0];
});


// 📦 COPY + SAVE + SEND IMAGE

ipcMain.on('update-idle', (_, filePath) => {
  if (!filePath) return;

  const ext = path.extname(filePath);
  const dest = path.join(userDir, 'idle' + ext);

  fs.copyFileSync(filePath, dest);
  saveConfig({ idle: dest });

  sendImage('set-idle', dest);
});

ipcMain.on('update-talk', (_, filePath) => {
  if (!filePath) return;

  const ext = path.extname(filePath);
  const dest = path.join(userDir, 'talk' + ext);

  fs.copyFileSync(filePath, dest);
  saveConfig({ talk: dest });

  sendImage('set-talk', dest);
});


// 🔥 SEND IMAGE AS BASE64 (KEY FIX)
function sendImage(channel, filePath) {
  try {
    const ext = path.extname(filePath);
    const imageData = fs.readFileSync(filePath).toString('base64');
    const mime = ext === '.jpg' ? 'image/jpeg' : 'image/png';

    avatarWindow.webContents.send(
      channel,
      `data:${mime};base64,${imageData}`
    );
  } catch (err) {
    console.error("Image load error:", err);
  }
}


// 💾 CONFIG

function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath));
    }
  } catch (err) {
    console.error("Config load error:", err);
  }
  return {};
}

function saveConfig(newData) {
  try {
    const current = loadConfig();
    const updated = { ...current, ...newData };

    fs.writeFileSync(configPath, JSON.stringify(updated, null, 2));
  } catch (err) {
    console.error("Config save error:", err);
  }
}