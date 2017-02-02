var assert = require("assert");
var supertest = require("supertest");
var app;
var server;
// This agent refers to PORT where program is runninng.




describe("Login test",function(){

  // #1 should return home page
  before(()=>{
    app= require('../../server');
    server = supertest.agent(app);
  })

  it("Login correct",function(done){

    // calling home page api
    server
    .post("api/auth/login")
    .set({'content-type': 'application/x-www-form-urlencoded'})
    .send({userEmail: 'javier1.rodriguezandres@telefonica.com', userPassword: '2121'})
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      assert.notEqual(res.body.userInfo,null);
      assert.equal(res.status,200);

      // Error key should be false.
      done();
    });
  });

  it("Login incorrect",function(done){

    // calling home page api
    server
    .post("api/auth/login")
    .set({'content-type': 'application/x-www-form-urlencoded'})
    .send({userEmail: 'javier1.rodriguezandres@telefonica.com', userPassword: '2121111111'})
    .end(function(err,res){
      // HTTP status should be 200
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
    app= require('../../server');
    server = supertest.agent(app);
  })

  it("Send request",function(done){

    server
    .get("/adasdasdaafafadasdadasdada")
    .end(function(err,res){
      // HTTP status should be 200
      assert.equal(res.status,404);

      // Error key should be false.
      done();
    });
  });

  after(()=>{
    app.close();
  })
});
