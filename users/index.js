const express=require('express');
const router=express.Router();
const BODY_PARSER=require('body-parser');

const modify=require('./_common/modify');
const insert=require('./_common/insert');
const get=require('./_common/get');


router.use("/modify",BODY_PARSER.json({extended:true}),modify);
router.use("/insert",insert);
router.use("/get",BODY_PARSER.json({extended:true}),get);


module.exports=router;
