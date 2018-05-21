var dev_shortcuts
if (process.env.NODE_ENV === 'test') {
  dev_shortcuts = require('./test_dev_shortcuts.json')
} else {
  dev_shortcuts = require('./dev_shortcuts.json')
}
const DevShortcutsHelpers = require('../src/db/DevShortcutsHelpers')
const DevShortcut = require('../src/models/DevShortcut')
const debugLoadDevShortcuts = require('debug')('4members.seed_dev_shortcuts.loadDevShortcuts')

module.exports = {
  async loadDevShortcuts() {
    debugLoadDevShortcuts('INPUT: (none)')
    await DevShortcutsHelpers.deleteAll()
    for (var i=0; i<dev_shortcuts.length; i++) {
      try {
        const devShortcut = new DevShortcut(dev_shortcuts[i].id, dev_shortcuts[i].shortcut, dev_shortcuts[i].name, dev_shortcuts[i].active)
        const result = await DevShortcutsHelpers.insert(devShortcut)
        debugLoadDevShortcuts('IN FOR LOOP: %o', result)
      } catch(e) {
        debugLoadDevShortcuts('IN FOR LOOP: error=%s', e.message)
        return
      }
    }
    debugLoadDevShortcuts('RETURNS: OK')
  }
}
