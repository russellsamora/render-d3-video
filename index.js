// adapted from https://roadtolarissa.com/d3-mp4/
const puppeteer = require('puppeteer');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const shell = require('shelljs');
const beep = require('beepbeep');

const FRAME_RATE = 1000 / 60;

// --- CUSTOM ---
const NUM_FRAMES = 5000;
const SCENE = 'three';
const WIDTH = 1080;
const HEIGHT = 1920;
const DEVICE_SCALE = 1;

// --- CUSTOM ---

const OUT_PATH = `${__dirname}/frames/${SCENE}`;


mkdirp(OUT_PATH);
shell.exec(`rm ${OUT_PATH}/*.png`);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function init() {
  // open new tab and wait for data to load
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4000?render-d3-video');

  // let the page load
  console.log(`loading ${SCENE}...`);
  await sleep(5000);

	// kick it off
	const pageOpts = { width: WIDTH, height: HEIGHT };
	await page.evaluate(arg => window.renderStart(arg), pageOpts);

  console.log('rendering frames...');
  for (let f of d3.range(NUM_FRAMES)) {
    console.log(`${f + 1} of ${NUM_FRAMES}`);
		
		await page.evaluate(f => (currentTime = f), f * FRAME_RATE);
		
    // chill for 50ms for some reason
    await sleep(50);

    const name = d3.format('05')(f);
    const path = `${OUT_PATH}/${name}.png`;

		const viewOpts = { width: WIDTH, height: HEIGHT, deviceScaleFactor: DEVICE_SCALE };
    await page.setViewport(viewOpts);
    await page.screenshot({ path });
  }

  browser.close();
  beep(3, 500);
}

init();
