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


beforeEach(function(){
  server=supertest(require('../server'));
});


describe('Check authorization', function() {


  it('No Authorization header', (done) => {

    const IT_CONFIG=CONFIG.specs.authorization.no_auth;

    server
    .get(IT_CONFIG.url)
    .set(IT_CONFIG.set)
    // .expect(IT_CONFIG.expect.code)
    .end(function(err,res){
      checkAsserts(IT_CONFIG.expect.asserts);
      done();
    })
  });



  it('With Authorization header', (done) => {

    const IT_CONFIG=CONFIG.specs.authorization.with_auth;

    server
    .get(IT_CONFIG.url)
    .set('Authorization', CONFIG.constants.auth_token)
    .expect(IT_CONFIG.expect.code)
    .end(function(err,res){
      checkAsserts(IT_CONFIG.expect.asserts);
      done();
    });
  });
});


afterEach(function () {
  server=undefined;
});
