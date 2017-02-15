"use strict";

const express=require('express');

const router=express.Router();

const User=require('./user');

const Selector=require('../profiles/_selector');


router.get('/avatar/file=:filename',(req,res)=>{
  const user=new User();
  user.get_avatar(req.params.filename).then((data)=>{
    res.send(data);
  })
  .catch((err)=>{
    res.send({error:err});
  });
});


router.get('/generic_info',(req,res)=>{
  const select_user=new Selector(req.body.id_usuario);
  select_user.return_user().then((profile)=>{
    const user=profile;
    user.get_platform_generic_info().then((data)=>{
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
  debugger;
  const select_user=new Selector(req.body.id_usuario);
  select_user.return_user().then((profile)=>{
    const user=profile;
    user.get_contents().then((data)=>{
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




// Deberemos pasarle los campos de busqueda y el id del proveedor pero no necesitamos el id del usuario
router.post('/search',(req,res)=>{

  const select_user=new Selector(req.body.id_usuario);
  select_user.return_user().then((profile)=>{
    const user=profile;
    user.search_course(req.body).then((data)=>{
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

});




module.exports=router;
