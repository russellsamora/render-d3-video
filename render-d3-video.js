#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer');
const d3 = require('d3');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const shell = require('shelljs');

const VERSION = '0.0.1';
const FRAME_RATE = 1000 / 60;
const CWD = process.cwd();

program.version(VERSION)
	.option('-f, --frames <required>', 'number of frames to render', parseInt)
	.option('-w, --width <required>', 'width of video', parseInt)
	.option('-h, --height <required>', 'height of video', parseInt)
	.option('-p, --port [optional]', 'port number, default is 4000', parseInt)
	.option('-o, --output [optional]', 'output name, default is "output"')
	.option('-d, --deviceScaleFactor [optional]', 'the device pixel ratio, default is 1', parseFloat)
	.parse(process.argv);

// arguments
let { frames, width, height, output, deviceScaleFactor } = program;
port = 4000;
output = output || 'output';
deviceScaleFactor = deviceScaleFactor || 1;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function invalid() {
	// validate
	if (isNaN(frames)) return '--frames is not a valid number';
	if (isNaN(width)) return '--width is not a valid number';
	if (isNaN(height)) return '--height is not a valid number';
	if (isNaN(port)) '--port is not a valid number';
	if (!output) return '--output is not a valid string';
	if (isNaN(deviceScaleFactor)) return '--deviceScaleFactor is not a valid number';	
	return false;
}

function setupDir() {
	const path = `${CWD}/rd3v-${output}`;
	return path;
}

function cleanDir(path) {
	return new Promise((resolve, reject) => {
		const framePath = `${path}/frames`;
		rimraf(path, (err) => {
			if (err) reject(err);
			else {
				mkdirp(framePath);
				resolve();
			}
		});
	});
}

async function renderFrames(path) {
	
	console.log(`loading http://localhost:${port}...`);
	const framePath = `${path}/frames`;

	// open new tab and wait for data to load
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	try {
		await page.goto(`http://localhost:${port}?render-d3-video`);
	} catch(error) {
		return Promise.reject('error loading page');
	}
	

	try {
		// let the page load
		await sleep(5000);

		// kick it off
		const pageOpts = { width, height };
		await page.evaluate(arg => window.renderD3Video(arg), pageOpts);

		console.log(`rendering frames to ${framePath}...`);
		for (let f of d3.range(frames)) {
			console.log(`${f + 1} of ${frames}`);

			await page.evaluate(f => (currentTime = f), f * FRAME_RATE);

			// chill for 50ms for some reason
			await sleep(50);

			const file = d3.format('05')(f);
			const path = `${framePath}/${file}.png`;

			const viewOpts = { width, height, deviceScaleFactor };
			await page.setViewport(viewOpts);
			await page.screenshot({ path });
		}
		browser.close();
		return Promise.resolve();
	} catch(error) {
		return Promise.reject(error);
	}
}

async function renderVideo(path) {
	console.log('rendering video...');
	const res = `${width}x${height}`;
	const input = `${path}/frames/%05d.png`;
	const file = `${path}/result.mp4`;
	const command = `ffmpeg -r 60 -f image2 -s ${res} -i ${input} -vcodec libx264 -crf 17 -pix_fmt yuv420p ${file} -hide_banner -loglevel panic`;
	// console.log(command);
	shell.exec(command);
	return Promise.resolve();
}

async function init() {
	const isInvalid = invalid();
	if (isInvalid) {
		console.error(isInvalid);
		process.exit();
	} else {
		try {
			const path = setupDir();
			// await cleanDir(path);
			// await renderFrames(path);
			await renderVideo(path);
		} catch(error) {
			console.error(error);
		}
		process.exit();
	}
}

init();









