var assert = require("assert");
var supertest = require("supertest");
var app;
var server;
// This agent refers to PORT where program is runninng.




describe("UPLOAD course",function(){

  before(()=>{
    app= require('../../server');
    server = supertest.agent(app);
  });

  it("New course",function(done){


    server
    .post("/user/intern/create/course")
    .set({
      authorization: 'prueba eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOjAuNTY4NjA0MzA2ODk5Nzg0OCwiaWF0IjoxNDg1MjQ0NTMzLCJleHAiOjE0ODc4MzY1MzN9.NgtYONse-_iTqCHlM3Cof-b1BxDuxL46PC-mxe0AHGo-C3lrjjcFZ8fuf448av3ODIKWmLsooAZy_jfQnJDlNw',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      body:
      {
        id_proveedor: '1',
        titulo: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        descripcion: 'Curso de prueba a la bbdd',
        id_tipo_contenido: '2',
        duracion: '20',
        id_sistema_evaluacion: '2',
        id_estado: '1',
        id_proyecto: '1',
        filename:{
          value: 'fs.createReadStream("360-video-example-master.zip")',
          options: {
            filename: '360-video-example-master.zip',
            contentType: null
          }
        },
        notas: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      },
      "postman-token": "eb15588d-c0f3-11f8-6739-3ba63bbf86ea"
    })
    .send()
    .end(function(err,res){
      console.log("Response body:  "+res.body);
      assert.equal(true,true);

      done();
    });
  });


  after(()=>{
    app.close();
  })
});
