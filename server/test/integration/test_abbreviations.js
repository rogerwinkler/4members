process.env.NODE_ENV = 'test'

const seed_abbreviations = require('../../seed/seed_abbreviations')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../src/app');

describe('routes : /api/v0.01/abbreviations', function() {

  var testToken = ''

  beforeEach( async function() {
    await seed_abbreviations.loadAbbreviations();
    // done();
  });

  afterEach(function(done) {
    done();
  });


  
  /////////////////////////////////////////////////////////
  // get and set testToken
  describe('GET /api/v0.01/login', () => {
    it('should login and set testToken for authenticated testing hereafter...', (done) => {
      chai.request(server)
      .post('/api/v0.01/login')
      .send({
        'username' : 't1',
        'password' : 'pwdtest1'
      })
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be no error
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        res.body.data[0].should.have.property('token')
        testToken = res.body.data[0].token
        done();
      });
    });
  });



  /////////////////////////////////////////////////////////
  // getAll
  describe('GET /api/v0.01/abbreviations', () => {
    it('should respond with all abbreviations', (done) => {
      chai.request(server)
      .get('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": [at least 3 abbr objects]}
        res.body.data.length.should.least(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'abbr', 'name', 'active'
        );
        done();
      });
    });
  });


  /////////////////////////////////////////////////////////
  // get(id)
  describe('GET /api/v0.01/abbreviations/:id', () => {
    it('should respond with a single abbreviation', (done) => {
      chai.request(server)
      .get('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 object}
        res.body.data.length.should.eql(1);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'abbr', 'name', 'active'
        );
        done();
      });
    });
    it('should throw an error if the abbreviation id is null', (done) => {
      chai.request(server)
      .get(`/api/v0.01/abbreviations/${null}`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('invalid input syntax for integer');
        done();
      });
    });
    it('should throw an error if the abbreviation is not found', (done) => {
      chai.request(server)
      .get(`/api/v0.01/abbreviations/100000`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.eql('Abbreviation not found');
        done();
      });
    });
  });


  /////////////////////////////////////////////////////////
  // insert(id, name, dsc, active)
  describe('POST /api/v0.01/abbreviations', () => {
    it('should respond with a success message along with a single abbreviation that was added', (done) => {
      chai.request(server)
      .post('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id       : 100000,
        abbr : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS',
        active   : true
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 object}
        res.body.data[0].should.include.keys(
          'id', 'abbr', 'name', 'active'
        );
        done();
      });
    });
    it('should generate id automatically when not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr: 'ssssssss',
        name    : 'SuperSuSSonianSuperSoundSS',
        active  : false
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 object}
        res.body.data[0].should.include.keys(
          'id', 'abbr', 'name', 'active'
        );
        done();
      });
    });
    it('should set active to true (default) if not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id       : 100000,
        abbr : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS'
      })
      .end((err, res) => {
        // there should be no errors    
        should.not.exist(err);
        // there should be a 201 status code
        // (indicating that something was "created")
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 object}
        res.body.data[0].should.include.keys(
          'id', 'abbr', 'name', 'active'
        );
        // the id should be 100000
        res.body.data[0].id.should.equal(100000);
        done();
      });
    });
    it('should throw an error if the abbreviation already exists', (done) => {
      chai.request(server)
      .post('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id       : 1,
        abbr : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS',
        active   : true
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('duplicate key value violates unique constraint');
        done();
      });
    });
    it('should throw an error if abbreviation is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id       : 100000,
        name     : 'SuperSuSSonianSuperSoundSS',
        active   : true
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });
    });
    it('should throw an error if name is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id       : 100000,
        abbr : 'ssssssss',
        active   : true
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });
    });
    it('should throw an error if wrong property is provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id       : 1,
        hugo     : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS',
        active   : true
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('No such property');
        done();
      });
    });
  });


  /////////////////////////////////////////////////////////
  // update(id, name, dsc, active)
  describe('PUT /api/v0.01/abbreviations/1', () => {
    it('should respond with a success message along with a single abbreviation that was updated', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS',
        active   : false
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        // (indicating that something was "created")
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 object}
        res.body.data[0].should.include.keys(
          'id', 'abbr', 'name', 'active'
        );
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // abbr should have changed
        res.body.data[0].abbr.should.equal('ssssssss');
        // name should have changed
        res.body.data[0].name.should.equal('SuperSuSSonianSuperSoundSS');
        // active should have changed
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change abbreviation\'s name and just abbreviation\'s name', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'SuperSuSSonianSuperSoundSS'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        // (indicating that something was "created")
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // name should have changed to 'someOtherTestAdmin
        res.body.data[0].name.should.equal('SuperSuSSonianSuperSoundSS');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change field abbr and just field abbr', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr : 'ssssssss'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        // (indicating that something was "created")
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // abbr should have changed
        res.body.data[0].abbr.should.equal('ssssssss');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change abbreviation\'s property active and just abbreviation\'s property active', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        active : false
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        // (indicating that something was "created")
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change abbreviation\'s properties abbr and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr : 'ssssssss',
        active : false
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        // (indicating that something was "created")
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // abbr should have changed
        res.body.data[0].abbr.should.equal('ssssssss');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change abbreviation\'s properties name and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'SuperSuSSonianSuperSoundSS',
        active : false
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        // (indicating that something was "created")
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // name should have changed
        res.body.data[0].name.should.equal('SuperSuSSonianSuperSoundSS');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change dev abbreviation\'s properties abbr and name', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        // (indicating that something was "created")
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // name should have changed
        res.body.data[0].name.should.equal('SuperSuSSonianSuperSoundSS');
        // abbr should have changed
        res.body.data[0].abbr.should.equal('ssssssss');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change abbreviation\'s properties abbr, name and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS',
        active   : false
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        // (indicating that something was "created")
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // name should have changed
        res.body.data[0].name.should.equal('SuperSuSSonianSuperSoundSS');
        // abbr should have changed
        res.body.data[0].abbr.should.equal('ssssssss');
        // active should have changed
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should throw an error if the abbreviation does not exist', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/100000')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS',
        active   : true
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message 'Development abbr of id xxxx not found'
        res.body.message.should.include('id is not defined');
        done();
      });
    });
    it('should throw an error if no param :id is provided', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr : 'ssssssss',
        name     : 'SuperSuSSonianSuperSoundSS',
        active   : true
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message 'Route not supported'
        res.body.message.should.include('Route not supported');
        done();
      });      
    });
    it('should throw an error if no properties provided', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({})
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message 'No properties in body of http request PUT /:id'
        res.body.message.should.equal('No properties in body of http request PUT /:id');
        done();
      });      
    });
    it('should throw an error if abbr is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        abbr: null
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message 'null value in column "name" violates not-null constraint'
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });      
    });
    it('should throw an error if name is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name: null
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message 'null value in column "name" violates not-null constraint'
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });      
    });
    it('should throw an error if active is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        active: null
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message 'null value in column "name" violates not-null constraint'
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });      
    });
  });

  /////////////////////////////////////////////////////////
  // deleteAll
  describe('DELETE /api/v0.01/abbreviations', () => {
    it('should throw an error if all abbreviations are unconciously to be deleted', (done) => {
      chai.request(server)
      .delete('/api/v0.01/abbreviations')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be a 405 status code
        res.status.should.equal(405);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message 'Method not allowed'
        res.body.message.should.equal('Method not allowed');
        done();
      });      
    });
  });


  /////////////////////////////////////////////////////////
  // delete(id)
  describe('DELETE /api/v0.01/abbreviations/:id', () => {
    it('should respond with the deleted abbreviation', (done) => {
      chai.request(server)
      .delete('/api/v0.01/abbreviations/1')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 200 status code
        res.status.should.equal(200);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 object}
        res.body.data.length.should.eql(1);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'abbr', 'name', 'active'
        );
        res.body.data[0].id.should.equal(1);
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should throw an error if the abbreviation id is null', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/abbreviations/${null}`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('invalid input syntax for integer');
        done();
      });
    });
    it('should throw an error if the abbreviation is not found', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/abbreviations/100000`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('Abbreviation', 'not found');
        done();
      });
    });
  });

});
