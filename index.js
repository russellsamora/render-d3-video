// adapted from https://roadtolarissa.com/d3-mp4/
const puppeteer = require('puppeteer');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const shell = require('shelljs');

// const arg = process.argv.slice(2);
// console.log(arg)

const NUM_FRAMES = 871;
const SCENE = 'p1980';
const OUT_PATH = `${__dirname}/png-${SCENE}`;

const width = 1280;
const height = 720;
const deviceScaleFactor = 1;

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
  console.log('loading...');
  await sleep(5000);

  // kick it off
  await page.evaluate(s => window.start(s), SCENE);
  // step through each frame:
  // - increment currentTime on the page
  // - save a screenshot
  console.log('rendering frames...');
  for (let f of d3.range(NUM_FRAMES)) {
    console.log(`${f + 1} of ${NUM_FRAMES}`);
    await page.evaluate(f => (currentTime = (f * 1000) / 60), f);
    // chill for 50ms for some reason
    await sleep(50);

    const name = d3.format('05')(f);
    const path = `${OUT_PATH}/${name}.png`;

    await page.setViewport({ width, height, deviceScaleFactor });
    // const chartEl = await page.$('.chart');
    await page.screenshot({ path });
  }

  browser.close();
}

init();
