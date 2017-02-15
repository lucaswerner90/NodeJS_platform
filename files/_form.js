const multiparty=require('multiparty');

class Form{
  constructor(request,callbackOnClose,callbackOnError){

    this._formulario = new multiparty.Form();
    this._campos={};


    this._formulario.on("file",(name,file)=>{
      if(name==='screenshot'){
        this._campos['screenshot']=file;
      }else{
        this._campos['file_to_upload']=file;
      }
    });


    this._formulario.on("file",(name,file)=>{
      if(name==='screenshot'){
        this._campos['screenshot']=file;
      }else{
        this._campos['file_to_upload']=file;
      }

    });


    this._formulario.once("close",()=>{
      callbackOnClose();
    });




    this._formulario.once("error",(err)=>{
      console.log("Error on parse form...");
      this.clear();
      callbackOnError(err);
    });



    this._formulario.on("field",(name,value)=>{
      this._campos[name]=value;
    });



    this._formulario.parse(request);
  }

  clear(){
    this._formulario.removeAllListeners();
    this._formulario=null;
    this._campos={};
  }


}

module.exports=Form;
