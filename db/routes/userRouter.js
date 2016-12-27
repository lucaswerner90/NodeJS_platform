/*
  THIS FILE MANAGE ALL THE QUERYS RELATED WITH USERS

  /bbdd/users/*


*/
'use strict';
const express=require('express');
let userRouter=express.Router();


const USER_QUERIES=require('../queries/user');
const CORE_FUNCTIONS=require('../coreFunctions');


userRouter.post('/getUser',(req,res)=>{
  /*
  Usuario prueba:
  userEmail: javier1.rodriguezandres@telefonica.com
  userPassword: 7878
  */

  CORE_FUNCTIONS.sendQuery(USER_QUERIES.getUser,req.body).then((rows)=>{
    return res.status(200).send(rows);
  })
  .catch(()=>{
    return res.send({status:false,message:'DDBB Error'});
  });
});



// Export the user router object
module.exports=userRouter;
