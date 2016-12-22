/*
THIS FILE MANAGE ALL THE QUERYS RELATED WITH COURSES


/bbdd/course/*

*/
'use strict';
const COURSES_QUERIES=require('../queries/course.json');
const DDBB=require('../coreFunctions');

const express=require('express');
const courseRouter=express.Router();


courseRouter.get('/getAllContenidos/:id_proveedor',(req,res)=>{
  DDBB.sendQuery(COURSES_QUERIES.getAllByID,req.params).then((data)=>{
    return res.send(data);
  })
  .catch((err)=>{
    return res.send(err);
  });
});


courseRouter.get('/getAllContenidos',(req,res)=>{
  DDBB.sendQuery(COURSES_QUERIES.getAll,req.params).then((data)=>{
    return res.send(data);
  })
  .catch((err)=>{
    return res.send(err);
  });
});


courseRouter.get('/getGenericInformation',(req,res)=>{
  DDBB.sendQuery(COURSES_QUERIES.getGenericInformation,null).then((data)=>{

    let dataResults={
      platforms:data[0],
      evaluationSystems:data[1],
      contentTypes:data[2],
      states:data[3],
      technologies:data[4],
      educationLevels:data[5],
      exploitedRights:data[6],
      tipoProveedores:data[7]
    };

    return res.send(dataResults);
  })
  .catch((err)=>{
    return res.send(err);
  });
});



// Export the course router object
module.exports=courseRouter;
