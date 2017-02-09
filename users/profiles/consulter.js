"use strict";


const DB=require('../../db/coreFunctions');
const DBQueries=require('../../db/queries/user/consult.json');

const User=require('../_common/user');

class ConsultProfile extends User{
  constructor(id_usuario=-1){
    super(id_usuario);
  }
}





module.exports=ConsultProfile;
