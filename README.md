# MVP SMP website

One self-contained file: `index.html` (HTML + CSS + JS + logo inside). No build step, no backend.

## Edit

Open `index.html`, scroll to the bottom and edit the `CONFIG` block:

- `serverIP`: the server address shown in the middle (currently an example)
- `discordUrl`: your Discord invite (the Discord button shows a notice until you set it)
- `videoId`: YouTube trailer looped in the background

The two achievements (60 players, 3 years) are in the `<ul class="stats">` block.

## Publish (GitHub Pages)

Settings, then Pages, then "Deploy from a branch", branch `main`, folder `/ (root)`.
Site: `https://<username>.github.io/<repo>/`
