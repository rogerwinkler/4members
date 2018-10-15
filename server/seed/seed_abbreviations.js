var abbreviations
if (process.env.NODE_ENV === 'test') {
  abbreviations = require('./test_abbreviations.json')
} else {
  abbreviations = require('./abbreviations.json')
}
const AbbreviationsHelpers = require('../src/db/AbbreviationsHelpers')
const Abbreviation = require('../src/models/Abbreviation')
const debugLoadAbbreviations = require('debug')('4members.seed_abbreviations.loadAbbreviations')

module.exports = {
  async loadAbbreviations() {
    debugLoadAbbreviations('INPUT: (none)')
    await AbbreviationsHelpers.deleteAll()
    for (var i=0; i<abbreviations.length; i++) {
      try {
        const abbreviation = new Abbreviation(abbreviations[i].id, abbreviations[i].abbr, abbreviations[i].name, abbreviations[i].active)
        const result = await AbbreviationsHelpers.insert(abbreviation)
        debugLoadAbbreviations('IN FOR LOOP: %o', result)
      } catch(e) {
        debugLoadAbbreviations('IN FOR LOOP: error=%s', e.message)
        return
      }
    }
    debugLoadAbbreviations('RETURNS: OK')
  }
}
