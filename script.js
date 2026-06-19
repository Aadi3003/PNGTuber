const { ipcRenderer } = require('electron');

const avatar = document.getElementById("avatar");

let currentMicId = null;

let audioContext;
let analyser;
let dataArray;
let streamRef;

let smoothedVolume = 0;
let lastTalkTime = 0;
let speakingFrames = 0;
let running = true;
let lastVolumeUpdate = 0;

// 🧠 Dynamic sources (now base64!)
let idleSrc = "assets/idle.png";
let talkSrc = "assets/talk.png";

let currentTalkingState = false;

// 🔧 Tune these
let THRESHOLD = 45;
const HOLD_TIME = 200;
const SMOOTHING = 0.7;
const REQUIRED_FRAMES = 20;

let t = 0;


// 🎨 Update avatar
function updateAvatar(isTalking) {
  avatar.src = isTalking ? talkSrc : idleSrc;
}


// 🎤 Start mic
async function start(deviceId = null) {
  try {
    // console.log("Starting microphone:", deviceId);

    if (streamRef) {
      streamRef.getTracks().forEach(track => track.stop());
    }

    if (audioContext) {
      await audioContext.close();
    }

    const constraints = {
      audio: deviceId
        ? {
            deviceId: {
              exact: deviceId
            }
          }
        : true
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // console.log(
    //   "Opened:",
    //   stream.getAudioTracks()[0].getSettings()
    // );

    streamRef = stream;
    currentMicId = deviceId;

    audioContext = new AudioContext();

    analyser = audioContext.createAnalyser();

    const source =
      audioContext.createMediaStreamSource(stream);

    source.connect(analyser);

    analyser.fftSize = 256;

    dataArray =
      new Uint8Array(analyser.frequencyBinCount);

  } catch (err) {
    console.error("Mic error:", err);
  }
}

// 🔁 Loop
function loop() {
  if (!running) return;

  if (!analyser || !dataArray) {
    requestAnimationFrame(loop);
    return;
  }

  analyser.getByteFrequencyData(dataArray);

  let rawVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
  
  const nowTime = Date.now();

  if (nowTime - lastVolumeUpdate > 50) {

    ipcRenderer.send(
      'volume-update',
      Math.min(rawVolume, 100)
    );

    lastVolumeUpdate = nowTime;
  }

//   if (Math.random() < 0.01) {
//   console.log(
//     "Volume:",
//     Math.round(rawVolume),
//     "| Device:",
//     currentMicId
//   );
// }

  smoothedVolume = SMOOTHING * smoothedVolume + (1 - SMOOTHING) * rawVolume;

  const now = Date.now();

  if (smoothedVolume > THRESHOLD) {
    speakingFrames++;
  } else {
    speakingFrames = 0;
  }

  if (speakingFrames >= REQUIRED_FRAMES) {
    lastTalkTime = now;
  }

  const isTalking = (now - lastTalkTime) < HOLD_TIME;

  currentTalkingState = isTalking;

  updateAvatar(isTalking);

  // 🌊 animation
  t += 0.05;

  if (isTalking) {
    avatar.style.transform = `scale(${1.05 + Math.sin(t) * 0.02})`;
  } else {
    avatar.style.transform = `scale(${1 + Math.sin(t) * 0.01})`;
  }

  requestAnimationFrame(loop);
}


// 🔥 RECEIVE BASE64 IMAGES (KEY FIX)
ipcRenderer.on('set-idle', (_, dataUrl) => {
  idleSrc = dataUrl;
  updateAvatar(currentTalkingState);
});

ipcRenderer.on('set-talk', (_, dataUrl) => {
  talkSrc = dataUrl;
  updateAvatar(currentTalkingState);
});

// mic threshold / senstivity
ipcRenderer.on('update-threshold', (_, value) => {
  THRESHOLD = value;
});

// mic label
// ipcRenderer.on('change-mic', (_, deviceId) => {
//   start(deviceId);
// });
ipcRenderer.on('change-mic', (_, deviceId) => {
  // console.log("MIC SWITCH RECEIVED:", deviceId);
  start(deviceId);
});

// 🧹 Cleanup
function cleanup() {
  running = false;

  if (audioContext) audioContext.close();

  if (streamRef) {
    streamRef.getTracks().forEach(track => track.stop());
  }
}

ipcRenderer.on('cleanup', cleanup);


// 🚀 Start
start();
loop();