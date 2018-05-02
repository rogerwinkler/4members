const AccessCodesHelpers = require('../src/db/AccessCodesHelpers')
const access_codes = require('./access_codes.json')

var testIDs = []

// test findByName()
// fills testIDs[] 
async function test_findByName () {
  console.log('. *** START *** findByName() test access_codes...')
  testIDs =[]
  for (var i=0; i<access_codes.length; i++) {
    const rows = await AccessCodesHelpers.findByName(access_codes[i].name)
    if (rows.length>0) { 
      console.log('.. access code found: id=' + rows[0].id + ', name="' + rows[0].name + '"')
      testIDs.push(rows[0].id)
    } else {
      console.log('.. access code of name="' + access_codes[i].name + '" not found')
    }
  }
  console.log('.. testIDs', testIDs)
  console.log('. *** END **** findByName() test access_codes...')
}

// test findById()
// expects testIDs[] to be filled 
// testIDs[] is not changed
async function test_findById () {
  console.log('. *** START *** findById() test access_codes...')
  for (var i=0; i<testIDs.length; i++) {
    const rows = await AccessCodesHelpers.findById(testIDs[i])
    if (rows.length>0) { 
      console.log('.. access code found: id=' + rows[0].id + ', name="' + rows[0].name + '"')
    } else {
      console.log('.. ERROR access code of id=' + testIDs[i] + ' not found')
    }
  }
  console.log('.. testIDs', testIDs)
  console.log('. *** END **** findById() test access_codes...')
}

// test delete()
// testIDs[] will be emptied
async function test_delete() {
  console.log('. *** START *** delete() test access_codes...')
  for (var i=0; i<testIDs.length; i++) {
    const rows = await AccessCodesHelpers.delete(testIDs[i])
    if (rows == []) {
      console.log('.. ERROR deleting test access code of id=' + testIDs[i])
    } else {
      console.log('.. access code deleted: id=' + rows[0].id + ', name="' + rows[0].name + '"')
    }
  }  
  testIDs = [] // if there was an error deleting, there might still be records in the table!!!
  console.log('.. testIDs', testIDs)
  console.log('. *** END **** delete() test access_codes...')
}

// test insert()
// fills testIDs[] accordingly
async function test_insert() {
  console.log('. *** START *** insert() test access_codes from "access_codes.json"...')
  for (var i=0; i<access_codes.length; i++) {
    try {
      const res = await AccessCodesHelpers.insert(null, access_codes[i].name, access_codes[i].dsc, true)
      if (res.error && res.error.code != 1001) { // ignore already exists
        console.log('.. ERROR on insert(),' + res.error.code + ', ' + res.error.msg)
      } else {
        testIDs.push(res.rows[0].id)
        console.log('.. access code id=' + res.rows[0].id + ', "' + access_codes[i].name + '" successfully inserted.')
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('.. testIDs', testIDs)
  console.log('. *** END **** insert() test access_codes from "access_codes.json"...')
}

// test update()
// no change on testIDs[]
async function test_update() {
  console.log('. *** START *** update() test access_codes...')
  for (var i=0; i<testIDs.length; i++) {
    try {
        const rows = await AccessCodesHelpers.findById(testIDs[i])
        if (rows.length>0) { 
          console.log('.. access code found: id=' + rows[0].id + ', name="' + rows[0].name + '", dsc="' + rows[0].dsc + '", active=' + rows[0].active)
          const res = await AccessCodesHelpers.update(rows[0].id, 'testAccessCodeName'+i, 'testAccessCodeDsc'+i, false)
          if (res.error) {
          console.log('.. ERROR on update(), ' + res.error.code + ', ' + res.error.msg)
          } else {
            console.log('.. access code updated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
          }
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('. *** END **** update() test access_codes...')
}

// test updateName()
// testIDs[] and test records are expected to be there
// no change to testIDs[]
async function test_updateName() {
  console.log('. *** START *** updateName() test access_codes...')
  for (var i=0; i<testIDs.length; i++) {
    try {
        const rows = await AccessCodesHelpers.findById(testIDs[i])
        if (rows.length>0) { 
          console.log('.. access code found: id=' + rows[0].id + ', name="' + rows[0].name + '", dsc="' + rows[0].dsc + '", active=' + rows[0].active)
          const res = await AccessCodesHelpers.updateName(rows[0].id, 'testAccessCodeName'+i)
          if (res.error) {
          console.log('.. ERROR on updateName(), ' + res.error.code + ', ' + res.error.msg)
          } else {
            console.log('.. access code updated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
          }
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('. *** END **** updateName() test access_codes...')
}

// test updateDsc()
// testIDs[] and test records are expected to be there
// no change to testIDs[]
async function test_updateDsc() {
  console.log('. *** START *** updateDsc() test access_codes...')
  for (var i=0; i<testIDs.length; i++) {
    try {
        const rows = await AccessCodesHelpers.findById(testIDs[i])
        if (rows.length>0) { 
          console.log('.. access code found: id=' + rows[0].id + ', name="' + rows[0].name + '", dsc="' + rows[0].dsc + '", active=' + rows[0].active)
          const res = await AccessCodesHelpers.updateDsc(rows[0].id, 'testAccessCodeDsc'+i)
          if (res.error) {
          console.log('.. ERROR on updateDsc(), ' + res.error.code + ', ' + res.error.msg)
          } else {
            console.log('.. access code updated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
          }
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('. *** END **** updateDsc() test access_codes...')
}

// test activate()
// testIDs[] and test records are expected to be there
// no change to testIDs[]
async function test_activate() {
  console.log('. *** START *** activate() test access_codes...')
  for (var i=0; i<testIDs.length; i++) {
    try {
        const rows = await AccessCodesHelpers.findById(testIDs[i])
        if (rows.length>0) { 
          console.log('.. access code found: id=' + rows[0].id + ', name="' + rows[0].name + '", dsc="' + rows[0].dsc + '", active=' + rows[0].active)
          const res = await AccessCodesHelpers.activate(rows[0].id)
          if (res.error) {
          console.log('.. ERROR on activate(), ' + res.error.code + ', ' + res.error.msg)
          } else {
            console.log('.. access code activated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
          }
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('. *** END **** activate() test access_codes...')
}

// test inactivate()
// testIDs[] and test records are expected to be there
// no change to testIDs[]
async function test_inactivate() {
  console.log('. *** START *** inactivate() test access_codes...')
  for (var i=0; i<testIDs.length; i++) {
    try {
        const rows = await AccessCodesHelpers.findById(testIDs[i])
        if (rows.length>0) { 
          console.log('.. access code found: id=' + rows[0].id + ', name="' + rows[0].name + '", dsc="' + rows[0].dsc + '", active=' + rows[0].active)
          const res = await AccessCodesHelpers.inactivate(rows[0].id)
          if (res.error) {
          console.log('.. ERROR on inactivate(), ' + res.error.code + ', ' + res.error.msg)
          } else {
            console.log('.. access code inactivated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
          }
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('. *** END **** inactivate() test access_codes...')
}



module.exports = {
  async test () {
    console.log('START TEST ***** AccessCodesHelpers (access_codes) *****')
    await test_findByName()
    await test_delete()
    await test_insert()
    await test_findById()
    await test_update()
    await test_delete()
    await test_insert()
    await test_updateName()
    await test_delete()
    await test_insert()
    await test_updateDsc()
    await test_delete()
    await test_insert()
    await test_inactivate()
    await test_activate()
    console.log('END  TEST ***** AccessCodesHelpers (access_codes) *****')   
  } 
}
