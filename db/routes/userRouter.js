/*
  THIS FILE MANAGE ALL THE QUERYS RELATED WITH USERS

  /bbdd/users/*


*/
"use strict";
let express=require('express');
let userRouter=express.Router();


let USER_QUERIES=require('../queries/user.json');
let CORE_FUNCTIONS=require('../coreFunctions');

CORE_FUNCTIONS.startConnection();

userRouter.get('/',(req,res)=>{
  CORE_FUNCTIONS.sendQuery("SHOW TABLES FROM catalogo_contenidos;");
  // CORE_FUNCTIONS.eventosDB.on("queryCompleted",function(){
  //   console.log("QueryCompleted...");
  // })
  res.send('In the user\'s router');


  // CORE_FUNCTIONS.finishConnection();
});



// Export the user router object
module.exports=userRouter;
