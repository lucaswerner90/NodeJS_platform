"use strict";


const DBQueries=require('../../db/queries/user/client.json');
const User=require('../_common/user');

class ClientProfile extends User{
  constructor(id_usuario=-1){
    super(id_usuario,DBQueries);
  }


}





module.exports=ClientProfile;
