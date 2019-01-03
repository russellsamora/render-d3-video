#!/bin/bash

for f in frames/* ; do
	b=""
	name="${f/frames\//$b}"
	# delete frames 0-16
	# for (( num=0; num<=16; num++ )); do
	# 	p=$(printf "%05d" $num);
	# 	rm "frames/$name/$p.png";
	# done;
	ffmpeg -r 60 -f image2 -s 1920x1080 -start_number 0 -i frames/$name/%05d.png -vcodec libx264 -crf 17 -pix_fmt yuv420p scene-video/$name.mp4
done