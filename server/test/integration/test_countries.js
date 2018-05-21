process.env.NODE_ENV = 'test'

const seed_countries = require('../../seed/seed_countries')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../../src/app');

describe('routes : /api/v0.01/countries', function() {

  var testToken = ''

  beforeEach( async function() {
    await seed_countries.loadCountries();
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
  describe('GET /api/v0.01/countries', () => {
    it('should respond with all countries', (done) => {
      chai.request(server)
      .get('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(12);
        res.body.data[0].should.include.keys(
          'id', 'iso2', 'name', 'active'
        );
        done();
      });
    });
  });



  /////////////////////////////////////////////////////////
  // get(id)
  describe('GET /api/v0.01/countries/:id', () => {
    it('should respond with a single country', (done) => {
      chai.request(server)
      .get('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys(
          'id', 'iso2', 'name', 'active'
        );
        done();
      });
    });

    it('should throw an error if the country id is null', (done) => {
      chai.request(server)
      .get(`/api/v0.01/countries/${null}`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('invalid input syntax for integer');
        done();
      });
    });

    it('should throw an error if the country is not found', (done) => {
      chai.request(server)
      .get(`/api/v0.01/countries/1000`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.eql('Country not found');
        done();
      });
    });
  });




  /////////////////////////////////////////////////////////
  // insert(country)
  describe('POST /api/v0.01/countries', () => {
    it('should respond with a success message along with a single country that was added', (done) => {
      chai.request(server)
      .post('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 1000,
        iso2   : 'ZZ',
        name   : 'Zome New Zone',
        active : true
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','iso2','name','active');
        res.body.data[0].id.should.equal(1000);
        res.body.data[0].iso2.should.equal('ZZ');
        res.body.data[0].name.should.equal('Zome New Zone');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should generate id automatically when not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2   : 'ZZ',
        name   : 'Zome New Zone',
        active : true
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','iso2','name','active');
        res.body.data[0].id.should.equal(13);
        res.body.data[0].iso2.should.equal('ZZ');
        res.body.data[0].name.should.equal('Zome New Zone');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should set active to true (default) if not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 1000,
        iso2   : 'ZZ',
        name   : 'Zome New Zone'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(201);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','iso2','name','active');
        res.body.data[0].id.should.equal(1000);
        res.body.data[0].iso2.should.equal('ZZ');
        res.body.data[0].name.should.equal('Zome New Zone');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should throw an error if the country already exists', (done) => {
      chai.request(server)
      .post('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 1,
        iso2   : 'ZZ',
        name   : 'Zome New Zone',
        active : true
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.eql('error');
        res.body.message.should.include('duplicate key value violates unique constraint');
        done();
      });
    });

    it('should throw an error if iso2 is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 1000,
        name   : 'Zome New Zone',
        active : true
      })
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.status.should.eql('error');
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });
    });

    it('should throw an error if name is not provided', (done) => {
      chai.request(server)
      .post('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        id     : 1000,
        iso2   : 'ZZ',
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
      .post('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        hugo   : 1000,
        iso2   : 'ZZ',
        name   : 'Zome New Zone',
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
  // update(country)
  describe('PUT /api/v0.01/countries/1', () => {
    it('should respond with a success message along with a single country that was updated', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2   : 'ZZ',
        name   : 'Zome New Zone',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys('id','iso2','name','active');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].iso2.should.equal('ZZ');
        res.body.data[0].name.should.equal('Zome New Zone');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change country\'s name and just country\'s name', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        name   : 'Zome New Zone'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].iso2.should.equal('CA');
        res.body.data[0].name.should.equal('Zome New Zone');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should change country\'s iso2 and just country\'s iso2', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2 : 'ZZ'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].iso2.should.equal('ZZ');
        res.body.data[0].name.should.equal('Canada');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should change country\'s property active and just country\'s property active', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
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
        res.body.data[0].iso2.should.equal('CA');
        res.body.data[0].name.should.equal('Canada');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change country\'s properties iso2 and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2   : 'ZZ',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].iso2.should.equal('ZZ');
        res.body.data[0].name.should.equal('Canada');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change country\'s properties name and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
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
        res.body.data[0].iso2.should.equal('CA');
        res.body.data[0].name.should.equal('someNewName');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should change country\'s properties iso2 and name', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2 : 'ZZ',
        name : 'Zome New Zone'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].iso2.should.equal('ZZ');
        res.body.data[0].name.should.equal('Zome New Zone');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should change country\'s properties iso2, name and active', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2   : 'ZZ',
        name   : 'Zome New Zone',
        active : false
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].iso2.should.equal('ZZ');
        res.body.data[0].name.should.equal('Zome New Zone');
        res.body.data[0].active.should.equal(false);
        done();
      });
    });

    it('should throw an error if the country does not exist', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1000')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2   : 'ZZ',
        name   : 'Zome New Zone',
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
      .put('/api/v0.01/countries')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2   : 'ZZ',
        name   : 'Zome New Zone',
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
      .put('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({})
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.equal('error');
        res.body.message.should.equal('No properties in body of http request PUT /:id');
        done();
      });      
    });

    it('should throw an error if iso2 is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .send({
        iso2: null
      })
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.equal('error');
        res.body.message.should.include('null value in column', 'violates not-null constraint');
        done();
      });      
    });

    it('should throw an error if name is null', (done) => {
      chai.request(server)
      .put('/api/v0.01/countries/1')
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
      .put('/api/v0.01/countries/1')
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
  describe('DELETE /api/v0.01/countries', () => {
    it('should throw an error if all countries are unconciously to be deleted', (done) => {
      chai.request(server)
      .delete('/api/v0.01/countries')
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
  describe('DELETE /api/v0.01/countries/:id', () => {
    it('should respond with the deleted country', (done) => {
      chai.request(server)
      .delete('/api/v0.01/countries/1')
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys(
          'id', 'iso2', 'name', 'active'
        );
        res.body.data[0].id.should.equal(1);
        res.body.data[0].iso2.should.equal('CA');
        res.body.data[0].name.should.equal('Canada');
        res.body.data[0].active.should.equal(true);
        done();
      });
    });

    it('should throw an error if the country id is null', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/countries/${null}`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('invalid input syntax for integer');
        done();
      });
    });

    it('should throw an error if the country is not found', (done) => {
      chai.request(server)
      .delete(`/api/v0.01/countries/1000`)
      .set('Authorization', 'Bearer ' + testToken)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.status.should.eql('error');
        res.body.message.should.include('Country', 'not found');
        done();
      });
    });
  });

});
