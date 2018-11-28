PHONY: video

video-23:
	ffmpeg -r 60 -f image2 -s 1280x720 -i png/%05d.png -vcodec libx264 -crf 23 -pix_fmt yuv420p test-23.mp4
video-18:
	ffmpeg -r 60 -f image2 -s 1280x720 -i png/%05d.png -vcodec libx264 -crf 18 -pix_fmt yuv420p test-18.mp4
video-17:
	ffmpeg -r 60 -f image2 -s 1280x720 -i png/%05d.png -vcodec libx264 -crf 17 -pix_fmt yuv420p test-17.mp4
video-11:
	ffmpeg -r 60 -f image2 -s 1280x720 -i png/%05d.png -vcodec libx264 -crf 11 -pix_fmt yuv420p test-11.mp4
video-0:
	ffmpeg -r 60 -f image2 -s 1280x720 -i png/%05d.png -vcodec libx264 -crf 0 -pix_fmt yuv420p test-0.mp4

