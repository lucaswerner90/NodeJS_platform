// /*
//   THIS FILE MANAGE ALL THE QUERYS RELATED WITH USERS
//
//   /bbdd/users/*
//
//
// */
// 'use strict';
// const express=require('express');
// const userRouter=express.Router();
//
//
// const USER_QUERIES=require('../queries/user');
// const CORE_FUNCTIONS=require('../coreFunctions');
//
//
// userRouter.post('/getUser',(req,res)=>{
//   /*
//   userEmail: javier1.rodriguezandres@telefonica.com
//   userPassword: 7878
//   */
//
//   CORE_FUNCTIONS.sendQuery(USER_QUERIES.GET.user,req.body).then((rows)=>{
//     return res.status(200).send(rows);
//   })
//   .catch(()=>{
//     return res.send({status:false,message:'DDBB Error'});
//   });
// });
//
//
//
// userRouter.get('/getProveedor/:id_proveedor',(req,res)=>{
//
//   CORE_FUNCTIONS.sendQuery(USER_QUERIES.GET.proveedor,req.params).then((rows)=>{
//     return res.status(200).send(rows[0]);
//   })
//   .catch(()=>{
//     return res.send({status:false,message:'DDBB Error'});
//   });
// });
//
//
//
// // Export the user router object
// module.exports=userRouter;
