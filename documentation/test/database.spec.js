var assert = require("assert");
var supertest = require("supertest");
var app;
var server;
// This agent refers to PORT where program is runninng.




describe("GET contents test",function(){

  before(()=>{
    app= require('../../server');
    server = supertest.agent(app);
  });

  it("Get generic information",function(done){


    server
    .get("/bbdd/course/getGenericInformation")
    .set({authorization: 'prueba eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjAuNTY4NjA0MzA2ODk5Nzg0OCwiaWF0IjoxNDg1MjQ0NTMzLCJleHAiOjE0ODc4MzY1MzN9.NgtYONse-_iTqCHlM3Cof-b1BxDuxL46PC-mxe0AHGo-C3lrjjcFZ8fuf448av3ODIKWmLsooAZy_jfQnJDlNw'})
    .send()
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      assert.notEqual(res.body,null);

      // Error key should be false.
      done();
    });
  });

  it("Get contents of provider 1",function(done){

    // calling home page api
    server
    .get("/bbdd/course/getAllContenidos/1")
    .set({authorization: 'prueba eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjAuNTY4NjA0MzA2ODk5Nzg0OCwiaWF0IjoxNDg1MjQ0NTMzLCJleHAiOjE0ODc4MzY1MzN9.NgtYONse-_iTqCHlM3Cof-b1BxDuxL46PC-mxe0AHGo-C3lrjjcFZ8fuf448av3ODIKWmLsooAZy_jfQnJDlNw'})
    .send()
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      assert.notEqual(res.body,null);

      // Error key should be false.
      done();
    });
  });

  it("Get all contents",function(done){

    server
    .get("/bbdd/course/getAllContenidos")
    .set({authorization: 'prueba eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjAuNTY4NjA0MzA2ODk5Nzg0OCwiaWF0IjoxNDg1MjQ0NTMzLCJleHAiOjE0ODc4MzY1MzN9.NgtYONse-_iTqCHlM3Cof-b1BxDuxL46PC-mxe0AHGo-C3lrjjcFZ8fuf448av3ODIKWmLsooAZy_jfQnJDlNw'})
    .send()
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      assert.notEqual(res.body,null);

      // Error key should be false.
      done();
    });
  });


  after(()=>{
    app.close();
  })
});
