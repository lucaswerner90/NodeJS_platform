"use strict";

const express=require('express');

const router=express.Router();

const Selector=require('../profiles/_selector');


// Deberemos pasarle los campos de busqueda y el id del proveedor pero no necesitamos el id del usuario
router.post('/course',(req,res)=>{

  const select_user=new Selector();
  select_user.return_user().then((profile)=>{
    const user=profile;
    user.create_course(req).then(()=>{
      res.send({status:true});
    })
    .catch((err)=>{
      res.send({error:err});
    });
  })
  .catch((err)=>{
    res.send({error:err});
  });


});



module.exports=router;
