# Velvet Circuit

![make.fun competition](https://make.fun/badge/gta6-01.svg)
![Live rank](https://make.fun/badge/gta6-01/vivid-raven-88/gta6-01/rank.svg)
![Live reward](https://make.fun/badge/gta6-01/vivid-raven-88/gta6-01/reward.svg)

An original offline 3D crime game for the [make.fun open-world competition](https://make.fun/bounty/gta6-01). Welcome to Port Saffron: pastel storefronts, glass towers, palm avenues, a working harbor, and a dangerous paper trail. Courier Inez Vale and her contact Sera plan to expose a port syndicate by stealing its ledger and broadcasting its secrets.

Open `game/index.html` directly in desktop Chrome. Alternatively run `node serve.ts` and visit the displayed address. No install, build, account, or network connection is needed. All geometry is created by the game; Three.js r128 is vendored locally. Audio is synthesized using WebAudio.

- WASD / arrows: walk, reverse, accelerate, steer
- Shift: sprint / boost; Space: handbrake
- E: steal a nearby civilian car / leave your car at low speed
- Right mouse drag: orbit camera; F or left click: fire
- Q: repair your vehicle for $100, or buy health and ammunition on foot for $80
- M: save; Escape: pause and save

Four story jobs lead from vehicle theft to a guarded ledger pickup, a police escape, and a radio broadcast. Afterward, repeatable courier deliveries reward exploration. Moving traffic and pedestrians populate the city. Crimes draw escalating police patrols; distance and a clean interval reduce heat. Vehicle damage, health, ammunition, cash, and mission progression matter. Autosave runs every twenty seconds and after completed jobs, and the start menu resumes the local save. Getting caught sends Inez back to the clinic with a cash penalty.

The city, cars, people, police, missions, input, sound, renderer, HUD, and game loop live in separate source files. Dialogue uses one replaceable line in an opaque strip outside the 3D viewport. Signs have independently oriented front and back faces. The title screen is opaque and hides the HUD.

Run `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts` with Node 22.18+ to produce the static game, four browser screenshots, and canonical dossier. `node capture.mjs` recreates the screenshots using the VM's supplied Chromium and Playwright. Screenshot capture uses keyboard gameplay and the game's actual state, with no external assets or image composition.

Game source: MIT, see LICENSE. Three.js is MIT, copyright its authors; its license notice is in the vendored minified distribution and `game/vendor/LICENSE`.
