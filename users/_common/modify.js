// Needed to create the Modify information router
const express=require('express');

const router=express.Router();

const User=require('./user');


router.post('/personal_info',(req,res)=>{


  let user=new User(req.body.id_usuario);
  user.modify_personal_info(req).then(()=>{
    res.send({status:true});
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
