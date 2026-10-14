# MVP SMP website

Static site (HTML + CSS + vanilla JS). No build step, no backend.

## Structure

```
index.html
css/style.css
js/script.js
assets/favicon.svg
```

## 1. Fill in your details

Open `js/script.js` and edit the `CONFIG` block at the top:

- `serverIP`, `discordUrl`, `minecraftVersion`
- `storeUrl`, `leaderboardUrl` (or delete those sections and nav links in `index.html`)
- `videoId` (YouTube trailer looped in the hero background)

Everything marked `[PLACEHOLDER]` in `index.html` (dashed outline) still needs your own text:
About, Features, Rules, community links, and the stats row under the buttons.
The stats row has no numbers on purpose: only add real ones, or delete the `<ul class="stats">` block.

## 2. Publish on GitHub Pages

1. Create a new repository on GitHub (for example `mvp-smp`).
2. Upload the **contents** of this folder (so `index.html` is in the repo root, not inside another folder).
3. Go to Settings, then Pages. Source: "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
4. After a minute the site is live at `https://<username>.github.io/<repo>/`.

## Optional: own hero image

Put a screenshot at `assets/hero.jpg` (about 1920x1080, under 300 KB) and set
`--hero-image: url("../assets/hero.jpg");` at the top of `css/style.css`.
It is shown under the trailer and as a fallback when the video can't play.
