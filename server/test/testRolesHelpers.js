const RolesHelpers = require('../src/db/RolesHelpers')
const roles = require('./roles.json')

var testIDs = []

// test findByName()
// fills testIDs[] 
async function test_findByName () {
  console.log('. *** START *** findByName() test roles...')
  testIDs =[]
  for (var i=0; i<roles.length; i++) {
    const rows = await RolesHelpers.findByName(roles[i].name)
    if (rows.length>0) { 
      console.log('.. role found: id=' + rows[0].id + ', name="' + rows[0].name + '"')
      testIDs.push(rows[0].id)
    } else {
      console.log('.. role of name="' + roles[i].name + '" not found')
    }
  }
  console.log('.. testIDs', testIDs)
  console.log('. *** END **** findByName() test roles...')
}

// test findById()
// expects testIDs[] to be filled 
// testIDs[] is not changed
async function test_findById () {
  console.log('. *** START *** findById() test roles...')
  for (var i=0; i<testIDs.length; i++) {
    const rows = await RolesHelpers.findById(testIDs[i])
    if (rows.length>0) { 
      console.log('.. role found: id=' + rows[0].id + ', name="' + rows[0].name + '"')
    } else {
      console.log('.. ERROR role of id=' + testIDs[i] + ' not found')
    }
  }
  console.log('.. testIDs', testIDs)
  console.log('. *** END **** findById() test roles...')
}

// test delete()
// testIDs[] will be emptied
async function test_delete() {
  console.log('. *** START *** delete() test roles...')
  for (var i=0; i<testIDs.length; i++) {
    const rows = await RolesHelpers.delete(testIDs[i])
    if (rows == []) {
      console.log('.. ERROR deleting test role of id=' + testIDs[i])
    } else {
      console.log('.. role deleted: id=' + rows[0].id + ', name="' + rows[0].name + '"')
    }
  }  
  testIDs = [] // if there was an error deleting, there might still be records in the table!!!
  console.log('.. testIDs', testIDs)
  console.log('. *** END **** delete() test roles...')
}

// test insert()
// fills testIDs[] accordingly
async function test_insert() {
  console.log('. *** START *** insert() test roles from "roles.json"...')
  for (var i=0; i<roles.length; i++) {
    try {
      const res = await RolesHelpers.insert(null, roles[i].name, roles[i].dsc, true)
      if (res.error && res.error.code != 1001) { // ignore already exists
        console.log('.. ERROR on insert(),' + res.error.code + ', ' + res.error.msg)
      } else {
        testIDs.push(res.rows[0].id)
        console.log('.. role id=' + res.rows[0].id + ', "' + roles[i].name + '" successfully inserted.')
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('.. testIDs', testIDs)
  console.log('. *** END **** insert() test roles from "roles.json"...')
}

// test update()
// no change on testIDs[]
async function test_update() {
  console.log('. *** START *** update() test roles...')
  for (var i=0; i<testIDs.length; i++) {
    try {
        const rows = await RolesHelpers.findById(testIDs[i])
        if (rows.length>0) { 
          console.log('.. role found: id=' + rows[0].id + ', name="' + rows[0].name + '", dsc="' + rows[0].dsc + '", active=' + rows[0].active)
          const res = await RolesHelpers.update(rows[0].id, 'testRoleName'+i, 'testRoleDsc'+i, false)
          if (res.error) {
          console.log('.. ERROR on update(), ' + res.error.code + ', ' + res.error.msg)
          } else {
            console.log('.. role updated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
          }
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('. *** END **** update() test roles...')
}

// test updateName()
// testIDs[] and test records are expected to be there
// no change to testIDs[]
async function test_updateName() {
  console.log('. *** START *** updateName() test roles...')
  for (var i=0; i<testIDs.length; i++) {
    try {
        const rows = await RolesHelpers.findById(testIDs[i])
        if (rows.length>0) { 
          console.log('.. role found: id=' + rows[0].id + ', name="' + rows[0].name + '", dsc="' + rows[0].dsc + '", active=' + rows[0].active)
          const res = await RolesHelpers.updateName(rows[0].id, 'testRoleName'+i)
          if (res.error) {
          console.log('.. ERROR on updateName(), ' + res.error.code + ', ' + res.error.msg)
          } else {
            console.log('.. role updated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
          }
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('. *** END **** updateName() test roles...')
}

// test updateDsc()
// testIDs[] and test records are expected to be there
// no change to testIDs[]
async function test_updateDsc() {
  console.log('. *** START *** updateDsc() test roles...')
  for (var i=0; i<testIDs.length; i++) {
    try {
        const rows = await RolesHelpers.findById(testIDs[i])
        if (rows.length>0) { 
          console.log('.. role found: id=' + rows[0].id + ', name="' + rows[0].name + '", dsc="' + rows[0].dsc + '", active=' + rows[0].active)
          const res = await RolesHelpers.updateDsc(rows[0].id, 'testRoleDsc'+i)
          if (res.error) {
          console.log('.. ERROR on updateDsc(), ' + res.error.code + ', ' + res.error.msg)
          } else {
            console.log('.. role updated: id=' + res.rows[0].id + ', name="' + res.rows[0].name + '", dsc="' + res.rows[0].dsc + '", active=' + res.rows[0].active)
          }
      }
    } catch(e) {
      console.log(e.stack)
    }
  }
  console.log('. *** END **** updateDsc() test roles...')
}

module.exports = {
  async test () {
    console.log('START TEST ***** RolesHelpers (roles) *****')
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
    console.log('END  TEST ***** RolesHelpers (roles) *****')   
  } 
}
