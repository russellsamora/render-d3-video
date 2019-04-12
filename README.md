# Render D3 Video

a CLI tool to generate videos from locally running server using d3 to override time.
Adapted from [Adam Pearce](https://roadtolarissa.com/d3-mp4/).

## Dependencies

- [node](https://nodejs.org)
- [ffmpeg](https://ffmpeg.org/)

## Installation

`npm install -g render-d3-video`

## Usage

Create a directory, and run the command within it. *Note*: All files will be written from the directory the command is executed from.

```
usage: render-d3-video [options]

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
