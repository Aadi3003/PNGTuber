const { ipcRenderer } = require('electron');

const avatar = document.getElementById("avatar");

let audioContext;
let analyser;
let dataArray;
let streamRef;

let smoothedVolume = 0;
let lastTalkTime = 0;
let speakingFrames = 0;
let running = true;

// 🔧 Tweak these if needed
const THRESHOLD = 35;
const HOLD_TIME = 200;
const SMOOTHING = 0.7;
const REQUIRED_FRAMES = 20;

let t = 0;

async function start() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef = stream;

    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    loop();
  } catch (err) {
    console.error("Mic error:", err);
  }
}

function loop() {
  if (!running) return;

  analyser.getByteFrequencyData(dataArray);

  let rawVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;

  // 🎚️ Smooth volume
  smoothedVolume = SMOOTHING * smoothedVolume + (1 - SMOOTHING) * rawVolume;

  const now = Date.now();

  // 🧠 Consistency check
  if (smoothedVolume > THRESHOLD) {
    speakingFrames++;
  } else {
    speakingFrames = 0;
  }

  if (speakingFrames >= REQUIRED_FRAMES) {
    lastTalkTime = now;
  }

  const isTalking = (now - lastTalkTime) < HOLD_TIME;

  // 🌊 animation
  t += 0.05;

  if (isTalking) {
    avatar.src = "assets/talk.png";
    avatar.style.transform = `scale(${1.05 + Math.sin(t) * 0.02})`;
  } else {
    avatar.src = "assets/idle.png";
    avatar.style.transform = `scale(${1 + Math.sin(t) * 0.01})`;
  }

  requestAnimationFrame(loop);
}


// 🧹 CLEANUP (THIS FIXES YOUR TERMINAL ISSUE)
function cleanup() {
  running = false;

  if (audioContext) {
    audioContext.close();
  }

  if (streamRef) {
    streamRef.getTracks().forEach(track => track.stop());
  }
}

// 👂 listen for quit signal
ipcRenderer.on('cleanup', () => {
  cleanup();
});

start();