process.env.NODE_ENV = 'test'

const seed_business_units = require('../../seed/seed_business_units')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../src/app');

describe('routes : /api/v0.01/business_units', function() {

  var testToken = ''

  beforeEach( async function() {
    await seed_business_units.loadBusinessUnits();
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
  describe('GET /api/v0.01/business_units', () => {
    it('should respond with all business_units', (done) => {
      chai.request(server)
      .get('/api/v0.01/business_units')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(4);
        res.body.data[0].should.include.keys('id','name','dsc','active');
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // get(id)
  describe('GET /api/v0.01/business_units/:id', () => {
    it('should respond with a single businessUnit', (done) => {
      chai.request(server)
      .get('/api/v0.01/business_units/1')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('TestBU1');
        res.body.data[0].dsc.should.equal('test business unit 1');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should throw an error if the businessUnit id is null', (done) => {
      chai.request(server)
      .get(`/api/v0.01/business_units/${null}`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('invalid input syntax for integer');
        done();
      });
    });

    it('should throw an error if the businessUnit is not found', (done) => {
      chai.request(server)
      .get(`/api/v0.01/business_units/4`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.eql('Business unit not found');
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // insert(businessUnit)
  describe('POST /api/v0.01/business_units', () => {
    it('should respond with a success message along with a single businessUnit that was added', (done) => {
      chai.request(server)
      .post('/api/v0.01/business_units')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 4,
        name   : 'TestBU4',
        dsc    : 'test business unit 4',
        active : true
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(4);
        res.body.data[0].name.should.equal('TestBU4');
        res.body.data[0].dsc.should.equal('test business unit 4');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should generate id automatically when not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/business_units')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'TestBU4',
        dsc    : 'test business unit 4',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(4);
        res.body.data[0].name.should.equal('TestBU4');
        res.body.data[0].dsc.should.equal('test business unit 4');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should set active to true (default) if not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/business_units')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 4,
        name   : 'TestBU4',
        dsc    : 'test business unit 4'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(4);
        res.body.data[0].name.should.equal('TestBU4');
        res.body.data[0].dsc.should.equal('test business unit 4');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should throw an error if the businessUnit already exists', (done) => {
      chai.request(server)
      .post('/api/v0.01/business_units')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 1,
        name   : 'TestBU1',
        dsc    : 'test business unit 1',
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
      .post('/api/v0.01/business_units')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 4,
        dsc    : 'test business unit 4',
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
      .post('/api/v0.01/business_units')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        hugo   : 4,
        name   : 'TestBU4',
        dsc    : 'test business unit 4',
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
  // update(businessUnit)
  describe('PUT /api/v0.01/business_units/1', () => {
    it('should respond with a success message along with a single businessUnit that was updated', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'TestBU4',
        dsc    : 'test business unit 4',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('TestBU4');
        res.body.data[0].dsc.should.equal('test business unit 4');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change businessUnit\'s name and just businessUnit\'s name', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'TestBU4'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('TestBU4');
        res.body.data[0].dsc.should.equal('test business unit 1');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should change businessUnit\'s description and just businessUnit\'s description', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/1')
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
        res.body.data[0].name.should.equal('TestBU1');
        res.body.data[0].dsc.should.equal('some other description');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should change businessUnit\'s property active and just businessUnit\'s property active', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/1')
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
        res.body.data[0].name.should.equal('TestBU1');
        res.body.data[0].dsc.should.equal('test business unit 1');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change businessUnit\'s properties dsc and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/1')
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
        res.body.data[0].name.should.equal('TestBU1');
        res.body.data[0].dsc.should.equal('some description');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change businessUnit\'s properties name and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/1')
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
        res.body.data[0].dsc.should.equal('test business unit 1');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change businessUnit\'s properties name and dsc', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/1')
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

    it('should change businessUnit\'s properties name, dsc and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/1')
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

    it('should throw an error if the businessUnit does not exist', (done) => {
      chai.request(server)
      .put('/api/v0.01/business_units/4')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someTestBU',
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
      .put('/api/v0.01/business_units')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'someTestBU',
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
      .put('/api/v0.01/business_units/1')
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
      .put('/api/v0.01/business_units/1')
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
      .put('/api/v0.01/business_units/1')
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
  describe('DELETE /api/v0.01/business_units', () => {
    it('should throw an error if all business_units are unconciously to be deleted', (done) => {
      chai.request(server)
      .delete('/api/v0.01/business_units')
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
  describe('DELETE /api/v0.01/business_units/:id', () => {
    it('should respond with the deleted businessUnit', (done) => {
      chai.request(server)
      .delete('/api/v0.01/business_units/1')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys('id','name','dsc','active');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].name.should.equal('TestBU1');
        res.body.data[0].dsc.should.equal('test business unit 1');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should throw an error if the businessUnit id is null', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/business_units/${null}`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('invalid input syntax for integer');
        done();
      });
    });

    it('should throw an error if the businessUnit is not found', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/business_units/4`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('Business unit', 'not found');
        done();
      });
    });
  });

});
