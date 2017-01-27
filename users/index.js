// TODO: Crear un enrutador para los diferentes tipos de usuarios


const express=require('express');
const router=express.Router();

const intern_router=require('./profiles/intern');
const extern_router=require('./profiles/extern');


router.use('/intern',intern_router);
router.use('/extern',extern_router);



module.exports=router;
