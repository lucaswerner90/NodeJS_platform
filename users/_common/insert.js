"use strict";

const express=require('express');
const router=express.Router();

const Form=require('../../files/_form');
const Selector=require('../profiles/_selector');


// Deberemos pasarle los campos de busqueda y el id del proveedor pero no necesitamos el id del usuario
router.post('/course',(req,res)=>{


  let formulario=new Form(req,()=>{
    let select_user=new Selector(formulario._campos["id_usuario"]);
    select_user.return_user().then((profile)=>{
      let user=profile;
      user.create_course(formulario._campos).then(()=>{
        select_user=null;
        res.send({status:true});
      })
      .catch((err)=>{
        res.send({error:err});
      });
    })
    .catch((err)=>{
      res.send({error:err});
    });
  },function(err){
    res.send({error:err});
  });





});



module.exports=router;
