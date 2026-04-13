# 🎭 PNGTuber App (v1.1)

A mic-reactive PNGTuber desktop app built with Electron.

Your avatar reacts to your voice in real-time — switching between idle and talking states with smooth animation and instant updates.

---

## ✨ Features

* 🎤 Real-time mic-based voice detection
* 🎭 Idle / Talking sprite switching
* ⚡ Instant image switching (no restart needed)
* 💾 Persistent avatar (remembers your images after restart)
* 🌊 Smooth animation (no flickering)
* 🎛️ Control panel (start / stop / exit)
* 🧊 Transparent avatar window (OBS-ready)
* 📂 Built-in image selector (no manual file editing)

---

## 🆕 What’s New in v1.1

* 🔥 Fixed avatar not updating instantly after selecting images
* 💾 Added persistent storage for idle/talk sprites
* 🧠 Default avatar loads on first launch (no empty screen)
* 🛠️ Improved voice detection stability
* 🖼️ Image handling no longer breaks if original files are moved/deleted

---

## 📦 Download (For Users)

👉 Go to **Releases** and download:

* `pngtuber.exe` (portable, no installation required)

---

## ▶️ How to Use

1. Open the app
2. Click **Start**
3. Click buttons to select:

   * Idle image
   * Talking image
4. Speak into your microphone

---

## 🎥 Using with OBS

1. Open OBS
2. Add **Window Capture**
3. Select:

   ```
   PNGTuberAvatar
   ```
4. Resize and position as needed

---

## 🛠️ For Developers

### Requirements

* Node.js

---

### Setup

```bash
npm install
npm start
```

---

## 🏗️ Build

```bash
npm run build
```

The packaged app will be inside:

```
dist/
```

---

## 📁 Project Structure

```
pngtuber/
├── main.js
├── index.html
├── control.html
├── script.js
├── package.json
└── assets/
    ├── idle.png
    └── talk.png
```

---

## ⚙️ Customization

You can tweak voice sensitivity in `script.js`:

```js
const THRESHOLD = 35;
const REQUIRED_FRAMES = 20;
const HOLD_TIME = 200;
const SMOOTHING = 0.7;
```

---

## 🚧 Notes

* Microphone permission is required for the app to function
* Images selected are stored internally (safe from deletion/moving)
* If OBS doesn’t detect the window, reselect it via Window Capture
* Built with Electron (Node.js + Chromium runtime)

---

## 🚀 Future Ideas

* 🎛️ Sensitivity slider in UI
* 🎭 Multiple expressions (happy, angry, etc.)
* ✨ Smooth transitions between sprites
* 🖱️ Draggable avatar window
* ⌨️ Hotkey-based expression switching

---
