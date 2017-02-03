var assert = require("assert");
var supertest = require("supertest");
var app;
var server;
// This agent refers to PORT where program is runninng.

const CONFIG=require('./config_test.json');



describe("* MODIFY USER INFO",function(){

  // #1 should return home page
  before(()=>{
    app= require(CONFIG.server.dir);
    server = supertest.agent(app);
  })

  it("- Password",function(done){

    this.timeout(CONFIG.server.max_timeout);

    server
    .post(CONFIG.routes.user.modify_password)
    .set(CONFIG.headers)
    .set({"content-type": "application/x-www-form-urlencoded"})
    .send(CONFIG.data.user_modify_password)
    .expect(200)
    .end(function(err,res){

      assert.equal(res.status,200);

      done();
    });
  });

  it("- Personal info",function(done){

    server
    .post(CONFIG.routes.user.modify_personal_info)
    .set(CONFIG.headers)
    .set({"content-type": "application/x-www-form-urlencoded"})

    .send(CONFIG.data.user_modify_personal_info)
    .expect(200)
    .end(function(err,res){

      assert.equal(res.status,200);

      done();
    });
  });


  after(()=>{
    app.close();
  })
});
