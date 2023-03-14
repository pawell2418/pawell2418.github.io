# pip3 install PyPDF2
# apt install PyPDF2


from PyPDF2 import PdfReader
import os

source = "source.pdf"
location = "sourceRaw"

if not os.path.exists(os.getcwd() + '/' + location):
    os.makedirs(os.getcwd() + '/' + location, exist_ok=True) 

reader = PdfReader(source)
pageNum = 0
imageNum = 0
for page in reader.pages:
	pageNum = pageNum + 1
	for image in page.images:
		imageNum = imageNum + 1
		with open(location + "/" + str(pageNum) + "-" + str(imageNum) + image.name, "wb") as fp:
			fp.write(image.data)

