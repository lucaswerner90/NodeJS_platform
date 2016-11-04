/*
  THIS FILE MANAGE ALL THE QUERYS RELATED WITH USERS

  /bbdd/users/*


*/
let express=require('express');
let userRouter=express.Router();


let USER_QUERIES=require('../queries/user.json');

userRouter.get('/',(req,res)=>{
  res.send('In the user\'s router');
});



// Export the user router object
module.exports=userRouter;
