"use strict";

const express=require('express');

const router=express.Router();

const User=require('./user');

const Selector=require('../profiles/_selector');


router.get('/avatar/file=:filename',(req,res)=>{
  let user=new User();
  user.get_avatar(req.params.filename).then((data)=>{
    user=null;
    res.send(data);
  })
  .catch((err)=>{
    res.send({error:err});
  });
});


router.get('/generic_info',(req,res)=>{
  let select_user=new Selector(req.body.id_usuario);
  select_user.return_user().then((profile)=>{
    let user=profile;
    user.get_platform_generic_info().then((data)=>{
      user._close_connections();
      select_user=null;
      res.send(data);
    })
    .catch((err)=>{
      res.send({error:err});
    });
  })
  .catch((err)=>{
    res.send({error:err});
  });

});


// A esta funcion le tenemos que pasar el req.body.id_usuario y nosotros nos encargamos de obtener la info del user y el proveedor que le corresponde
router.post('/contents',(req,res)=>{
  let select_user=new Selector(req.body.id_usuario);
  select_user.return_user().then((profile)=>{
    let user=profile;
    user.get_contents().then((data)=>{
      select_user=null;
      user._close_connections();
      user=null;
      res.send(data);
    })
    .catch((err)=>{
      select_user=null;
      user=null;
      res.send({error:err});
    });
  })
  .catch((err)=>{
    select_user=null;
    res.send({error:err});
  });


});


router.get('/download/filepath=:filepath',(req,res)=>{
  if(req.headers && req.headers.referer && req.headers.referer.indexOf('editar-contenido?index')>-1){
    let user=new User();
    user.download_zip(req.params.filepath,res);
    user._db_connection._connection.end();
    user=null;
  }else{
    res.status(403).send({error:"Qué carajo hacés pelotudo? Salí de aca :) ! PD: Un beso 8=============D  "});
  }


});




module.exports=router;
