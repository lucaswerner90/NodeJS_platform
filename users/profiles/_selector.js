const Intern=require('./intern');
const Extern=require('./extern');
const Admin=require('./administrator');
const Client=require('./client');
const Consult=require('./consulter');
const User=require('../_common/user');


class Selector extends User{

  constructor(id_usuario){
    super(id_usuario);
  }

  return_user_object(data){

    const _self=this;

    switch (data) {
      case "Administrador":
        return(new Admin(_self._id_usuario));
      case "Proveedor externo":
        return(new Extern(_self._id_usuario));
      case "Proveedor interno":
        return(new Intern(_self._id_usuario));
      case "Cliente":
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
        this._get_type_of_user().then((data)=>{

          resolve(_self.return_user_object(data));
        })
        .catch((err)=>{
          reject(err);
        });


    });

  }
}

module.exports=Selector;
