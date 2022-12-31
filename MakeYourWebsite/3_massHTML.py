import os
import sys
import pathlib
import datetime
import time

def main():

	location = pathlib.Path(__file__).parent.resolve()
	tagfilename = "2_tags.csv"
	htmlfilename = "index.html"

	print("Starting HTML mass generator")
	print("looking for files called ", tagfilename, " and ", htmlfilename)

	try:
		f = open(tagfilename,"r")
		htmlfile = open (htmlfilename, "a")
	except FileNotFoundError as e:
		print("you have to copy file", tagfilename, "and ", htmlfilename, " into same path as this script.")
		exit()
	lines = f.readlines()
	f.close()
	

	#1st line is header, remove it
	lines.pop(0)
	linenumber = 1
	for line in lines:
		linenumber = linenumber + 1
		tags = line.split(",")
		if (len(tags)<3):
			print("error on line ", linenumber, " not enough TAGS!")
			exit()
		tagfile = tags.pop(0)
		tagdate = tags.pop(0)
		tagrate = tags.pop(0)
		tagtag = ""
		for t in tags:
			tt = t.strip()
			if (len(tt)<1):
				continue
			tagtag = tagtag + tt + ","
		#remove last comma
		tagtag = tagtag[:-1]
		#<a href="p/140.jpg"><img src="m/140.jpg" title="tags"></a>
		htmlfile.write("<a href='p/" + tagfile + "' data-d='" + tagdate +"' data-r='" + tagrate + "'><img src='m/"+ tagfile + "' title='" + tagtag + "'></a>\n")
		
	footer = """
</article>
<footer>
	<hr>
	<p>If you want to repost my stuff, please credit me. If you want to make money off it you must first ask me for permission.</p>
	<p><b>The end.</b></p>
</footer>
</body>
</html>"""
	htmlfile.write(footer)
	htmlfile.close();
	print("Succesfully written ", (linenumber - 1), " lines of tags into ", htmlfilename)



if __name__ == "__main__":
    main()