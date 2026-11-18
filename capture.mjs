import { chromium } from '/opt/muse/assets/spaces/ts-runtime/dist/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const root = resolve(new URL('.', import.meta.url).pathname);
const shots = resolve(root, 'screenshots');
await mkdir(shots, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/meta-chromium/chrome',
  headless: true,
  args: [
    '--no-sandbox',
    '--hatch-webgl-allowed-domains-file=/var/lib/hatch-browser/rootfs-base/usr/share/hatch/chromium/webgl-allowed-domains.txt',
    '--hatch-webgl-allowed-domains-sha256=8097045f0459c96c4cdc76e3a1af4e0f43f640b4b59c43d6db35e3641c0264c6',
  ],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
await page.goto(pathToFileURL(resolve(root, 'game/index.html')).href);
await page.waitForFunction(() => window.VC?.renderer);
await page.waitForTimeout(900);
await page.screenshot({ path: resolve(shots, '2-title.jpg'), type: 'jpeg', quality: 80 });
await page.evaluate(() => {
  VC.player.x = 4;
  VC.player.z = 28;
  VC.player.mesh.position.set(4, 0, 28);
});
await page.evaluate(() => document.querySelector('#start').click());
await page.waitForTimeout(250);
await page.screenshot({ path: resolve(shots, '3-on-foot.jpg'), type: 'jpeg', quality: 72, timeout: 20000, animations: 'disabled' });
await page.keyboard.press('e');
await page.keyboard.down('w');
await page.waitForTimeout(450);
await page.keyboard.up('w');
await page.keyboard.press('f');
await page.waitForTimeout(100);
await page.screenshot({ path: resolve(shots, '1-cover.jpg'), type: 'jpeg', quality: 72, timeout: 20000, animations: 'disabled' });
await page.evaluate(() => {
  const g = window.VC;
  g.chapter = 1;
  g.stage = 1;
  g.player.x = -144;
  g.player.z = -195;
  if (!g.player.car) g.player.car = g.createCar(-144, -195, '#f16d47', Math.PI);
  g.player.car.x = -144;
  g.player.car.z = -195;
  g.player.car.speed = 0;
  g.player.car.angle = Math.PI;
  g.player.angle = Math.PI;
  g.addHeat(2.2);
  g.spawnGuard(-150, -207);
  g.spawnGuard(-138, -207);
  g.say('Inez: Two syndicate guards. F to fire. The ledger is at the gold marker.');
  g.cameraReady = false;
});
await page.waitForTimeout(250);
await page.screenshot({ path: resolve(shots, '4-ledger-run.jpg'), type: 'jpeg', quality: 72, timeout: 20000, animations: 'disabled' });
const report = await page.evaluate(() => {
  const g = VC;
  return { webgl: !!g.renderer.getContext(), triangles: g.renderer.info.render.triangles, cars: g.cars.length, pedestrians: g.pedestrians.length, police: g.patrols.length, chapter: g.chapter, heat: g.heat, titleOpaque: getComputedStyle(document.querySelector('#title')).backgroundColor };
});
await writeFile(resolve(root, 'capture-report.json'), JSON.stringify({ report, errors }, null, 2));
await browser.close();
if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
console.log(JSON.stringify(report));
