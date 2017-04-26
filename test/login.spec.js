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


describe('Login', function() {
  it('Correct login', (done) => {

    const IT_CONFIG=CONFIG.specs.login.correct_login;

    server
    .post(IT_CONFIG.url)
    .send(IT_CONFIG.set)
    .expect(IT_CONFIG.expect.code)
    .end(function(err,res){
      checkAsserts(IT_CONFIG.expect.asserts);
      done();
    })
  });
  it('Incorrect login', (done) => {

    const IT_CONFIG=CONFIG.specs.login.incorrect_login;

    server
    .post(IT_CONFIG.url)
    .send(IT_CONFIG.set)
    .end(function(err,res){
      checkAsserts(IT_CONFIG.expect.asserts);
      done();
    })
  });
});


after(function () {
  server=undefined;
});
