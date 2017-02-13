"use strict";


const DBQueries=require('../../db/queries/user/extern.json');
const User=require('../_common/user');

class ExternProfile extends User{
  constructor(id_usuario=-1){
    super(id_usuario,DBQueries);
  }
}





module.exports=ExternProfile;
