const PATH = require('path');
const fs = require('fs');
const BASE_64_ENCODER = require('base64-stream');
const FTP = require('./_ftpModel');
const CONFIG = require('./config.json');


/**
 * 
 * 
 * @class File
 */
class File {

  constructor() {
    this._ftp = new FTP();
    this._config = CONFIG;
  }

  /**
   * 
   * 
   * 
   * @memberof File
   */
  _close_connection() {
    const _self = this;
    _self._ftp._close_connection();
  }

  /**
   * 
   * 
   * @returns {String} actual date string
   * 
   * @memberof File
   */
  _returnActualDate() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }


  /**
   * 
   * 
   * @returns {String} actual date to append to the filename
   * 
   * @memberof File
   */
  _appendDateToFilename() {
    const fecha = new Date();
    const month = (fecha.getMonth() + 1 < 10) ? `0${fecha.getMonth()+1}` : fecha.getMonth() + 1;
    const day = (fecha.getDate() + 1 < 10) ? `0${fecha.getDate()+1}` : fecha.getDate() + 1;
    const hours = (fecha.getHours() + 1 < 10) ? `0${fecha.getHours()+1}` : fecha.getHours() + 1;
    const minutes = (fecha.getMinutes() < 10) ? `0${fecha.getMinutes()+1}` : fecha.getMinutes() + 1;
    const seconds = (fecha.getSeconds() < 10) ? `0${fecha.getSeconds()+1}` : fecha.getSeconds() + 1;
    return `${fecha.getFullYear()}_${month}_${day}_${hours}_${minutes}_${seconds}`;
  }


  /**
   * 
   * 
   * @param {any} extensions 
   * @param {any} fileExtension 
   * @returns {Boolean} if the extension is valid
   * 
   * @memberof File
   */
  _checkFileExtension(extensions, fileExtension) {
    for (let i = 0; i < extensions.length; i++) {
      if (fileExtension.indexOf(extensions[i]) > -1) {
        return true;
      }
    }
    return false;
  }


  /**
   * 
   * 
   * @param {String} contentType 
   * @param {Object} formFields 
   * @param {String} uploadDirectory 
   * @param {any} filename 
   * @returns  {String} final route for the file
   * 
   * @memberof File
   */
  _fileRoute(contentType, formFields, uploadDirectory, filename) {
    switch (contentType) {
      case "avatar":
        return `${uploadDirectory}/${formFields.id_usuario}/avatar ${filename.ext}`;
      case "zip":
        return `${uploadDirectory}/${formFields.carpeta_proveedor}/${formFields.codigo_proyecto}/${filename.name}/${filename.name}${filename.ext}`;
    }
  }

  /**
   * 
   * 
   * @param {any} formFields 
   * @param {any} uploadDirectory 
   * @param {any} filename 
   * @returns {String} Route where the zip will be decompressed
   * 
   * @memberof File
   */
  _fileDecompresionRoute(formFields, uploadDirectory, filename) {
    return uploadDirectory + "/" + formFields.carpeta_proveedor + "/" + formFields.codigo_proyecto+"/"+ filename.name + "/" + filename.name;
  }

  _parseRutaEjecucion(ruta) {
    let ruta_parseada = ruta.split("/");
    ruta_parseada = ruta_parseada.splice(-1, 1);
    ruta_parseada = ruta_parseada.join("/");

    return ruta_parseada;
  }

  /**
   * 
   * 
   * @param {any} file 
   * @param {any} formFields 
   * @param {any} uploadDirectory 
   * @param {any} extensionsAllowed 
   * @param {boolean} [avatar=false] 
   * @returns {Promise}
   * 
   * @memberof File
   */
  uploadContentFile(file, formFields, uploadDirectory, extensionsAllowed) {

    const _self = this;

    let newFilename;
    let ruta_file = '';
    let readableStream;

    function removeVariables() {
      newFilename = null;
      ruta_file = null;
      readableStream = null;
    }

    return new Promise((resolve, reject) => {

      //If the file comes empty, we don't have to do nothing.
      if (!file) {
        resolve(true);
      }

      if (_self._checkFileExtension(extensionsAllowed, PATH.parse(file.originalFilename).ext)) {



        if (formFields["ruta_zip"] !== undefined && formFields["ruta_zip"] !== null) {


          let parsed_ruta_zip = formFields["ruta_zip"].split("/");
          parsed_ruta_zip = parsed_ruta_zip[parsed_ruta_zip.length - 1];
          newFilename = PATH.parse(parsed_ruta_zip);
          formFields["ruta_zip"] = formFields["ruta_zip"].split(`${_self._config.ftpConnection.equivalent_url}/`)[1];

        } else {

          newFilename = PATH.parse(file.originalFilename);
          
          
          // Cuando el contenido es de los antiguos, no existe ruta de zip pero si ruta de ejecucion en la cual subir el nuevo zip
          if (formFields.rutaEjecucion !== null && formFields.rutaEjecucion !== undefined) {
            formFields["ruta_zip"] = _self._parseRutaEjecucion(formFields.rutaEjecucion) + "/" + file.originalFilename;
          } else {
            formFields["ruta_zip"] = _self._fileRoute("zip", formFields, uploadDirectory, newFilename);
          }



          
          
        }
        formFields["ruta_descompresion"] = _self._fileDecompresionRoute(formFields, uploadDirectory, newFilename);
        formFields["fecha_alta"] = _self._returnActualDate();
        
        ruta_file = formFields['ruta_zip'];

        // Create the readableStream to upload the file physically
        readableStream = fs.createReadStream(file.path);


        _self._ftp.uploadFile(readableStream, ruta_file).then(() => {
            formFields["ruta_zip"] = _self._fileRoute("zip", formFields, _self._ftp._configuration.ftpConnection.equivalent_url, newFilename);

            resolve(true);
          })
          .catch((err) => {
            removeVariables();
            reject(err);
          });
      } else {
        removeVariables();
        reject({
          error: "No file extension allowed"
        });
      }
    });
  }

  /**
   * 
   * 
   * @param {any} filepath 
   * @returns {Promise}
   * 
   * @memberof File
   */
  downloadImageInBase64(filepath) {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self._ftp.downloadFile(filepath).then((data) => {
          let imageData = `data:image/${PATH.parse(filepath).ext.slice(1)};base64,`;

          data.pipe(BASE_64_ENCODER.encode()).on("data", (buf) => {
              imageData += buf;
            })
            .once("error", (err) => {
              reject(err);
            })
            .once("end", () => {
              resolve(imageData);
            });

        })
        .catch((err) => {
          reject(err);
        });
    });

  }


  /**
   * 
   * 
   * @param {any} filepath 
   * @param {any} response 
   * 
   * @memberof File
   */
  downloadFile(filepath, response) {
    const _self = this;
    _self._ftp.downloadFile(filepath).then((data) => {

        response.attachment(filepath);
        // We pipe the file throught the readableStream object to the response
        data.pipe(response).on("end", function () {
          _self._ftp._FTPDisconnect();

        });
      })
      .catch((err) => {
        response.send(err);
      });

  }




}


module.exports = File;
