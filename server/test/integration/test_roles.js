process.env.NODE_ENV = 'test'

const seed_roles = require('../../seed/seed_roles')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../src/app');

describe('routes : /api/v0.01/roles', function() {

  var testToken = ''

  beforeEach( async function() {
    await seed_roles.loadRoles();
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
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.have.property('token')
        testToken = res.body.data[0].token
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // getAll
  describe('GET /api/v0.01/roles', () => {
    it('should respond with all roles', (done) => {
      chai.request(server)
      .get('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(3);
        res.body.data[0].should.include.keys('id','name','dsc','active');
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // get(id)
  describe('GET /api/v0.01/roles/:id', () => {
    it('should respond with a single role', (done) => {
      chai.request(server)
      .get('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('admin');
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should throw an error if the role id is null', (done) => {
      chai.request(server)
      .get(`/api/v0.01/roles/${null}`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('invalid input syntax for integer');
        done();
      });
    });

    it('should throw an error if the role is not found', (done) => {
      chai.request(server)
      .get(`/api/v0.01/roles/4`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.eql('Role not found');
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // insert(role)
  describe('POST /api/v0.01/roles', () => {
    it('should respond with a success message along with a single role that was added', (done) => {
      chai.request(server)
      .post('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 4,
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : true
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(4);
        res.body.data[0].name.should.equal('someTestAdmin');
        res.body.data[0].dsc.should.equal('just used for testing');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should generate id automatically when not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someOtherTestAdmin',
        dsc    : 'just used for testing',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(4);
        res.body.data[0].name.should.equal('someOtherTestAdmin');
        res.body.data[0].dsc.should.equal('just used for testing');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should set active to true (default) if not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 6,
        name   : 'stillAnotherTestAdmin',
        dsc    : 'just used for testing',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(6);
        res.body.data[0].name.should.equal('stillAnotherTestAdmin');
        res.body.data[0].dsc.should.equal('just used for testing');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should throw an error if the role already exists', (done) => {
      chai.request(server)
      .post('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 1,
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : true
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.eql('error');
        res.body.message.should.include('duplicate key value violates unique constraint');
        done();
      });
    });

    it('should throw an error if name is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 7,
        dsc    : 'just used for testing',
        active : true
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.eql('error');
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });
    });

    it('should throw an error if wrong property is provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        hugo   : 7,
        dsc    : 'just used for testing',
        active : true
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.eql('error');
        res.body.message.should.include('No such property');
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // update(role)
  describe('PUT /api/v0.01/roles/1', () => {
    it('should respond with a success message along with a single role that was updated', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('someTestAdmin');
        res.body.data[0].dsc.should.equal('just used for testing');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change role\'s name and just role\'s name', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someOtherTestAdmin'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('someOtherTestAdmin');
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should change role\'s description and just role\'s description', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        dsc : 'some other description'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('admin');
        res.body.data[0].dsc.should.equal('some other description');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should change role\'s property active and just role\'s property active', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('admin');
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change role\'s properties dsc and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        dsc    : 'some description',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('admin');
        res.body.data[0].dsc.should.equal('some description');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change role\'s properties name and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someNewName',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('someNewName');
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change role\'s properties name and dsc', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name : 'someNewName',
        dsc  : 'some new description'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('someNewName');
        res.body.data[0].dsc.should.equal('some new description');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should change role\'s properties name, dsc and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someNewName',
        dsc    : 'some new description',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('someNewName');
        res.body.data[0].dsc.should.equal('some new description');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should throw an error if the role does not exist', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/4')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : true
      })
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.equal('error');
        res.body.message.should.include('id is not defined');
        done();
      });
    });

    it('should throw an error if no param :id is provided', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someTestAdmin',
        dsc    : 'just used for testing',
        active : true
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.equal('error');
        res.body.message.should.include('Route not supported');
        done();
      });      
    });

    it('should throw an error if no properties provided', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({})
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.equal('error');
        res.body.message.should.equal('No properties in body of http request PUT /:id');
        done();
      });      
    });

    it('should throw an error if name is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name: null
      })
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.equal('error');
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });      
    });

    it('should throw an error if active is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        active: null
      })
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.equal('error');
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });      
    });
  });




  /////////////////////////////////////////////////////////
  // deleteAll
  describe('DELETE /api/v0.01/roles', () => {
    it('should throw an error if all roles are unconciously to be deleted', (done) => {
      chai.request(server)
      .delete('/api/v0.01/roles')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(405);
        res.body.status.should.equal('error');
        res.body.message.should.equal('Method not allowed');
        done();
      });      
    });
  });




  /////////////////////////////////////////////////////////
  // delete(id)
  describe('DELETE /api/v0.01/roles/:id', () => {
    it('should respond with the deleted role', (done) => {
      chai.request(server)
      .delete('/api/v0.01/roles/1')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('admin');
        res.body.data[0].dsc.should.equal('can create/enable/disable users and their privileges');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should throw an error if the role id is null', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/roles/${null}`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('invalid input syntax for integer');
        done();
      });
    });

    it('should throw an error if the role is not found', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/roles/4`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('Role', 'not found');
        done();
      });
    });
  });

});
