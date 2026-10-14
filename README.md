# MVP SMP website

One self-contained file: `index.html` (HTML + CSS + JS inside). No build step, no backend.

## Fill in your details

Open `index.html`, scroll to the bottom and edit the `CONFIG` block:
`serverIP`, `discordUrl`, `storeUrl`, `leaderboardUrl`, `minecraftVersion`, `videoId`.

Everything marked `[PLACEHOLDER]` (dashed outline) still needs your own text.
The stats row under the buttons has no numbers on purpose: add real ones or delete the `<ul class="stats">` block.

## Publish (GitHub Pages)

Settings, then Pages, then "Deploy from a branch", branch `main`, folder `/ (root)`.
Site: `https://<username>.github.io/<repo>/`

## Optional own hero image

Add `assets/hero.jpg` (about 1920x1080, under 300 KB) and set `--hero-image: url("assets/hero.jpg");` at the top of the `<style>` block.
