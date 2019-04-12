PHONY: scene concat

scene:
	ffmpeg -r 60 -f image2 -s 1080x1920 -i frames/$(ID)/%05d.png -vcodec libx264 -crf 17 -pix_fmt yuv420p scene-video/$(ID).mp4

concat:
	ffmpeg -f concat -i concat.txt -c copy concat.mp4

