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

  return_user(){
    let _self=this;



    return new Promise((resolve,reject)=>{


      if(_self._id_usuario===-1){
        resolve(new Admin(_self._id_usuario));
      }


      this._get_type_of_user().then((data)=>{
        switch (data) {
          case "Administrador":
            resolve(new Admin(_self._id_usuario));
            break;
          case "Proveedor externo":
            resolve(new Extern(_self._id_usuario));
            break;
          case "Proveedor interno":
            resolve(new Intern(_self._id_usuario));
            break;
          case "Cliente":
            resolve(new Client(_self._id_usuario));
            break;
          default:
            resolve(new Consult(_self._id_usuario));
            break;

        }
      })
      .catch((err)=>{
        reject(err);
      });
    });

  }
}

module.exports=Selector;
