# [Pawell2418 Gallery](https://pawell2418.github.io)

Hello, this is my gallery. I also host my images at [Twitter](https://twitter.com/Pawell2418) and [DeviantArt](https://www.deviantart.com/pawell2418).

**<https://pawell2418.github.io/>**

Now you may ask **why would i make my own website?** The answer is simple: as my gallery keeps growing, it is more and more bothersome to quickly browse it. I am not aware of any modern website which allows hosting art and can show hundreds of thumbnails at once. So i made my own. **Why GitHub?** They offer 1 GB of storage, are easy to use, allow "nudity for artistic purposes and it seems they don't throttle bandwidth. And i can push new art with self-made script. Honestly show me better free web hosting i dare you.


# How to make your own gallery GUIDE

1. Download and install [Python](https://www.python.org/downloads/) on your computer (any modern version like 3.8 or higher should work)
2. Download my zipped [scripts MakeYourWEBSITE.zip](https://github.com/pawell2418/pawell2418.github.io/releases/download/v1.0.0/MakeYourWEBSITE.zip)
3. Unpack the zip file and go inside the folder **MakeYourWEBSITE**
4. There notice folder called **p** (as pictures), copy into it pictures you want to feature in your gallery
5. Run the file **1_massConverter.bat** (it will first install python library for manipulating with images [Pillow](https://pypi.org/project/Pillow/) and then run script **1_massConverter.py**)
6. This will generate folder **m** (miniatures) and file **2_tags.csv**
7. Use your favorite Office software to open the tags file. [Libre office](https://www.libreoffice.org) is free for example. During opening you have to select that **comma is separator**
8. Fill out the rating and tags. Feel free to use the software to sort the data by file name or date. The tags are separated by cells. Simply put as many tags as you want into the cells after rating
9. Run the file **3_massHTML.bat** which will use the data from file **2_tags.csv** and edit the file **index.html**
10. Open the file **index.html** in your browser and verify it all works
11. Edit the index.html in your favorite [text editor](https://notepad-plus-plus.org), HTML is pretty much self explanatory and any change will be instantly visible in your browser after you hit key F5
12. Upload to any hosting service like [github pages](https://pages.github.com/) and enjoy!
