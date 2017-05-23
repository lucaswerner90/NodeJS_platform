const Intern=require('./intern');
const Extern=require('./extern');
const Admin=require('./administrator');
const Client=require('./client');
const Consult=require('./consulter');
const User=require('../_common/user');


const PROFILE_KEYS={
  "admin":"administrador",
  "externo":"proveedor externo",
  "interno":"proveedor interno",
  "cliente":"cliente"
};


class Selector extends User{

  constructor(id_usuario){
    super(id_usuario);
  }

  return_user_object(data){

    const _self=this;
    switch (data.toLowerCase()) {
      case PROFILE_KEYS.admin:
        return(new Admin(_self._id_usuario));
      case PROFILE_KEYS.externo:
        return(new Extern(_self._id_usuario));
      case PROFILE_KEYS.interno:
        return(new Intern(_self._id_usuario));
      case PROFILE_KEYS.cliente:
        return(new Client(_self._id_usuario));
      default:
        return(new Consult(_self._id_usuario));

    }
  }

  return_user(){
    const _self=this;

    return new Promise((resolve,reject)=>{

        if(_self._id_usuario===-1){
          resolve(new Admin(_self._id_usuario));
        }
        _self._get_type_of_user().then((data)=>{
          resolve(_self.return_user_object(data));
        })
        .catch((err)=>{
          reject(err);
        });


    });

  }
}

module.exports=Selector;
