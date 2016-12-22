/*
  THIS FILE MANAGE ALL THE QUERYS RELATED WITH USERS

  /bbdd/users/*


*/
'use strict';
let express=require('express');
let userRouter=express.Router();


let USER_QUERIES=require('../queries/user');
let CORE_FUNCTIONS=require('../coreFunctions');

CORE_FUNCTIONS.startConnection();

userRouter.post('/getUser',(req,res)=>{
  /*
  Usuario prueba:
  userEmail: javier1.rodriguezandres@telefonica.com
  userPassword: 7878
  */
  // let exampleQuery={
  //   "userEmail": "javier1.rodriguezandres@telefonica.com",
  //   "userPassword": "7878"
  // }
  console.log(req.body);
  CORE_FUNCTIONS.sendQuery(USER_QUERIES.getUser,req.body).then((rows)=>{
    console.log(rows);
    return res.status(200).send(rows);
  })
  .catch((err)=>{
    return res.send({status:false,message:'DDBB Error'});
  });
});



// Export the user router object
module.exports=userRouter;
