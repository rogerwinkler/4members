var countries
if (process.env.NODE_ENV === 'test') {
  countries = require('./test_countries.json')
} else {
  countries = require('./countries.json')
}
const CountriesHelpers = require('../src/db/CountriesHelpers')
const Country = require('../src/models/Country')
const debugLoadCountries = require('debug')('4members.seed_countries.loadCountries')

module.exports = {
  async loadCountries() {
    debugLoadCountries('INPUT: (none)')
    await CountriesHelpers.deleteAll()
    for (var i=0; i<countries.length; i++) {
      try {
        const country = new Country(countries[i].id, countries[i].iso2, countries[i].name, countries[i].active)
        const result = await CountriesHelpers.insert(country)
        debugLoadCountries('IN FOR LOOP: %o', result)
      } catch(e) {
        debugLoadCountries('IN FOR LOOP: error=%s', e.message)
        return
      }
    }
    debugLoadCountries('RETURNS: OK')
  }
}
