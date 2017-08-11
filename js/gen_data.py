#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import logging
import json
import os

log = logging.getLogger()

ubase = 'http://dnd5eapi.co/api/'

def fetch(category):
	"""Fetch all category items from the dnd database"""
	items = requests.post(ubase+category+'/').json()
	log.info("Found %s %s" % (items['count'], category))
	slist = []
	for item in items['results']:
		log.info("fetching %s" % item['name'])
		slist.append(requests.get(item['url']).json())
	return slist

def main():
	for category in ['spells', 'features', 'classes', 'skills', 'subclasses']:
		jsonname = category +'.json'
		jsname = 'data_{category}.js'.format(category=category)
		# if the items have not be yet saved on disk, fetch them from the database and
		# save them 
		if not os.path.exists(jsonname):
			with open(jsonname, 'w') as target:
				target.write(json.dumps([item for item in fetch(category)], indent=4))
		else:
			log.warning(jsonname + ' already exists, remove the file to force the udpate from the online database.')
		with open(jsname, 'w') as target:
			target.write("""data_{category}= []
$.getJSON("js/{category}.json", function(json) {{
	data_{category} = json;
}});""".format(category=category))


if __name__ == '__main__':
	logging.basicConfig(level=logging.INFO)
	main()
