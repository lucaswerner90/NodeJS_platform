const supertest=require('supertest');
let server={};
const assert=require('assert');
const CONFIG=require('./config.spec.json');


function checkAsserts(asserts){
  for (let i = 0; i < asserts.length; i++) {
    let condition=asserts[i];
    assert(condition);
  }
}

before(function(){
  server=supertest(require('../server'));
});


describe('Database', function() {
  it('Get all contents', (done) => {

    const IT_CONFIG=CONFIG.specs.database.get_contents;

    server
    .post(IT_CONFIG.url)
    .set('Authorization', CONFIG.constants.auth_token)
    .send(IT_CONFIG.set)
    .expect(IT_CONFIG.expect.code)
    .end(function(err,res){
      checkAsserts(IT_CONFIG.expect.asserts);
      done();
    })
  });


  it('Get content by ID', (done) => {

    const IT_CONFIG=CONFIG.specs.database.get_content_by_id;

    server
    .get(IT_CONFIG.url)
    .set('Authorization', CONFIG.constants.auth_token)
    .send(IT_CONFIG.set)
    .expect(IT_CONFIG.expect.code)
    .end(function(err,res){
      checkAsserts(IT_CONFIG.expect.asserts);
      done();
    })
  });


  it('Get generic info', (done) => {

    const IT_CONFIG=CONFIG.specs.database.get_generic_info;

    server
    .get(IT_CONFIG.url)
    .set('Authorization', CONFIG.constants.auth_token)
    .send(IT_CONFIG.set)
    .expect(IT_CONFIG.expect.code)
    .end(function(err,res){
      checkAsserts(IT_CONFIG.expect.asserts);
      done();
    })
  });



});


after(function () {
  server=undefined;
});
