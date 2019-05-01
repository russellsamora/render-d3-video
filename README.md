# Render D3 Video

a CLI tool to generate videos from locally running server using d3 to override time.
Adapted from [Adam Pearce](https://roadtolarissa.com/d3-mp4/). Real world examples: [Women's Issues Within Political Party Platforms](https://www.youtube.com/watch?v=-DXKDw8l0wY) and [The NBA Has a Defensive Three Seconds Problem](https://pudding.cool/2019/05/three-seconds).

#### Why use this instead of screen recording?
* **No jank**. This hacks the internal clock so you get a crisp frame-by-frame rendering so there is no jank (which can often happen with screen recording, especially with more complex animations and dom calculations).
* **Hi-resolution**. It uses a headless browser so you can render any dimensions, like 1920x1080, even if you're screen is smaller.


## Dependencies

- [node](https://nodejs.org)
- [ffmpeg](https://ffmpeg.org/)

## Installation

`npm install -g render-d3-video`

## Usage

#### JavaScript

First, you need to setup your JS to override the internal clock. You will also need to run a local server.

```JavaScript
// override perfomance.now so render-d3-video can control time
if (document.URL.includes('render-d3-video')) {
 window.currentTime = 0;
 performance.now = () => window.currentTime;
}

// create a global function for render-d3-video to kickoff OR manually below
window.renderD3Video = function renderD3Video({ width, height }) {
 return new Promise(resolve => {
 d3.select('main')
  .style('width', `${width}px`)
  .style('height', `${height}px`);

  resolve();
 })
};

function init() {
  // determine if we need to manually invoke rendering
  d3.timeout(() => {
   if (window.currentTime === undefined) {
    window.renderD3Video({ width: 960, height: 540 });
   }
  }, 100);
}

init();
```

See full [example](example).

#### CLI
Create a directory, and run the command within it. *Note*: All files will be written from the directory the command is executed from.

```
usage: render-d3-video [OPTIONS]

OPTIONS are:
 -V, --version                       output the version number
 -f, --frames <required>             number of frames to render
 -w, --width <required>              width of video
 -h, --height <required>             height of video
 -p, --port [optional]               port number, default is 4000
 -o, --output [optional]             output name, default is "output"
 -d, --deviceScaleFactor [optional]  the device pixel ratio, default is 1
 -b, --buffer [optional]             buffer between frames in ms, default is 50
 -h, --help                          output usage information

```

This will create a new directory called `rd3v-[output]`, and generate a subdirectory called `frames` with each frame as a `png`, and the resulting video `[output].mp4`.

## Tips
* Rule of thumb: if it is going to transition, style it with D3
* You can use CSS transforms with D3 transitions, but use pixels, not percents
