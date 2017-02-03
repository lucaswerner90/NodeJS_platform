let assert = require("assert");
let supertest = require("supertest");
let path=require('path');
let app;
let server;


const CONFIG=require('./config_test.json');


describe("SEARCH course",function(){

  beforeEach(()=>{
    app= require('../../server');
    server = supertest.agent(app);
  });

  it("Only with title",function(done){

    this.timeout(CONFIG.server.max_timeout);

    server
    .post(CONFIG.routes.bbdd.search)

    .set(CONFIG.headers)
    .set({"content-type": "application/x-www-form-urlencoded"})
    .send(CONFIG.data.course_search)
    .end(function(err, res) {

      assert(res.body.length>0);
      assert.equal(res.error,false);

      done();
    });
  });

  afterEach(()=>{
    app.close();
  });

});


describe("UPLOAD course",function(){

  before(()=>{
    app= require(CONFIG.server.dir);
    server = supertest.agent(app);
  });


  it("New course",function(done){
    this.timeout(CONFIG.server.max_timeout);
    server
    .post(CONFIG.routes.course.upload)
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
    .set(CONFIG.headers)
    .send()
    .end((err,res)=>{
      assert.equal(res.body.status,true);
      assert.equal(res.status,200);
      assert.equal(res.error,false);
      done();
    });

  });



  after(()=>{
    app.close();
  });
});


describe("MODIFY course",function(){
  beforeEach(()=>{
    app= require(CONFIG.server.dir);
    server = supertest.agent(app);
  });
  it("With file",function(done){
    this.timeout(CONFIG.server.max_timeout);
    server
    .post(CONFIG.routes.course.modify)
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
    .set(CONFIG.headers)
    .send()
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.body.status,true);
      assert.equal(res.error,false);
    });
    done();
  });


  it("Without file",function(done){
    this.timeout(CONFIG.server.max_timeout);
    server
    .post(CONFIG.routes.course.modify)
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
    .set(CONFIG.headers)
    .send()
    .expect(200)
    .end(function(err, res) {
      assert.equal(res.body.status,true);
      assert.equal(res.error,false);
    });
    done();
  });


  afterEach(() => {
    app.close();
  });
});
