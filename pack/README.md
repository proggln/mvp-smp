# MVP Resource Pack — the main pack for ALL MVP plugins

File: `MVP-Resource-Pack.zip` (one pack for MVPCoins, MVPProtect, MVPTokens and every future plugin).
URL: https://raw.githubusercontent.com/proggln/mvp-smp/main/pack/MVP-Resource-Pack.zip

## Rules for adding a plugin
1. Own namespace folder: `assets/<plugin>/models/item` and `assets/<plugin>/textures/item`.
2. Icons are shown on a vanilla base item with a `custom_model_data` number. Never reuse another plugin's base item
   or number range, otherwise one `assets/minecraft/items/<item>.json` replaces the other.
3. After any change: rebuild the zip, compute its SHA-1, put the new URL/SHA-1 into every plugin config
   (MVPCoins and MVPProtect send the pack to players; MVPTokens only uses it).

## Used base items and number ranges
| Plugin     | Base item       | custom_model_data |
|------------|-----------------|-------------------|
| MVPCoins   | paper           | 9101-9108, 9201, 9202 (MVP coin) |
| MVPProtect | knowledge_book  | 9009-9035         |
| MVPTokens  | amethyst_shard  | 9401 (MVP Token)  |

MVPCrates was removed (2026-10-25); its models and numbers are gone from the pack.

Also inside: vanilla block models of the Anti-Xray Full 26.2 pack (assets/minecraft/blockstates and models/block).
Pack icon: MVP logo. Description: "MVP Resource Pack".
