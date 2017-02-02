/*
THIS FILE MANAGE ALL THE QUERYS RELATED WITH COURSES


/bbdd/course/*

*/

// TODO: Reestructurar el fichero mandandolo a uno nuevo en una nueva carpeta de cursos

'use strict';
const COURSES_QUERIES=require('../queries/course.json');
const DDBB=require('../coreFunctions');

const express=require('express');
const courseRouter=express.Router();


courseRouter.get('/getAllContenidos/:id_proveedor',(req,res)=>{
  DDBB.sendQuery(COURSES_QUERIES.GET.allByID,req.params).then((data)=>{

    let arrayPromises=[];
    for (let i = 0; i < data.length; i++) {
      arrayPromises[i]=DDBB.sendQuery(COURSES_QUERIES.GET.tableOfCompatibilities,data[i]);
    }

    Promise.all(arrayPromises).then((values)=>{
      for (let i = 0; i < data.length; i++) {
        data[i].compatibilities_table=values[i];
      }
      return res.send(data);

    })
    .catch((err)=>{
      return res.send(err);
    });
  })
  .catch((err)=>{
    return res.send(err);
  });
});


courseRouter.get('/getAllContenidos',(req,res)=>{
  DDBB.sendQuery(COURSES_QUERIES.GET.all,req.params).then((data)=>{
    return res.send(data);
  })
  .catch((err)=>{
    return res.send(err);
  });
});


courseRouter.get('/getGenericInformation',(req,res)=>{
  DDBB.sendQuery(COURSES_QUERIES.GET.genericInformation,null).then((data)=>{

    const dataResults={
      platforms:data[0],
      evaluationSystems:data[1],
      contentTypes:data[2],
      states:data[3],
      technologies:data[4],
      educationLevels:data[5],
      exploitedRights:data[6],
      tipoProveedores:data[7],
      proyectos:data[8],
      idiomas:data[9],
      puntos_control:data[10],
      valores_certificacion:data[11]
    };

    return res.send(dataResults);
  })
  .catch((err)=>{
    return res.send(err);
  });
});



courseRouter.post('/search',(req,res)=>{
  DDBB.sendQuery(COURSES_QUERIES.GET.search,req.body,true).then((data)=>{
    return res.send(data);
  })
  .catch((err)=>{
    return res.send(err);
  });
});


// Must have the id_contenido variable
courseRouter.get('/compatibilityTable/:id_contenido',(req,res)=>{

  // req.params.id_contenido
  DDBB.sendQuery(COURSES_QUERIES.GET.tableOfCompatibilities,
    {id_contenido:req.params.id_contenido},
    true).then((data)=>{
    return res.send(data);
  })
  .catch((err)=>{
    return res.send(err);
  });
});



// Export the course router object
module.exports=courseRouter;
