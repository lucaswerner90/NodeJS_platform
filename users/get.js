// Needed to create the Modify information router
const express=require('express');

const router=express.Router();

const FILE_FUNCTIONS = require('../files/fileFunctions');


router.get('/avatar/file=:filename',(req,res)=>{
  FILE_FUNCTIONS.downloadImageInBase64(req.params.filename).then((data)=>{
    res.send(data);
  })
  .catch((err)=>{
    res.send({error:err});
  });
});





module.exports=router;
