"use strict";


const DB=require('../../db/coreFunctions');
const User=require('../_common/user');

class InternProfile extends User{
  constructor(id_usuario=-1){
    super(id_usuario);
  }
}





module.exports=InternProfile;
