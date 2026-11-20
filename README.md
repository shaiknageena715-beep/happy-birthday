# 🎂 Happy Birthday Hemuu – Setup Guide

A beautiful, fully interactive birthday surprise website made with love by Nageena for Hemuu.

---

## 🚀 How to Open

1. Open the `e:/hbd/` folder in File Explorer.
2. Double-click **`index.html`** to open it in your browser.
3. That's it! No server required, no install steps.

---

## 🎵 Adding the Birthday Song

The website has a music player ready to go.

1. Find or download a birthday song (`.mp3` format).
2. Rename it to exactly: **`birthday-song.mp3`**
3. Place it inside the `e:/hbd/` folder (same folder as index.html).
4. Reload the page — the song will play automatically after the first interaction.

---

## 📸 Replacing Photo Placeholders with Your Own Photos

The gallery has **6 photo slots** ready for your personal pictures.

### Step 1 – Create a photos folder
Inside `e:/hbd/`, create a folder called `photos/`

### Step 2 – Add your photos
Name them:
```
photos/photo1.jpg
photos/photo2.jpg
photos/photo3.jpg
photos/photo4.jpg
photos/photo5.jpg
photos/photo6.jpg
```

### Step 3 – Update index.html
Open `index.html`, find each gallery item (search for `photo-placeholder`), and replace that block with an `<img>` tag.

**Example – Photo slot 1 (around line 165):**

Replace this:
```html
<div class="photo-placeholder">
  <span class="photo-num">📸</span>
  <span class="photo-label">Photo 1</span>
  <span class="photo-hint">Replace with your picture</span>
</div>
```
With this:
```html
<img src="photos/photo1.jpg" alt="The beginning of our beautiful story" />
```

Repeat for all 6 slots (Photo 2 through Photo 6).

---

## 📝 The Birthday Letter

The complete heartfelt letter from Nageena is already embedded in the website.  
It is located in `index.html` between the comments:
```
<!-- =================== LETTER START =================== -->
...
<!-- =================== LETTER END ===================== -->
```

If you ever need to update or add to the letter, edit the content inside `<div class="letter-body" id="letterBody">`.

---

## 🎨 Pages Overview

| Page | Description |
|------|-------------|
| 🎂 Cake | Interactive candles — tap to blow each one out |
| 🎶 Song | Music player + envelope reveal card |
| 💗 Cards | 6 flip cards with friendship messages |
| 📸 Gallery | 6 photo frames with lightbox view |
| 💌 Letter | Animated envelope → heartfelt letter |
| ♾️ Promise | Animated forever promise screen + replay |

---

## ⌨️ Navigation Tips

- **Nav dots** at the bottom of the screen let you jump between pages.
- **Arrow keys** (← →) also navigate between pages.
- The **Replay** button on the last page restarts everything from the beginning.

---

Made with ❤️ for Hemuu's birthday.
