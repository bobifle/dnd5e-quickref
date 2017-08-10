#!/usr/bin/env python
# -*- coding: utf-8 -*-
import urllib
import zipfile
import os
import logging
import glob

log = logging.getLogger()

# black
# url = """http://game-icons.net/archives/png/zip/ffffff/000000/game-icons.net.png.zip"""
# transparent
url = """http://game-icons.net/archives/png/zip/ffffff/transparent/game-icons.net.png.zip"""

# list of icons not present in the download anymore
old = ['crawl.png'] + glob.glob('white-book*')

def main():
	filehandle, _ = urllib.urlretrieve(url)
	zip_file_object = zipfile.ZipFile(filehandle, 'r')
	if not zip_file_object.namelist(): return
	with open('../css/icons.css', 'w') as css:
		for f in zip_file_object.namelist():
			if not f.endswith('png'): continue
			log.info(f)
			bname = os.path.basename(f)
			# write the png file
			with open(bname, 'wb') as target:
				target.write(zip_file_object.open(f).read())
			# write the related css rule
			css.write(""".icon-%s { background-image: url(../img/%s);}\n""" % (os.path.splitext(bname)[0], bname))
		for bname in old:
			css.write(""".icon-%s { background-image: url(../img/%s);}\n""" % (os.path.splitext(bname)[0], bname))

if __name__ == '__main__':
	logging.basicConfig(level=logging.INFO)
	main()

