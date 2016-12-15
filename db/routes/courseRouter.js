/*
  THIS FILE MANAGE ALL THE QUERYS RELATED WITH COURSES


  /bbdd/course/*

*/
"use strict";
let COURSES_QUERIES=require('../queries/course.json');


let express=require('express');
let courseRouter=express.Router();


courseRouter.get('/',(req,res)=>{
  res.send('In the course\'s router');
});



// Export the course router object
module.exports=courseRouter;
