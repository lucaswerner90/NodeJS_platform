// Needed to create the Modify information router
const express=require('express');
const router=express.Router();

const Form=require('../../files/_form');
const User=require('./user');
const Selector=require('../profiles/_selector');



router.post('/course',(req,res)=>{

  let formulario=new Form(req,()=>{
    const select_user=new Selector(formulario._campos['id_usuario']);
    select_user.return_user().then((profile)=>{
      const user=profile;
      user.modify_course(formulario._campos).then(()=>{
        formulario.clear();
        res.send({status:true});
      })
      .catch((err)=>{
        formulario.clear();
        res.send({error:err});
      });
    })
    .catch((err)=>{
      formulario.clear();
      res.send({error:err});
    });
  },function(err){
    formulario.clear();
    res.send({error:err});
  });

});


router.post('/personal_info',(req,res)=>{


  const select_user=new Selector(req.body.id_usuario);
  select_user.return_user().then((profile)=>{
    const user=profile;
    user.modify_personal_info(req.body).then(()=>{
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



router.post('/change_password',(req,res)=>{

  let user=new User(req.body.id_usuario);
  user.modify_avatar(req.body).then(()=>{
    res.send({status:true});
  })
  .catch((err)=>{
    res.send({error:err});
  });
});


router.post('/avatar',(req,res)=>{

  let user=new User();
  user.modify_avatar(req).then(()=>{
    res.send({status:true});
  })
  .catch((err)=>{
    res.send({error:err});
  });
});





module.exports=router;
