process.env.NODE_ENV = 'test'

const AuthenticationHelpers = require('../../src/db/AuthenticationHelpers')
const seed_users = require('../../seed/seed_users')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../src/app');

describe('routes : /api/v0.01/users', function() {

  var testToken = ''

  beforeEach( async function() {
    await seed_users.loadUsers();
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
  describe('GET /api/v0.01/users', () => {
    it('should return all users authenticated', (done) => {
      chai.request(server)
      .get('/api/v0.01/users')
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
        // key-value pair of {"data": [3 user objects]}
        res.body.data.length.should.eql(3);
        // the first object in the data array should
        // have the right keys
        res.body.data[0].should.include.keys(
          'id', 'username', 'password', 'email', 'active'
        );
        done();
      });
    });
  });



  /////////////////////////////////////////////////////////
  // get(id)
  describe('GET /api/v0.01/users/:id', () => {
    it('should respond with a single user', (done) => {
      chai.request(server)
      .get('/api/v0.01/users/1')
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
          'id', 'username', 'password', 'email', 'active'
        );
        done();
      });
    });
    it('should throw an error if the user id is null', (done) => {
      chai.request(server)
      .get(`/api/v0.01/users/${null}`)
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
    it('should throw an error if the user is not found', (done) => {
      chai.request(server)
      .get(`/api/v0.01/users/4`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.eql('User not found');
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // insert(id, name, dsc, active)
  describe('POST /api/v0.01/users', () => {
    it('should respond with a success message along with a single user that was added', (done) => {
      chai.request(server)
      .post('/api/v0.01/users')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id       : 4,
        username : 'someUsername',
        password : 'somePassword',
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
          'id', 'username', 'password', 'email', 'active'
        );
        done();
      });
    });
    it('should generate id automatically when not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/users')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someUsername',
        password : 'somePassword',
        email    : 'some.name@some.domain',
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
          'id', 'username', 'password', 'email', 'active'
        );
        // the generated id should be 4
        res.body.data[0].id.should.equal(4);
        done();
      });
    });
    it('should set active to true (default) if not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/users')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id       : 6,
        username : 'stillAnotherUsername',
        password : 'stillAnotherPassword',
        email    : 'stillaname@some.domain'
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
          'id', 'username', 'password', 'email', 'active'
        );
        // the generated id should be 6
        res.body.data[0].id.should.equal(6);
        done();
      });
    });
    it('should throw an error if the user already exists', (done) => {
      chai.request(server)
      .post('/api/v0.01/users')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 1,
        username : 'someUsername',
        password : 'somePassword',
        email    : 'some.name@some.domain',
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
    it('should throw an error if req.body is empty ({})', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({})
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username is null', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : null
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username is too short (<2)', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 't',
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username is too long (>30)', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 't012345678901234567890123456789',
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username contains illegal character  \' \'', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 't 9',
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username contains illegal character \'?\'', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 't?9',
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if password is null', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 't9',
        password : null,
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error is password is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 't9',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error if password is too short (<8)', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 't9',
        password : '1234567',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error if password is too long (>60)', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 't9',
        password : 't012345678901234567890123456789012345678901234567890123456789',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error if password contains illegal character \'?\'', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someNewUsername',
        password : 'someNewPassword?',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error if email is not in email format \'some.name@some.domain\'', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someNewUsername',
        password : 'someNewPassword',
        email    : 'someIllFormattedEmail'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid email address')
        done();
      });
    });
    it('should throw an error if there is an illegal property in user', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        hugo : 'someNewUsername',
        password : 'someNewPassword?',
        email    : 'someIllFormattedEmail'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });  
    });
  });




  /////////////////////////////////////////////////////////
  // update(id, name, dsc, active)
  describe('PUT /api/v0.01/users/1', () => {
    it('should respond with a success message along with a single user that was updated', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someUsername',
        password : 'somePassword',
        email    : 'some.name@some.domain',
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
          'id', 'username', 'password', 'email', 'active'
        );
        // id should still be 1
        res.body.data[0].id.should.equal(1);
        // username should have changed to 'someUsername'
        res.body.data[0].username.should.equal('someUsername');
        // hashed password should equal returned password
        AuthenticationHelpers.comparePasswords('somePassword', res.body.data[0].password).should.equal(true);        
        // email should have changed to 'some.name@some.domain'
        res.body.data[0].email.should.equal('some.name@some.domain');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change username and just username', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someUsername'
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
        // username should have changed to 'someUsername'
        res.body.data[0].username.should.equal('someUsername');
        // password should still be the same
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].password).should.equal(true);        
        // email should still be 't1@gmail.com'
        res.body.data[0].email.should.equal('t1@gmail.com');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change user\'s password and just user\'s password', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        password : 'someOtherPassword'
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
        // username should still be 't1'
        res.body.data[0].username.should.equal('t1');
        // email should have changed to 't1@gmail.com'
        res.body.data[0].email.should.equal('t1@gmail.com');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        // hashed password should equal returned password
        AuthenticationHelpers.comparePasswords('someOtherPassword', res.body.data[0].password).should.equal(true);
        done();
      });
    });
    it('should change user\'s email and just user\'s email', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        email : 'someNewEmail.@gmail.com'
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
        // username should still be the same
        res.body.data[0].username.should.equal('t1');
        // password should still be the same
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].password).should.equal(true);
        // email should have changed to the new email
        res.body.data[0].email.should.equal('someNewEmail.@gmail.com');
        // active should still be true
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change user\'s property active and just user\'s property active', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
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
        // username should still be the same
        res.body.data[0].username.should.equal('t1');
        // password should still be the same
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].password).should.equal(true);
        // email should still be the same
        res.body.data[0].email.should.equal('t1@gmail.com');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change user\'s properties email and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        email    : 'someNewEmail@gmail.com',
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
        // username should still be the same
        res.body.data[0].username.should.equal('t1');
        // password should still be the same
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].password).should.equal(true);
        // email should have changed
        res.body.data[0].email.should.equal('someNewEmail@gmail.com');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change user\'s properties username and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someNewUsername',
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
        // username should have changed
        res.body.data[0].username.should.equal('someNewUsername');
        // password should still be the same
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].password).should.equal(true);
        // email should still be the same
        res.body.data[0].email.should.equal('t1@gmail.com');
        // active should have changed to false
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should change user\'s properties username and emil', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someNewUsername',
        email    : 'someNewEmail@gmail.com'
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
        // username should have changed 
        res.body.data[0].username.should.equal('someNewUsername');
        // password should still be the same
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].password).should.equal(true);
        // email should have changed
        res.body.data[0].email.should.equal('someNewEmail@gmail.com');
        // active should still be the same
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should change user\'s properties username, email and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someNewUserame',
        email    : 'someNewEmail@gmail.com',
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
        // Username should have changed
        res.body.data[0].username.should.equal('someNewUserame');
        // password should still be the same
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].password).should.equal(true);
        // email should have changed
        res.body.data[0].email.should.equal('someNewEmail@gmail.com');
        // active should have changed
        res.body.data[0].active.should.equal(false);
        done();
      });
    });
    it('should throw an error if the user does not exist', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/4')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someUsername',
        email    : 'someNewEmail@gmail.com',
        active   : true
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.equal('error');
        // there should be an error message
        res.body.message.should.include('id is not defined');
        done();
      });
    });
    it('should throw an error if no param :id is provided', (done) => {
      chai.request(server)
      .put('/api/v0.01/users')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username : 'someUsername',
        email    : 'someNewEmail@gmail.com',
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
      .put('/api/v0.01/users/1')
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
    it('should throw an error if username is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/users/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        username: null
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
      .put('/api/v0.01/users/1')
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
  describe('DELETE /api/v0.01/users', () => {
    it('should throw an error if all users are unconciously to be deleted', (done) => {
      chai.request(server)
      .delete('/api/v0.01/users')
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
  describe('DELETE /api/v0.01/users/:id', () => {
    it('should respond with the deleted user', (done) => {
      chai.request(server)
      .delete('/api/v0.01/users/1')
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
          'id', 'username', 'password', 'email', 'active'
        );
        res.body.data[0].id.should.equal(1);
        res.body.data[0].username.should.equal('t1');
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].password).should.equal(true);
        res.body.data[0].email.should.equal('t1@gmail.com');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });
    it('should throw an error if the user id is null', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/users/${null}`)
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
    it('should throw an error if the user is not found', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/users/4`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // the JSON response body should have a
        // key-value pair of {"status": "error"}
        res.body.status.should.eql('error');
        // there should be an error message
        res.body.message.should.include('User', 'not found');
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // register
  describe('POST /api/v0.01/register', () => {
    it('should respond with the registered user', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 'someUsername',
        password : 'somePassword',
        email    : 'someName@gmail.com'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 Object }
        res.body.data.length.should.eql(1);
        // the first property in the data array should
        // have the right keys
        res.body.data[0].user.should.include.keys(
          'id', 'username', 'password', 'email', 'active'
        );
        // second property should be token
        res.body.data[0].should.include.keys('user', 'token') 
        res.body.data[0].user.id.should.equal(4);
        res.body.data[0].user.username.should.equal('someUsername');
        AuthenticationHelpers.comparePasswords('somePassword', res.body.data[0].user.password).should.equal(true);
        res.body.data[0].user.email.should.equal('someName@gmail.com');
        res.body.data[0].user.active.should.equal(true);
        done();
      });
    });
    it('should respond with registered user even if email is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 'someUsername',
        password : 'somePassword'
      })
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err);
        // there should be a 201 status code
        res.status.should.equal(201);
        // the response should be JSON
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('success');
        // the JSON response body should have a
        // key-value pair of {"data": 1 Object }
        res.body.data.length.should.eql(1);
        // the first property in the data array should
        // have the right keys
        res.body.data[0].user.should.include.keys(
          'id', 'username', 'password', 'email', 'active'
        );
        // second prperty should be token
        res.body.data[0].should.include.keys('user', 'token') 
        res.body.data[0].user.id.should.equal(4);
        res.body.data[0].user.username.should.equal('someUsername');
        AuthenticationHelpers.comparePasswords('somePassword', res.body.data[0].user.password).should.equal(true);
        should.not.exist(res.body.data[0].user.email);
        res.body.data[0].user.active.should.equal(true);
        done();
      });
    });
    it('should throw an error if the user already exists', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't1',
        password : 'pwdtest1',
        email    : 'some.name@some.domain',
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
    it('should throw an error if req.body is empty ({})', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({})
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username is null', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : null
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username is too short (<2)', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't',
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username is too long (>30)', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't012345678901234567890123456789',
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username contains illegal character  \' \'', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't 9',
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if username contains illegal character \'?\'', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't?9',
        password : 'somePassword',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
    it('should throw an error if password is null', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't9',
        password : null,
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error is password is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't9',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error if password is too short (<8)', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't9',
        password : '1234567',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error if password is too long (>60)', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 't9',
        password : 't012345678901234567890123456789012345678901234567890123456789',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error if password contains illegal character \'?\'', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 'someNewUsername',
        password : 'someNewPassword?',
        email    : 'someName@some.domain'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid password')
        done();
      });
    });
    it('should throw an error if email is not in email format \'some.name@some.domain\'', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        username : 'someNewUsername',
        password : 'someNewPassword',
        email    : 'someIllFormattedEmail'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid email address')
        done();
      });
    });
    it('should throw an error if there is an illegal property in user', (done) => {
      chai.request(server)
      .post('/api/v0.01/register')
      .send({
        hugo : 'someNewUsername',
        password : 'someNewPassword?',
        email    : 'someIllFormattedEmail'
      })
      .end((err, res) => {
        // there should be a 400 status code
        res.status.should.equal(400);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Not a valid username')
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // login(user)
  describe('POST /api/v0.01/login', () => {
    it('should respond with the registered user', (done) => {
      chai.request(server)
      .post('/api/v0.01/login')
      .send({
        username : 't1',
        password : 'pwdtest1'
      })
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
        // key-value pair of {"data": 1 Object }
        res.body.data.length.should.eql(1);
        // the first property in the data array should
        // have the right keys
        res.body.data[0].user.should.include.keys(
          'id', 'username', 'password', 'email', 'active'
        );
        // second property should be token
        res.body.data[0].should.include.keys('user', 'token') 
        res.body.data[0].user.id.should.equal(1);
        res.body.data[0].user.username.should.equal('t1');
        AuthenticationHelpers.comparePasswords('pwdtest1', res.body.data[0].user.password).should.equal(true);
        res.body.data[0].user.email.should.equal('t1@gmail.com');
        res.body.data[0].user.active.should.equal(true);
        done();
      });
    });
    it('should throw an error if req.body is empty ({})', (done) => {
      chai.request(server)
      .post('/api/v0.01/login')
      .send({})
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Username and password required')
        done();
      });
    });
    it('should throw an error if username is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/login')
      .send({
        password: 'pwdtest1'
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Username and password required')
        done();
      });
    });
    it('should throw an error if password is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/login')
      .send({
        username : 't1'
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Username and password required')
        done();
      });
    });
    it('show throw an error if wrong properties are specified', (done) => {
      chai.request(server)
      .post('/api/v0.01/login')
      .send({
        username : 't1',
        password : 'pwdtest1',
        hugo     : 'hugo'
      })
      .end((err, res) => {
        // there should be a 404 status code
        res.status.should.equal(404);
        // there should be no errors
        res.type.should.equal('application/json');
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.status.should.eql('error');
        // should include error message
        res.body.message.should.include('Wrong property provided')
        done();
      });
    });
  });

});
    // it('', (done) => {
    // });
