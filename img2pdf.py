# pip3 install img2pdf
# apt install img2pdf

import img2pdf
import os

location = "C:/Users/PawellWin7/Desktop/bookraw"
bookTitle = "Geometrical Drawing and Design"
bookAuthor = "J. Humphrey Spanton"
forceA4 = False


# convert all files ending in .jpg .png jp2 inside a directory
dirname = location
imgs = []
for fname in os.listdir(dirname):
	if fname.endswith(".jpg"): pass
	elif fname.endswith(".png"): pass
	elif fname.endswith(".jp2"): pass
	else:
		continue
	path = os.path.join(dirname, fname)
	if os.path.isdir(path):
		continue
	imgs.append(path)



with open(bookTitle + ".pdf","wb") as f:
	if (forceA4):
		a4inpt = (img2pdf.mm_to_pt(210),img2pdf.mm_to_pt(297))
		layout_fun = img2pdf.get_layout_fun(a4inpt)
		f.write(img2pdf.convert(imgs, author = bookAuthor, title = bookTitle, layout_fun=layout_fun)) #force A4 layout
	else:
		f.write(img2pdf.convert(imgs, author = bookAuthor, title = bookTitle))