'use strict';
const CORE_DB= require('./coreFunctions');

// Needed to create the DB router
const express=require('express');

const routerDB=express.Router();

// Import of the secondary routers to manage the db operations
const userRouter=require('./routes/userRouter');
const courseRouter=require('./routes/courseRouter');
CORE_DB.startConnection();

routerDB.use("/user",userRouter);

routerDB.use("/course",courseRouter);





/*
  WE EXPORT THE ROUTER THAT MANAGE THE DB
*/
module.exports=routerDB;
