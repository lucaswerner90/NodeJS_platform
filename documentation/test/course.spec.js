let assert = require("assert");
let supertest = require("supertest");
let path=require('path');
let app;
let server;


// TODO: da un problema de "double callback!", lo dejo comentado hasta arreglarlo


// describe("SEARCH course",function(){
//
//   beforeEach(()=>{
//     app= require('../../server');
//     server = supertest.agent(app);
//   });
//
//   it("Only with title",function(done){
//     server
//     .post("bbdd/course/search")
//     // Attach the form information to upload a course
//     .set({
//       authorization: 'prueba eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjAuNTY4NjA0MzA2ODk5Nzg0OCwiaWF0IjoxNDg1MjQ0NTMzLCJleHAiOjE0ODc4MzY1MzN9.NgtYONse-_iTqCHlM3Cof-b1BxDuxL46PC-mxe0AHGo-C3lrjjcFZ8fuf448av3ODIKWmLsooAZy_jfQnJDlNw'
//     })
//     .send()
//     .end(function(err, res) {
//       console.log(res.body);
//       assert.equal(res.body,true);
//       done();
//     });
//   });
//
//   afterEach(()=>{
//     app.close();
//   });
//
// });


describe("UPLOAD course",function(){

  before(()=>{
    app= require('../../server');
    server = supertest.agent(app);
  });


  it("New course",function(done){
    this.timeout(30000);
    server
    .post("/user/intern/create/course")
    // Attach the form information to upload a course
    .attach('file',path.join(__dirname, "360-video-example-master.zip"))
    .field('id_proveedor', '1')
    .field('titulo', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')
    .field('descripcion', 'Curso de prueba a la bbdd')
    .field('id_tipo_contenido', '2')
    .field('duracion', '20')
    .field('id_sistema_evaluacion', '2')
    .field('id_estado', '1')
    .field('id_proyecto', '1')
    .field('notas', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
    .set({
      authorization: 'prueba eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjAuNTY4NjA0MzA2ODk5Nzg0OCwiaWF0IjoxNDg1MjQ0NTMzLCJleHAiOjE0ODc4MzY1MzN9.NgtYONse-_iTqCHlM3Cof-b1BxDuxL46PC-mxe0AHGo-C3lrjjcFZ8fuf448av3ODIKWmLsooAZy_jfQnJDlNw',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      "postman-token": "eb15588d-c0f3-11f8-6739-3ba63bbf86ea"
    })
    .send()
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.body.status,true);
      done();
    });
  });



  after(()=>{
    app.close();
  });
});


describe("MODIFY course",function(){
  beforeEach(()=>{
    app= require('../../server');
    server = supertest.agent(app);
  });
  it("With file",function(done){
    this.timeout(30000);
    server
    .post("/user/intern/modify/course")
    // Attach the form information to upload a course
    .attach('file',path.join(__dirname, "360-video-example-master.zip"))
    .field('id_proveedor', '1')
    .field('titulo', 'Modified from Mocha on Server Side')
    .field('descripcion', 'Curso de prueba a la bbdd')
    .field('id_tipo_contenido', 2)
    .field('id_contenido', 5)
    .field('duracion', 20)
    .field('id_sistema_evaluacion', 2)
    .field('id_estado', 1)
    .field('id_proyecto', 1)
    .field('notas', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
    .set({
      authorization: 'prueba eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjAuNTY4NjA0MzA2ODk5Nzg0OCwiaWF0IjoxNDg1MjQ0NTMzLCJleHAiOjE0ODc4MzY1MzN9.NgtYONse-_iTqCHlM3Cof-b1BxDuxL46PC-mxe0AHGo-C3lrjjcFZ8fuf448av3ODIKWmLsooAZy_jfQnJDlNw',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      "postman-token": "eb15588d-c0f3-11f8-6739-3ba63bbf86ea"
    })
    .send()
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.body.status,true);
      done();
    });
  });


  it("Without file",function(done){
    this.timeout(30000);
    server
    .post("/user/intern/modify/course")
    // Attach the form information to upload a course
    .field('id_proveedor', '1')
    .field('titulo', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')
    .field('descripcion', 'Curso de prueba a la bbdd')
    .field('id_tipo_contenido', '2')
    .field('duracion', '20')
    .field('id_sistema_evaluacion', '2')
    .field('id_estado', '1')
    .field('id_contenido', 1)
    .field('id_proyecto', '1')
    .field('notas', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
    .set({
      authorization: 'prueba eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjAuNTY4NjA0MzA2ODk5Nzg0OCwiaWF0IjoxNDg1MjQ0NTMzLCJleHAiOjE0ODc4MzY1MzN9.NgtYONse-_iTqCHlM3Cof-b1BxDuxL46PC-mxe0AHGo-C3lrjjcFZ8fuf448av3ODIKWmLsooAZy_jfQnJDlNw',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      "postman-token": "eb15588d-c0f3-11f8-6739-3ba63bbf86ea"
    })
    .send()
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.body.status,true);
      done();
    });
  });


  afterEach(() => {
    app.close();
  });
});
