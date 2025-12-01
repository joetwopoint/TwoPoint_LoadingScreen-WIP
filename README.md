# twopoint-loadingscreen  
Customizable FiveM Loading Screen

A clean, modern FiveM loading screen that you can brand for **any server**. Features:

- Plays **random TikTok / YouTube Shorts** clips from your own links  
- Shows a **phone-style frame** with the shorts inside  
- Has a big **background logo watermark** (customizable)  
- Optional **staff list** with round character pictures  
- Shows **server tips** while the player loads  

This is a pure **loadscreen resource** using FiveM’s `loadscreen` directive – no in-game UI.

---

## 1. Installation

1. Drop the folder into your resources:

   ```text
   resources/[loadscreen]/twopoint-loadingscreen
   ```

2. In your `server.cfg`, add:

   ```cfg
   ensure twopoint-loadingscreen
   ```

3. Restart the server (or `refresh` + `ensure twopoint-loadingscreen` from console).

Players will see this while connecting to your server.

---

## 2. File Structure

```text
twopoint-loadingscreen/
├─ fxmanifest.lua
├─ README.md
└─ html/
   ├─ index.html        # Main loadscreen layout
   ├─ style.css         # Styling (backgrounds, phone frame, staff layout)
   ├─ script.js         # Logic: random shorts, tips, staff, config
   ├─ logo.png          # Main server logo (center watermark + left panel)
   └─ staff/
      ├─ README.txt     # Instructions for staff avatars
      └─ (your staff images go here)
```

### Changing the main logo

- Replace `html/logo.png` with your **server logo** (same filename).

No dev/brand corner logo is used in this version.

---

## 3. Basic Config (script.js)

All configuration is done in:

```text
html/script.js
```

Open that file in a text editor (VS Code, Notepad++, etc.).

### 3.1. Staff Panel Toggle

At the top of `script.js`:

```js
// Staff toggle: set to true to show staff list column.
const STAFF_ENABLED = false;
```

- `false` = no staff column (2-column layout: info + phone)
- `true`  = show staff column in the middle (3-column layout)

---

### 3.2. Staff Members List

Right under `STAFF_ENABLED`:

```js
const staffMembers = [
  // Example:
  // {
  //   name: "Jane Doe",
  //   role: "Community Manager",
  //   description: "Handles support & questions.",
  //   image: "staff/jane.png"
  // }
];
```

To use it, set `STAFF_ENABLED = true` and fill it in, for example:

```js
const staffMembers = [
  {
    name: "Alex",
    role: "Owner",
    description: "Main contact for server issues.",
    image: "staff/alex.png"
  },
  {
    name: "Sam",
    role: "Staff Lead",
    description: "Handles staff apps & reports.",
    image: "staff/sam.jpg"
  }
];
```

#### Staff Images

- Put your staff character images in:

  ```text
  html/staff/
  ```

- Example files:

  ```text
  html/staff/alex.png
  html/staff/sam.jpg
  ```

- In `script.js`, the `image` field should be the **relative path** from `html/`, e.g.:

  ```js
  image: "staff/alex.png"
  ```

Images show as **small round avatars** with a gold border next to the staff name/role.

If `STAFF_ENABLED` is `false` or `staffMembers` is empty, the middle column is hidden and the layout automatically falls back to two columns.

---

### 3.3. Short Source Mode (TikTok / YouTube / Both)

Config setting:

```js
// Short source mode:
//   "tt"   -> TikTok only
//   "yt"   -> YouTube only
//   "both" -> TikTok + YouTube
const SHORT_SOURCE = "both";
```

Choose one:

```js
const SHORT_SOURCE = "tt";   // only TikTok links
const SHORT_SOURCE = "yt";   // only YouTube links
const SHORT_SOURCE = "both"; // mix of TikTok + YouTube
```

---

### 3.4. TikTok & YouTube URLs

#### TikTok

Fill this with any TikTok video/photo URLs you want:

```js
const tikTokUrls = [
  "https://www.tiktok.com/@yourserver/video/1234567890123456789",
  // add more TikTok links here
];
```

#### YouTube

Add your YouTube Shorts / videos here:

```js
const youTubeUrls = [
  "https://www.youtube.com/shorts/VIDEOID",
  "https://youtu.be/VIDEOID",
  "https://www.youtube.com/watch?v=VIDEOID"
];
```

Then set `SHORT_SOURCE` to `"yt"` or `"both"` depending on how you want to mix them.

---

### 3.5. Clip Duration

Time before switching to the next random clip:

```js
const CLIP_DURATION_MS = 30000; // 30 seconds
```

Increase or decrease (value is in milliseconds).

---

### 3.6. Volume Behavior (YouTube only)

At the top of `script.js`:

```js
// NOTE ABOUT VOLUME:
// Up/Down arrow keys only affect the volume/mute state of YouTube embeds.
// TikTok iframes do not expose volume to us, so arrows will NOT change TikTok audio.
// Clips start at 20% logical volume (YouTube: unmuted).
```

The actual volume variable:

```js
let volumePercent = 20;
```

- Clips **start at 20%** logical volume.
- On **YouTube**:
  - `0%` → embed is loaded **muted**
  - `> 0%` → embed is loaded **unmuted**
- On **TikTok**:
  - Volume cannot be controlled via script; arrow keys do not change TikTok audio.
  - Players may still need to click the video to unmute, depending on browser/FiveM.

The UI on-screen just shows:

```html
<div class="controls-hint">
  <span class="volume-readout">Volume: <span id="volumeValue">20%</span></span>
</div>
```

There is **no mention of keybinds** on the screen; arrow keys are a hidden “power user” feature for YouTube only.

---

## 4. Visual Features

- **Background**
  - Soft radial gradient background
  - Dark overlay
  - Large, faint **background watermark logo** (from `logo.png`)

- **Left Column**
  - Main logo + server name text
  - “Connecting...” status
  - Animated progress bar
  - Short description about loading/shorts
  - Rotating **server tips**

- **Middle Column (optional)**
  - “Staff Team” title
  - List of staff cards with:
    - Round avatar (character image)
    - Name, role, small description  

- **Right Column**
  - “Random shorts from our socials” title
  - Phone-style frame:
    - Curved device border, top speaker and camera dot
    - Shorts iframe inside as the screen
  - Volume readout + note about clips possibly starting muted / needing click

Everything is skinned via CSS, so you can tweak colors, radiuses, shadows, etc., in `style.css`.

---

Drag-and-drop ready for FiveM. Customize and enjoy ✌️
