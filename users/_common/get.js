"use strict";

const express=require('express');

const router=express.Router();

const User=require('./user');

const Selector=require('../profiles/_selector');


router.get('/avatar/file=:filename',(req,res)=>{
  let user=new User();
  user.get_avatar(req.params.filename).then((data)=>{
    user._db_connection._connection.end();
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




// Deberemos pasarle los campos de busqueda y el id del proveedor pero no necesitamos el id del usuario
router.post('/search',(req,res)=>{

  let select_user=new Selector(req.body.id_usuario);
  select_user.return_user().then((profile)=>{
    let user=profile;
    user.search_course(req.body).then((data)=>{
      select_user=null;
      user=null;
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



router.get('/download/filepath=:filepath',(req,res)=>{

  let user=new User();
  user.download_zip(req.params.filepath,res);
  user._db_connection._connection.end();
  user=null;

});




module.exports=router;
