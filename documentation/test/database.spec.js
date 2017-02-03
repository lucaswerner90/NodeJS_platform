var assert = require("assert");
var supertest = require("supertest");
var app;
var server;

const CONFIG=require('./config_test.json');




describe("GET contents test",function(){

  before(()=>{
    app= require(CONFIG.server.dir);
    server = supertest.agent(app);
  });

  it("Get generic information",function(done){

    this.timeout(CONFIG.server.max_timeout);

    server
    .get(CONFIG.routes.bbdd.get_generic_information)
    .set(CONFIG.headers)
    .send()
    .expect(200)
    .end(function(err,res){

      assert.notEqual(res.body,null);
      done();
    });

  });

  it("Get contents of provider 1",function(done){

    this.timeout(CONFIG.server.max_timeout);
    server
    .get(CONFIG.routes.bbdd.get_contents_of_specified_provider)
    .set(CONFIG.headers)
    .send()
    .expect(200) // THis is HTTP response
    .end(function(err,res){

      assert.notEqual(res.body,null);

      done();

    });

  });

  it("Get all contents",function(done){

    this.timeout(CONFIG.server.max_timeout);
    server
    .get(CONFIG.routes.bbdd.get_all_contents)
    .set(CONFIG.headers)
    .send()
    .expect(200) // THis is HTTP response
    .end(function(err,res){

      assert.notEqual(res.body,null);

      done();

    });
  });


  after(()=>{
    app.close();
  })
});
