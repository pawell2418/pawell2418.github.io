#to have Pillow library installed you first need to run this command
#py -m pip install
from PIL import Image

import os
import sys
import pathlib
import datetime
import time

def main():

	location = pathlib.Path(__file__).parent.resolve()
	pics = "p"
	thumb = "m"

	print("Starting mass converter")
	print("looking for folder called ", pics)

	try:
		dir_list = os.listdir(pics)
	except FileNotFoundError as e:
		print("you have to create folder called ", pics, " and move all your images for conversion there")
		exit()

	print("Found ", len(dir_list), " files, working...")
	destination = os.path.join(location, thumb)
	if os.path.exists(destination) == False:
		os.mkdir(destination)
		
		
	tagsTable = open("2_tags.csv", "w")
	tagsTable.write("filename,date,rating,tags\n")
	

	dimensions = (128, 72)
	count = 0
	for f in dir_list:
		count = count + 1
		print("working ", count, ": ", f)
		outfile = os.path.join(thumb, f)
		infile = os.path.join(location, pics, f)
		#i felt like retard trying to find sequence of code which would turn float number of miliseconds since epoch into readable date
		dat = time.ctime(os.path.getmtime(infile))
		dat2 = datetime.datetime.strptime(dat, "%c")
		dat3 = dat2.strftime("%Y-%m-%d")
		#dat2 = str(datetime.datetime.strptime(dat, "%a %b %d %H:%M:%S %Y"))
		#dat2 = dat.strftime("%Y-%m-%d")
		
		tagsTable.write(f + "," + dat3 + ",\n")
		im = Image.open(infile)
		im.thumbnail(dimensions, Image.LANCZOS)
		im.save(outfile, "JPEG", quality=30)
	tagsTable.close()


if __name__ == "__main__":
    main()