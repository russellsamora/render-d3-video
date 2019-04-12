# Render D3 Video

a CLI tool to generate videos from locally running server using d3 to override time.
Adapted from [Adam Pearce](https://roadtolarissa.com/d3-mp4/).

## Dependencies

- [node](https://nodejs.org)
- [ffmpeg](https://ffmpeg.org/)

## Installation

`npm install -g render-d3-video`

## Usage

#### JavaScript

First, you need to setup your JS to override the internal clock.

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
 -h, --help                          output usage information

```
