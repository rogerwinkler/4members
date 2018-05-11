process.env.NODE_ENV = 'test'

const seed_roles = require('../../seed/seed_roles')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../src/app');

describe('routes : /api/v0.01/roles', function() {

  beforeEach( async function() {
    await seed_roles.loadRoles();
    // done();
  });

  afterEach(function(done) {
    done();
  });

  describe('GET /api/v0.01/roles', () => {
    it('should respond with all roles', (done) => {
      chai.request(server)
      .get('/api/v0.01/roles')
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
        // key-value pair of {"data": [3 role objects]}
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

  describe('GET /api/v0.01/roles/:id', () => {
    it('should respond with a single role', (done) => {
      chai.request(server)
      .get('/api/v0.01/roles/1')
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
        // key-value pair of {"data": 1 role object}
        res.body.data.length.should.eql(1);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'name', 'dsc', 'active'
        );
        done();
      });
    });
    it('should throw an error if the role id is null', (done) => {
      chai.request(server)
      .get(`/api/v0.01/roles/${null}`)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.message.should.eql('invalid input syntax for integer: "null"');
        done();
      });
    });
    it('should throw an error if the role is not found', (done) => {
      chai.request(server)
      .get(`/api/v0.01/roles/4`)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.message.should.eql('Role not found');
        done();
      });
    });
  });



  // describe('POST /api/v0.01/roles', () => {
  //   it('should respond with a success message along with a single role that was added', (done) => {
  //     chai.request(server)
  //     .post('/api/v0.01/roles')
  //     .send({
  //       id     : 4,
  //       name   : 'someTestAdmin',
  //       dsc    : 'just used for testing',
  //       active : true
  //     })
  //     .end((err, res) => {
  //       // there should be no errors
  //       should.not.exist(err);
  //       // there should be a 201 status code
  //       // (indicating that something was "created")
  //       res.status.should.equal(201);
  //       // the response should be JSON
  //       res.type.should.equal('application/json');
  //       // the JSON response body should have a
  //       // key-value pair of {"status": "success"}
  //       res.body.status.should.eql('success');
  //       // the JSON response body should have a
  //       // key-value pair of {"data": 1 role object}
  //       res.body.data[0].should.include.keys(
  //         'id', 'name', 'dsc', 'active'
  //       );
  //       done();
  //     });
  //   });
  // });

  // describe('POST /api/v1/users', () => {
  //   it('should respond with a success message along with a single user that was added', (done) => {
  //     chai.request(server)
  //     .post('/api/v1/users')
  //     .send({
  //       username: 'ryan',
  //       email: 'ryan@ryan.com'
  //     })
  //     .end((err, res) => {
  //       // there should be no errors
  //       should.not.exist(err);
  //       // there should be a 201 status code
  //       // (indicating that something was "created")
  //       res.status.should.equal(201);
  //       // the response should be JSON
  //       res.type.should.equal('application/json');
  //       // the JSON response body should have a
  //       // key-value pair of {"status": "success"}
  //       res.body.status.should.eql('success');
  //       // the JSON response body should have a
  //       // key-value pair of {"data": 1 user object}
  //       res.body.data[0].should.include.keys(
  //         'id', 'username', 'email', 'created_at'
  //       );
  //       done();
  //     });
  //   });
  // });

});
