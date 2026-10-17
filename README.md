# MVP SMP website

One self-contained file: `index.html` (HTML + CSS + JS + logo inside). No build step, no backend.

## Edit

Open `index.html`, scroll to the bottom and edit the `CONFIG` block:

- `serverIP`: the server address shown in the middle (currently an example)
- `discordUrl`: your Discord invite
- `videoId`: YouTube trailer looped in the background

The two achievements (60 players, 3 years) are in the `<ul class="stats">` block.

## Publish (GitHub Pages)

Settings, then Pages, then "Deploy from a branch", branch `main`, folder `/ (root)`.
Site: `https://<username>.github.io/<repo>/`

## Versions

- `/` (root `index.html`): the live site, version 1 (minimal).
- `v2/index.html`: experimental cooler version. Preview: `https://<username>.github.io/<repo>/v2/`.
  It has the same content and the same `CONFIG` block at the bottom. To make it the live site, copy its contents into the root `index.html`.
- Branch `v1-minimal`: saved copy of version 1, so it can always be restored.

## Store (v2/store/)

`v2/store/index.html` is a store page. Edit `CONFIG.products` at the bottom of that file:
name, price, perks and a `checkout` link per item (Tebex, Stripe Payment Link, PayPal...).
Items without a checkout link show "Coming soon". The site is static, so payments always go through the external checkout.

## Wiki (v2/wiki/), hidden

`v2/wiki/index.html` is a player guide for the server plugins (coins, land claims, crates, combat, heads and bounties, scoreboard, all commands).
It is **hidden for now**: no page links to it and it has `noindex, nofollow`, so search engines skip it.
Open it directly: `https://<username>.github.io/<repo>/v2/wiki/`.
To make it public later: add a `Wiki` link to the nav of `v2/index.html` and `v2/store/index.html`, and remove the `robots` meta tag.
