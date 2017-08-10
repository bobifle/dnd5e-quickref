#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import logging
import json
import os

log = logging.getLogger()

ubase = 'http://dnd5eapi.co/api/'
uspells = ubase + 'spells/'

class Spell(object):
	def __init__(self, name):
		self.name=name
		self._data = None

	@property
	def data(self):
		if self._data is None:
			spells = requests.post(uspells+'?name=%s' % self.name).json()
			if spells['count'] ==0:
				raise NameError(self.name)
			if spells['count'] >1:
				raise NameError('%s matches for %s' % (spells['count'], self.name))
			self._data = requests.get(spells['results'][0]['url']).json()
		return self._data

def fetchSpells():
	"""Fetch all spells from the dnd database"""
	spells = requests.post(uspells).json()
	log.info("Found %s spells" % spells['count'])
	slist = []
	for spell in spells['results']:
		log.info("fetching %s" % spell['name'])
		slist.append(requests.get(spell['url']).json())
	return slist

def main():
	jsonname = 'spells.json'
	jsname = 'data_spells.js'
	# if the spell have not be yet saved on disk, fetch them from the database and
	# save them 
	if not os.path.exists(jsonname):
		with open(jsonname, 'w') as target:
			target.write(json.dumps([spell for spell in fetchSpells()], indent=4))
	with open(jsname, 'w') as target:
		target.write("""data_spells = []
$.getJSON("js/spells.json", function(json) {
	data_spells = json;
});""")


if __name__ == '__main__':
	logging.basicConfig(level=logging.INFO)
	main()
	# s = Spell('Acid+Arrow')
