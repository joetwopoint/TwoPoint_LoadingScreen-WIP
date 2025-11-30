// URL-based TikTok loadscreen
// Continuous playback via rotation timer, with SPACEBAR to reload current video.

// ===================== CONFIG =========================
const tiktokVideos = [
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7565518128927591711",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7577016794569788702",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7575985752375332127",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7567100329674755359",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7566234364057554207",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7565874934048722206",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7540003369935539487",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7536165613924846879",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7534080149491338509",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7496361694399139115",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7496356035360296238",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7496353751230631214",
  "https://www.tiktok.com/@sunvalleyroleplay2/photo/7494316754177395999",
  "https://www.tiktok.com/@sunvalleyroleplay2/photo/7493511478784396587",
  "https://www.tiktok.com/@sunvalleyroleplay2/video/7493494626968505646"
];

const TIKTOK_ROTATE_MS = 35000;

const tips = [
  "Be respectful to other players. RP > FRP.",
  "Read the rules in Discord before you hit the streets.",
  "Use push-to-talk and keep comms clear during scenes.",
  "Record your POV – it helps with reports and clips.",
  "Have fun, but remember: actions have consequences."
];

let currentTikTokUrl = null;

// ===================== HELPERS =========================
function chooseRandom(arr) {
  if (!arr || arr.length === 0) return null;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function getVideoIdFromUrl(url) {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

function setIframeFromUrl(url) {
  const frame = document.getElementById("tiktokFrame");
  if (!frame) return;

  if (!url) {
    frame.src = "about:blank";
    return;
  }

  const videoId = getVideoIdFromUrl(url);
  if (!videoId) {
    frame.src = url;
    return;
  }

  const playerUrl = `https://www.tiktok.com/player/v1/${videoId}?autoplay=1&loop=0`;
  frame.src = playerUrl;
}

function loadRandomTikTok() {
  const randomUrl = chooseRandom(tiktokVideos);
  currentTikTokUrl = randomUrl || null;
  setIframeFromUrl(currentTikTokUrl);
}

function reloadCurrentTikTok() {
  // Called when SPACEBAR is pressed; re-sets the iframe src to the same URL.
  if (!currentTikTokUrl) {
    loadRandomTikTok();
  } else {
    setIframeFromUrl(currentTikTokUrl);
  }
}

function startTikTokLoop() {
  loadRandomTikTok();
  setInterval(loadRandomTikTok, TIKTOK_ROTATE_MS);
}

function startTipRotation() {
  const tipElement = document.getElementById("tipText");
  if (!tipElement || tips.length === 0) return;

  let current = 0;
  tipElement.textContent = tips[current];

  setInterval(() => {
    current = (current + 1) % tips.length;
    tipElement.style.opacity = 0;

    setTimeout(() => {
      tipElement.textContent = tips[current];
      tipElement.style.opacity = 1;
    }, 200);
  }, 6000);
}

function setupSpacebarHandler() {
  document.addEventListener("keydown", (e) => {
    // Spacebar detection (code, key, keyCode for safety)
    if (e.code === "Space" || e.key === " " || e.keyCode === 32) {
      e.preventDefault();
      reloadCurrentTikTok();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  startTikTokLoop();
  startTipRotation();
  setupSpacebarHandler();
});
