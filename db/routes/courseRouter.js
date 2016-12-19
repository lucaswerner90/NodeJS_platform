/*
  THIS FILE MANAGE ALL THE QUERYS RELATED WITH COURSES


  /bbdd/course/*

*/
"use strict";
let COURSES_QUERIES=require('../queries/course.json');
let DDBB=require('../coreFunctions');

let express=require('express');
let courseRouter=express.Router();


courseRouter.get('/getAllContenidos/:id_proveedor',(req,res)=>{
  DDBB.sendQuery(COURSES_QUERIES.getAll,req.params).then((data)=>{
    return res.send(data[0]);
  })
  .catch((err)=>{
    return res.send(err);
  })
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
      exploitedRights:data[6]
    }
    return res.send(dataResults);
  })
  .catch((err)=>{
    return res.send(err);
  })
});



// Export the course router object
module.exports=courseRouter;
