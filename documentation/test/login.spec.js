var assert = require("assert");
var supertest = require("supertest");
var app;
var server;
// This agent refers to PORT where program is runninng.

const CONFIG=require('./config_test.json');



describe("Login test",function(){

  // #1 should return home page
  before(()=>{
    app= require(CONFIG.server.dir);
    server = supertest.agent(app);
  })

  it("Login correct",function(done){

    this.timeout(CONFIG.server.max_timeout);

    server
    .post(CONFIG.routes.user.login)
    .set({'content-type': 'application/x-www-form-urlencoded'})
    .send(CONFIG.data.user_correct)
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){

      assert(res.body.userInfo!==null);
      assert(res.body.token!==null);

      done();

    });
  });

  it("Login incorrect",function(done){

    // calling home page api
    server
    .post(CONFIG.routes.user.login)
    .set({'content-type': 'application/x-www-form-urlencoded'})
    .send(CONFIG.data.user_incorrect)
    .end(function(err,res){


      assert.equal(res.body.userInfo,null);
      assert.equal(res.status,401);
      done();

    });
  });


  after(()=>{
    app.close();
  })
});


describe("404 test",function(){

  // #1 should return home page
  before(()=>{
    app= require(CONFIG.server.dir);
    server = supertest.agent(app);
  })

  it("Send request",function(done){

    server
    .get(CONFIG.routes.test.not_exists)
    .end(function(err,res){
      assert.equal(res.status,404);
      done();
    });
  });

  after(()=>{
    app.close();
  })
});
