"use strict";
let CORE_DB= require('./coreFunctions');


// Needed to create the DB router
let express=require('express');

let routerDB=express.Router();

// Import of the secondary routers to manage the db operations
let userRouter=require('./routes/userRouter');
let courseRouter=require('./routes/courseRouter');

routerDB.use("/user",userRouter);

routerDB.use("/course",courseRouter);





/*
  WE EXPORT THE ROUTER THAT MANAGE THE DB
*/
module.exports=routerDB;
