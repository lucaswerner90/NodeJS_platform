'use strict';
const modifyInfoUser=require('../users/_common/modify');
const getInfoUser=require('../users/_common/get');
const insertInfo=require('../users/_common/insert');



// Needed to create the File router
const express=require('express');

const router=express.Router();



router.use('/insert',insertInfo);
router.use('/modify',modifyInfoUser);
router.use('/get',getInfoUser);
/********************************************************************************************************************/
/********************************************************************************************************************/

module.exports=router;
/********************************************************************************************************************/
