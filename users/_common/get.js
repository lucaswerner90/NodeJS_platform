"use strict";

const express=require('express');

const router=express.Router();

const User=require('./user');

const Selector=require('../profiles/_selector');


router.get('/avatar/file=:filename',(req,res)=>{
  let user=new User();
  user.get_avatar(req.params.filename).then((data)=>{
    user._close_connections();
    user=null;
    res.send(data);
  })
  .catch((err)=>{
    res.send({error:err});
  });
});

router.get('/user_info/id_usuario=:id_usuario',(req,res)=>{
  let user=new User();
  user.get_user_info(req.params.id_usuario).then((data)=>{
    user._close_connections();
    user=null;
    res.send(data);
  })
  .catch((err)=>{
    res.send({error:err});
  });
});


router.get('/catalogo',(req,res)=>{
  let user=new User();
  user.get_catalogo().then((data)=>{
    user._close_connections();
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
      user._close_connections();
      select_user=null;
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
    user=null;
  }else{
    res.status(403).send({error:"NO! Solo desde la plataforma :)! PD: Un beso (K)  "});
  }


});


router.get('/content/id_content=:id_content',(req,res)=>{
  let select_user=new Selector(req.body.id_usuario);
  select_user.return_user().then((profile)=>{
    let user=profile;
    user.get_content_by_id(req.params.id_content).then((data)=>{
      user._close_connections();
      select_user=null;
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




module.exports=router;
