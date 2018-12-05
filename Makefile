PHONY: scene concat

scene:
	ffmpeg -r 60 -f image2 -s 1280x720 -i png-p1980/%05d.png -vcodec libx264 -crf 17 -pix_fmt yuv420p scene-video/p1980.mp4

concat:
	ffmpeg -f concat -i concat.txt -c copy concat.mp4

