process.env.NODE_ENV = 'test'

const seed_access_codes = require('../../seed/seed_access_codes')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../src/app');

describe('routes : /api/v0.01/access_codes', function() {

  beforeEach( async function() {
    await seed_access_codes.loadAccessCodes();
    // done();
  });

  afterEach(function(done) {
    done();
  });

  /////////////////////////////////////////////////////////
  // getAll
  describe('GET /api/v0.01/access_codes', () => {
    it('should respond with all access_codes', (done) => {
      chai.request(server)
      .get('/api/v0.01/access_codes')
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
        // key-value pair of {"data": [3 objects]}
        res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'name', 'dsc', 'active'
        );
        done();
      });
    });
  });


  /////////////////////////////////////////////////////////
  // get(id)
  describe('GET /api/v0.01/access_codes/:id', () => {
    it('should respond with a single access code', (done) => {
      chai.request(server)
      .get('/api/v0.01/access_codes/1')
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
          'id', 'name', 'dsc', 'active'
        );
        done();
      });
    });
    it('should throw an error if the access code id is null', (done) => {
      chai.request(server)
      .get(`/api/v0.01/access_codes/${null}`)
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
    it('should throw an error if the access code is not found', (done) => {
      chai.request(server)
      .get(`/api/v0.01/access_codes/4`)
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.eql('Access code not found');
        done();
      });
    });
  });


  /////////////////////////////////////////////////////////
  // insert(id, name, dsc, active)
  describe('POST /api/v0.01/access_codes', () => {
    it('should respond with a success message along with a single access code that was added', (done) => {
      chai.request(server)
      .post('/api/v0.01/access_codes')
      .send({
        id     : 4,
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : true
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
          'id', 'name', 'dsc', 'active'
        );
        done();
      });
    });
    it('should generate id automatically when not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/access_codes')
      .send({
        name   : 'someOtherTestAdmin',
        dsc    : 'just used for testing',
        active : false
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
          'id', 'name', 'dsc', 'active'
        );
        // the generated id should be 4
        res.body.data[0].id.should.equal(4);
        done();
      });
    });
    it('should set active to true (default) if not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/access_codes')
      .send({
        id     : 6,
        name   : 'stillAnotherTestAdmin',
        dsc    : 'just used for testing',
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
          'id', 'name', 'dsc', 'active'
        );
        // the generated id should be 6
        res.body.data[0].id.should.equal(6);
        done();
      });
    });
    it('should throw an error if the access code already exists', (done) => {
      chai.request(server)
      .post('/api/v0.01/access_codes')
      .send({
        id     : 1,
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : true
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
    it('should throw an error if name is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/access_codes')
      .send({
        id     : 7,
        dsc    : 'just used for testing',
        active : true
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
      .post('/api/v0.01/access_codes')
      .send({
        hugo   : 7,
        dsc    : 'just used for testing',
        active : true
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
  describe('PUT /api/v0.01/access_codes/1', () => {
    it('should respond with a success message along with a single access code that was updated', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
      .send({
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
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
        // the JSON response body should have a
        // key-value pair of {"data": 1 object}
        res.body.data[0].should.include.keys(
          'id', 'name', 'dsc', 'active'
        );
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // name should have changed to 'someTestAdmin'
        res.body.data[0].name.should.equal('someTestAdmin');
        // dsc should have changed to 'just used for testing'
        res.body.data[0].dsc.should.equal('just used for testing');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change access code\'s name and just access code\'s name', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
      .send({
        name   : 'someOtherTestAdmin'
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
        res.body.data[0].name.should.equal('someOtherTestAdmin');
        // dsc should still be 'can create/enable/disable users and their privileges'
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change access code\'s description and just access code\'s description', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
      .send({
        dsc : 'some other description'
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
        // name should still be 'admin'
        res.body.data[0].name.should.equal('admin');
        // dsc should have changed to 'some other description'
        res.body.data[0].dsc.should.equal('some other description');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change access code\'s property active and just access code\'s property active', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
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
        // name should still be 'admin'
        res.body.data[0].name.should.equal('admin');
        // dsc should still be 'can create/enable/disable users and their privileges'
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change access code\'s properties dsc and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
      .send({
        dsc    : 'some description',
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
        // name should still be 'admin'
        res.body.data[0].name.should.equal('admin');
        // dsc should have changed to 'some description'
        res.body.data[0].dsc.should.equal('some description');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change access code\'s properties name and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
      .send({
        name   : 'someNewName',
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
        // name should have changed to 'someNewName'
        res.body.data[0].name.should.equal('someNewName');
        // dsc should still be 'can create/enable/disable users and their privileges'
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change access code\'s properties name and dsc', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
      .send({
        name : 'someNewName',
        dsc  : 'some new description'
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
        // name should have changed to 'someNewName'
        res.body.data[0].name.should.equal('someNewName');
        // dsc should have changed to 'some new description'
        res.body.data[0].dsc.should.equal('some new description');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change access code\'s properties name, dsc and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
      .send({
        name   : 'someNewName',
        dsc    : 'some new description',
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
        // name should have changed to 'someNewName'
        res.body.data[0].name.should.equal('someNewName');
        // dsc should have changed to 'some new description'
        res.body.data[0].dsc.should.equal('some new description');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should throw an error if the access code does not exist', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/4')
      .send({
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : true
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message 'Access code of id xxxx not found'
        res.body.message.should.include('Access code of id', 'not found');
        done();
      });
    });
    it('should throw an error if no param :id is provided', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes')
      .send({
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : true
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
      .put('/api/v0.01/access_codes/1')
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
    it('should throw an error if name is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/access_codes/1')
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
  });

  /////////////////////////////////////////////////////////
  // deleteAll
  describe('DELETE /api/v0.01/access_codes', () => {
    it('should throw an error if all access_codes are unconciously to be deleted', (done) => {
      chai.request(server)
      .delete('/api/v0.01/access_codes')
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
  describe('DELETE /api/v0.01/access_codes/:id', () => {
    it('should respond with the deleted access code', (done) => {
      chai.request(server)
      .delete('/api/v0.01/access_codes/1')
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
          'id', 'name', 'dsc', 'active'
        );
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('admin');
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should throw an error if the access code id is null', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/access_codes/${null}`)
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
    it('should throw an error if the access code is not found', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/access_codes/4`)
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('Access code', 'not found');
        done();
      });
    });
  });

});
