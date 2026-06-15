# PNGTuber App
A lightweight PNGTuber desktop application built with Electron.

The app listens to microphone input in real time and automatically switches between idle and talking sprites, allowing users to create a simple reactive avatar for streaming, recording, or online calls.

## Features
* Real-time microphone-based voice detection
* Automatic idle / talking sprite switching
* Live avatar updates without restarting the application
* Custom idle and talking image selection
* Persistent avatar configuration between launches
* Adjustable microphone sensitivity
* Microphone selection from available input devices
* Transparent avatar window for OBS integration
* Lightweight control panel for managing settings
* Portable Windows build

## Download
Download the latest release from the Releases section.

Available package:
* `PNGTuber Setup.exe`

## Usage
1. Launch the application.
2. Click **Start** to display the avatar.
3. Select custom idle and talking images if desired.
4. Choose the microphone you want to use.
5. Adjust sensitivity if needed.
6. Speak into the selected microphone.

The avatar will automatically switch between idle and talking states based on detected audio input.

## OBS Setup
1. Open OBS Studio.
2. Add a **Window Capture** source.
3. Select the PNGTuber avatar window.
4. Position and resize as desired.

## Development
### Requirements
* Node.js
* npm

### Install
```bash
npm install
```

### Run
```bash
npm start
```

### Build
```bash
npm run build
```

Build output will be generated inside:
```text
dist/
```

## Project Structure
```text
pngtuber/
├── assets/
│   ├── idle.png
│   └── talk.png
├── control.html
├── index.html
├── main.js
├── package.json
└── script.js
```

## Configuration
Voice detection behaviour can be adjusted through the application's sensitivity control.
Advanced users can further modify detection logic within:

```js
THRESHOLD
REQUIRED_FRAMES
HOLD_TIME
SMOOTHING
```

inside `script.js`.

## Notes
* Microphone permission is required.
* Custom avatar images are copied into the application's user data folder.
* Avatar settings persist between sessions.
* Built using Electron (Chromium + Node.js).

## Changelog
### v1.2
- Added microphone selection dropdown
- Added live microphone label display
- Added sensitivity slider in the control panel
- Fixed packaged-build asset loading issues

### v1.1
- Built-in image selection for custom avatars
- Added persistent avatar storage
- Improved voice detection stability
- Image handling no longer breaks if original files are moved/deleted
  
### v1.0
- Real-time microphone-based voice detection
- Idle / talking sprite switching
- OBS-compatible window capture
- Basic idle and talking animations
