const express=require('express');
const router=express.Router();

const Database=require('../db/database');
const DB=new Database();

const modify=require('./_common/modify');
const insert=require('./_common/insert');
const get=require('./_common/get');


router.use("/modify",modify);
router.use("/insert",insert);
router.use("/get",get);


module.exports=router;
