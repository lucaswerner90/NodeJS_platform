
let fs = require('fs');





/*
  We create a pipe to transmit the file from the HTML form to a folder in our
  nodeJS server
*/
exports.moveFileToServer=(input=null,output=null)=>{
  let readableStream = fs.createReadStream(input);
  let writableStream = fs.createWriteStream(output);
  readableStream.pipe(writableStream);
}

/*
  We create a pipe to transmit the file from the nodeJS server to a folder in our
  FTP server
*/
exports.moveFileToFTP=(input=null,output=null)=>{
  let readableStream = fs.createReadStream(input);
  let writableStream = fs.createWriteStream(output);
  readableStream.pipe(writableStream);
}
