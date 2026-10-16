# MVP Resource Pack — the main pack for ALL MVP plugins

File: `MVP-Resource-Pack.zip` (one pack for MVPCoins, MVPProtect, MVPCrates and every future plugin).
URL: https://raw.githubusercontent.com/proggln/mvp-smp/main/pack/MVP-Resource-Pack.zip

## Rules for adding a plugin
1. Own namespace folder: `assets/<plugin>/models/item` and `assets/<plugin>/textures/item`.
2. Icons are shown on a vanilla base item with a `custom_model_data` number. Never reuse another plugin's base item
   or number range, otherwise one `assets/minecraft/items/<item>.json` replaces the other.
3. After any change: rebuild the zip, compute its SHA-1, put the new URL/SHA-1 into every plugin config
   (`fix-pack.ps1` does it for MVPCoins and MVPProtect; MVPCrates updates itself via `config-version`).

## Used base items and number ranges
| Plugin     | Base item       | custom_model_data |
|------------|-----------------|-------------------|
| MVPCoins   | paper           | 9101-9108, 9201   |
| MVPProtect | knowledge_book  | 9009-9035         |
| MVPCrates  | amethyst_shard  | 9301-9304, 9321-9326 |
| MVPCrates  | tripwire_hook   | 9311-9314         |

Also inside: vanilla block models of the Anti-Xray Full 26.2 pack (assets/minecraft/blockstates and models/block).
Pack icon: MVP logo. Description: "MVP Resource Pack".
