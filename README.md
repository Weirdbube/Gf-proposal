# Ask-My-Girlfriend Website (Starter)

A tiny, **no-build**, **static** website you can customize to ask your girlfriend out.

## What's included
- **Photo slideshow**: next/prev, dots, autoplay, keyboard controls, swipe on mobile
- **Pop the question**: fun "Yes" / "No" interaction
- **Confetti** on "Yes"
- **Easy customization** (name, messages, images) in one place

## Quick start
1. Open `index.html` (double-click it).
2. Customize text + images:
   - Edit `script.js` → the `CONFIG` section near the top.
   - Put her photos in `assets/photos/` (jpg/png/webp).
   - Update `CONFIG.photos` to match your filenames.

## Add her photos (recommended)
Put files like:
- `assets/photos/1.jpg`
- `assets/photos/2.jpg`
- `assets/photos/3.jpg`

Then update in `script.js`:
```js
photos: [
  { src: "assets/photos/1.jpg", caption: "Us" },
  { src: "assets/photos/2.jpg", caption: "That day" },
  { src: "assets/photos/3.jpg", caption: "My favorite smile" },
],
```

## Optional: add a song
If you put a song at `assets/music/song.mp3`, the site will try to autoplay it on page load.
Note: some browsers block autoplay, so the site may ask for one tap/click to enable sound.

## Share it
### Option A (recommended): GitHub Pages link
1. Create a new GitHub repo (public or private).
2. Upload/push this folder contents to the repo root (so `index.html` is at the top level).
3. On GitHub: **Settings → Pages**
   - **Build and deployment**: “Deploy from a branch”
   - **Branch**: `main` (or `master`) and folder `/ (root)`
   - Save, wait ~1–2 minutes
4. Your link will be:
   - `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Option B: send as a zip
Zip the folder and send it; she can open `index.html`.

### Notes for hosting
- File paths on GitHub Pages are **case-sensitive**. Make sure filenames match exactly.
- Tenor GIF embeds need internet to load.


