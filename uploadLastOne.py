#pip3 install PyGithub requests
import github
import base64
from PIL import Image

import os
import sys
import pathlib
import datetime
import time
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning) 

def main():
	print("")
	print("Starting upload last pic python script.")
	if (len(sys.argv) != 2):
		print("You must supplement github tokey key to run this script!")
		exit()
	
	
	locPictures = "F:/DRAWING/"
	locTags = "F:/DRAWING/WEBSITE/2_tags.csv"
	locMiniatures = "F:/DRAWING/WEBSITE/m/"
	locHtml = "F:/DRAWING/WEBSITE/index.html"
	accessToken = sys.argv[1]
	branch = "main"
	repoName = "pawell2418/pawell2418.github.io"
	
	print("Loading all tags")
	listAll = os.listdir(locPictures)
	listPics = []
	for f in listAll:
		fileUrl = os.path.join(locPictures, f)
		if (os.path.isfile(fileUrl) == False): continue
		temp = f.split(".");
		if (len(temp) < 2): continue
		if (temp[1] != "jpg"): continue
		dat = time.ctime(os.path.getmtime(fileUrl))
		dat2 = datetime.datetime.strptime(dat, "%c")
		dat3 = dat2.strftime("%Y-%m-%d")
		listPics.append((fileUrl, f, dat3, dat2));
		
	def comp(val):
		return val[3]
	listPics.sort(key=comp, reverse=True)
	lastArt = listPics[0]
	print("Last art is ", lastArt[1], " ", lastArt[2])
	
	print("Making miniature")
	newMiniatureLoc = os.path.join(locMiniatures, lastArt[1])
	if (os.path.isfile(newMiniatureLoc)):
		print("WE ALREADY UPLOADED THIS ONE!")
		exit()
	im = Image.open(lastArt[0])
	im.thumbnail((128, 72), Image.LANCZOS)
	
	rating = 0
	while (True):
		text = input("Enter rating: ").strip()
		if (text.isnumeric()):
			rating = int(text)
			if (rating >= 0) and (rating <= 10):
				break

	allTags = suckAllTags(locTags)
	print("")
	print("Dont forget:  doodle / study  / master")
	print("				gimp / krita  / rebelle")
	print("				digi / trad ")
	print("		name of book / art ")
	print("			  animal / object / machine")
	print("			   color / outline/ mono")
	print("  head / nude / body / male   / female ")
	print("")
	
	count = 1
	newTags = set()
	
	while(True):
		command = input("Enter tag " + str(count) + ": ").strip()
		if (len(command) < 1): break
		if (command in allTags):
			newTags.add(command)
			count = count + 1
		else:
			command2 = input("NEW tag, you Sure? ").strip()
			if (command2 != "Sure"): continue
			newTags.add(command)
			count = count + 1
	
	if (len(newTags) < 2):
		print("I cant allow you that Dave, put more tags!")
		exit()
	tagsmerged = ""
	for t in newTags:
		tagsmerged = tagsmerged + "," + t
	tagsmerged = tagsmerged[1:]
	
	print("Saving files")
	im.save(newMiniatureLoc, "JPEG", quality=30)
	
	ft = open(locTags, "a")
	fhtml = open(locHtml, "r")
	ft.write(lastArt[1] + "," + lastArt[2] + "," + str(rating) + "," + tagsmerged + ",")
	ft.write("\n")
	ft.close()
	
	#<a href='p/190.jpg' data-d='2022-12-28' data-r='5'><img src='m/190.jpg' title='digi,rebelle,color,study,nature,object,master,naturway'></a>
	newHtml = "<a href='p/"+lastArt[1]+"' data-d='"+lastArt[2]+"' data-r='"+str(rating)+"'><img src='m/"+lastArt[1]+"' title='"+tagsmerged+"'></a>\n"
	oldHtml = fhtml.readlines()
	fhtml.close()
	fhtml = open(locHtml, "w")
	
	for text in oldHtml:
		fhtml.write(text)
		if (text.strip() == "<!--HERE-->"):
			fhtml.write(newHtml)
	fhtml.close()
	
	print("Uploading to github")
	g = github.Github(accessToken)
	repo = g.get_repo(repoName)
	
	uploadPicLoc = "docs/p/" + lastArt[1]
	uploadPicData = base64.b64encode(open(lastArt[0], "rb").read())
	blob1 = repo.create_git_blob(uploadPicData.decode("utf-8"), "base64")
	element1 =  github.InputGitTreeElement(path=uploadPicLoc, mode='100644', type='blob', sha=blob1.sha)
	
	uploadMiniLoc = "docs/m/" + lastArt[1]
	uploadMiniData = base64.b64encode(open(newMiniatureLoc, "rb").read())
	blob2 = repo.create_git_blob(uploadMiniData.decode("utf-8"), "base64")
	element2 =  github.InputGitTreeElement(path=uploadMiniLoc, mode='100644', type='blob', sha=blob2.sha)
	
	uploadIndexLoc = "docs/index.html"
	uploadIndexData = open(locHtml, "r").read()
	blob3 = repo.create_git_blob(uploadIndexData, "utf-8")
	element3 = github.InputGitTreeElement(path=uploadIndexLoc, mode='100644', type='blob', sha=blob3.sha)
	
	uploadTagsLoc = "docs/2_tags.csv"
	uploadTagsData = open(locTags, "r").read()
	blob4 = repo.create_git_blob(uploadTagsData, "utf-8")
	element4 = github.InputGitTreeElement(path=uploadTagsLoc, mode='100644', type='blob', sha=blob4.sha)
	
	commit_message = "Uploaded art " + lastArt[1]
	branch_sha = repo.get_branch(branch).commit.sha
	base_tree = repo.get_git_tree(sha=branch_sha)
	tree = repo.create_git_tree([element1, element2, element3, element4], base_tree)
	parent = repo.get_git_commit(sha=branch_sha)
	commit = repo.create_git_commit(commit_message, tree, [parent])
	branch_refs = repo.get_git_ref("heads/" + branch)
	branch_refs.edit(sha=commit.sha)
	
	print("Successfully commited " + str(commit))
	

def suckAllTags(fileLocation):
	tags = set()
	f = open(fileLocation, "r")
	AllLines = f.readlines()
	f.close()
	AllLines.pop(0) #tableheader
	for line in AllLines:
		cells = line.split(",")
		cells.pop(0) #filename
		cells.pop(0) #date
		cells.pop(0) #rating
		for c in cells:
			tag = c.strip()
			if (len(tag) < 1): continue
			tags.add(tag)
	
	return tags

if __name__ == "__main__":
	main()