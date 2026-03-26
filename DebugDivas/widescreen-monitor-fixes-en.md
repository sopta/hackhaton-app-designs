# Widescreen Monitor Fixes — Landing Page

## Problem

When implementing a landing page from a Pencil design (1440px width), the content stretched across the full screen width on widescreen monitors. This caused:

1. **Hero image** took up the entire viewport height — users didn't know to scroll down
2. **Sections (team cards, sprint board, dictionary)** stretched to extreme widths — cards looked empty and disproportionate
3. **Overall impression** — on larger monitors the page looked broken and unprofessional

## Applied Solutions

### 1. Hero image — from background-image to img tag

**Original state:**
```css
.hero {
  height: 761px;
  background: url('hero-bg.png') center / cover no-repeat;
}
```
- Image was cropped (cover), reducing height cut off content (headings inside the image)

**Solution:**
```html
<img src="hero-bg.png" alt="..." class="hero-img">
```
```css
.hero-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 75vh;
  object-fit: contain;
}
```

**Why:**
- `<img>` with `height: auto` preserves aspect ratio — nothing gets cropped
- `max-height: 75vh` ensures the image never takes more than 75% of viewport height
- `object-fit: contain` ensures the full image fits without cropping
- The beginning of the next section is always visible below — user knows to scroll

### 2. Max-width on all sections

**Problem:** On widescreen monitors (2560px+) content stretched across full width.

**Solution:**
```css
body {
  background: var(--bg-dark); /* dark background behind content */
}

.hero,
.team-section,
.sprint-section,
.dictionary-section,
.footer {
  max-width: 1440px;
  margin: 0 auto;
}
```

**Why:**
- `max-width: 1440px` matches the design width in Pencil
- `margin: 0 auto` centers content on screen
- `background: var(--bg-dark)` on body ensures the space on sides isn't white but blends with the dark theme

### 3. Apply to all pages

The same rules (`max-width` + `margin: 0 auto`) must be applied to **every section** on every page, not just the main landing page. In this project:
- `index.html` — landing page
- `bug-hunt.html` — Bug Hunt page
- `member-detail.html` — Member Detail template

## Checklist for Future Projects

When converting a design (1440px) to HTML/CSS, always:

1. **Hero image** — use `<img>` (not background-image) if it contains important text content
2. **Limit height** of hero section via `max-height: 75vh` so the next content is visible
3. **Set `max-width: 1440px`** on all sections + `margin: 0 auto`
4. **Body background** — set to a color matching the dark edge of the design
5. **Test on multiple widths** — at minimum 1440px, 1920px, and 2560px
