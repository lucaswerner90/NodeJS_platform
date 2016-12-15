"use strict";
let multiparty=require('multiparty');
let form = new multiparty.Form();

exports.parseForm=(req)=>{

  // Varibales that manage the data of the form
  let formFields={};
  let formFiles={};

  form.parse(req, function(err, fields, files) {



    for (let field in fields) {
      formFields[field]=fields[field][0];
      console.log(formFields);
    }
    for (let file in files) {
      console.log(files[file][0]);
    }
    return {campos:formFields,ficheros:formFiles};

  });

}
