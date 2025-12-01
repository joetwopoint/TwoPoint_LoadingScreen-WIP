// TwoPoint Loading Screen Logic
// - Random TikTok / YouTube shorts
// - Optional staff list in the middle column
// - Arrow key volume for YouTube embeds only
// - Rotating tips on the left panel

// ===================== CONFIG =========================

// Staff toggle: set to true to show staff list column.
const STAFF_ENABLED = false;

// Staff members: only used if STAFF_ENABLED === true.
const staffMembers = [
  // Example:
  // {
  //   name: "Jane Doe",
  //   role: "Community Manager",
  //   description: "Handles support & questions.",
  //   image: "staff/jane.png"
  // }
];

// Short source mode:
//   "tt"   -> TikTok only
//   "yt"   -> YouTube only
//   "both" -> TikTok + YouTube
const SHORT_SOURCE = "both";

// NOTE ABOUT VOLUME:
// Up/Down arrow keys only affect the volume/mute state of YouTube embeds.
// TikTok iframes do not expose volume to us, so arrows will NOT change TikTok audio.
// Clips start at 20% logical volume (YouTube: unmuted).

// TikTok links
const tikTokUrls = [
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

// YouTube links (examples, replace with your own if you want)
const youTubeUrls = [
  // "https://www.youtube.com/shorts/VIDEOID",
  // "https://youtu.be/VIDEOID",
  // "https://www.youtube.com/watch?v=VIDEOID"
];

// Approximate time per clip before switching (ms)
const CLIP_DURATION_MS = 30000;

// Tips to rotate on the left panel
const tips = [
  "Be respectful to other players. RP > FRP.",
  "Read the rules in Discord before you hit the streets.",
  "Use push-to-talk and keep comms clear during scenes.",
  "Record your POV – it helps with reports and clips.",
  "Have fun, but remember: actions have consequences."
];

let currentUrl = null;
let currentProvider = null;
// Start around 20% 'logical' volume (for YouTube, this just means unmuted)
let volumePercent = 20;

// ===================== HELPERS =========================
function chooseRandom(arr) {
  if (!arr || arr.length === 0) return null;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function getActiveShortList() {
  const useTikTok = SHORT_SOURCE === "tt" || SHORT_SOURCE === "both";
  const useYouTube = SHORT_SOURCE === "yt" || SHORT_SOURCE === "both";

  let list = [];
  if (useTikTok) list = list.concat(tikTokUrls);
  if (useYouTube) list = list.concat(youTubeUrls);

  // Fallback: if something is misconfigured to empty, just use TikTok list
  if (!list.length) {
    list = tikTokUrls.slice();
  }
  return list;
}

function detectProvider(url) {
  if (!url) return null;
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "unknown";
}

function getTikTokVideoId(url) {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
}

function getYouTubeVideoId(url) {
  let match = url.match(/shorts\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];

  match = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];

  match = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) return match[1];

  return null;
}

function buildEmbedUrl(url) {
  const provider = detectProvider(url);
  currentProvider = provider;

  if (provider === "tiktok") {
    const videoId = getTikTokVideoId(url);
    if (!videoId) {
      // /photo/ and other forms – just let TikTok handle it directly.
      return url;
    }
    return `https://www.tiktok.com/player/v1/${videoId}?autoplay=1&loop=0`;
  }

  if (provider === "youtube") {
    const vid = getYouTubeVideoId(url);
    if (!vid) return url;

    // 0% -> muted, anything above -> unmuted
    const muteFlag = volumePercent === 0 ? 1 : 0;
    return `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=${muteFlag}&controls=0&rel=0&loop=1&playlist=${vid}&modestbranding=1`;
  }

  return url;
}

function setFrameToUrl(url) {
  const frame = document.getElementById("shortFrame");
  if (!frame) return;

  if (!url) {
    frame.src = "about:blank";
    return;
  }

  const embedUrl = buildEmbedUrl(url);
  frame.src = embedUrl;
}

function loadRandomShort() {
  const list = getActiveShortList();
  const url = chooseRandom(list);
  currentUrl = url || null;
  setFrameToUrl(currentUrl);
}

// ===================== VOLUME & UI =========================
function updateVolumeReadout() {
  const el = document.getElementById("volumeValue");
  if (el) el.textContent = `${volumePercent}%`;
}

function changeVolume(delta) {
  volumePercent = Math.max(0, Math.min(100, volumePercent + delta));
  updateVolumeReadout();

  // Only affects YouTube embeds (TikTok ignores this)
  if (currentUrl && currentProvider === "youtube") {
    setFrameToUrl(currentUrl);
  }
}

function setupVolumeKeys() {
  window.addEventListener("keydown", (e) => {
    const key = e.key || e.code || "";
    const kc = e.keyCode;

    if (key === "ArrowUp" || key === "Up" || kc === 38) {
      e.preventDefault();
      changeVolume(10);
    } else if (key === "ArrowDown" || key === "Down" || kc === 40) {
      e.preventDefault();
      changeVolume(-10);
    }
  });
}

// ===================== SHORTS LOOP =========================
function startShortLoop() {
  loadRandomShort();

  function scheduleNext() {
    setTimeout(() => {
      loadRandomShort();
      scheduleNext();
    }, CLIP_DURATION_MS);
  }

  scheduleNext();
}

// ===================== TIPS =========================
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

// ===================== STAFF PANEL =========================
function renderStaff() {
  if (!STAFF_ENABLED) {
    document.body.classList.add("no-staff-layout");
    return;
  }

  const listEl = document.getElementById("staffList");
  if (!listEl) return;

  if (!staffMembers || !staffMembers.length) {
    document.body.classList.add("no-staff-layout");
    return;
  }

  document.body.classList.remove("no-staff-layout");
  listEl.innerHTML = "";

  staffMembers.forEach((m) => {
    const card = document.createElement("div");
    card.className = "staff-card";

    const avatarWrap = document.createElement("div");
    avatarWrap.className = "staff-avatar-wrap";

    const img = document.createElement("img");
    img.src = m.image || "";
    img.alt = m.name || "Staff";

    avatarWrap.appendChild(img);

    const meta = document.createElement("div");
    meta.className = "staff-meta";

    const nameEl = document.createElement("div");
    nameEl.className = "staff-name";
    nameEl.textContent = m.name || "";

    const roleEl = document.createElement("div");
    roleEl.className = "staff-role";
    roleEl.textContent = m.role || "";

    const descEl = document.createElement("div");
    descEl.className = "staff-desc";
    descEl.textContent = m.description || "";

    meta.appendChild(nameEl);
    if (m.role) meta.appendChild(roleEl);
    if (m.description) meta.appendChild(descEl);

    card.appendChild(avatarWrap);
    card.appendChild(meta);

    listEl.appendChild(card);
  });
}

// ===================== INIT =========================
document.addEventListener("DOMContentLoaded", () => {
  updateVolumeReadout();
  setupVolumeKeys();
  startShortLoop();
  startTipRotation();
  renderStaff();
});
