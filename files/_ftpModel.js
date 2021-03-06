// Basic configuration
const CONFIG = require('./config');
const PATH = require('path');
const FTP_CLIENT = require('ftp');
const unzip = require('unzip-stream');
const fs = require('fs');



/**
 * 
 * 
 * @class FTPModel
 */
class FTPModel {

  constructor() {
    this._configuration = CONFIG;
    this._ftp = new FTP_CLIENT();
    this._ftp.connect(this._configuration.ftpConnection);

    this._ftp.once("close", () => {
      this._close_connection();
    });

    this._ftp.once("error", () => {
      this._close_connection();
    });
  }

  /**
   * 
   * 
   * 
   * @memberof FTPModel
   */
  _close_connection() {
    const _self = this;
    if (_self._ftp) {
      _self._ftp.removeAllListeners();
      _self._ftp.end();
    }

  }

  /**
   * 
   * 
   * @returns {String}
   * 
   * @memberof FTPModel
   */
  _appendDateToFilename() {
    const fecha = new Date();
    const month = (fecha.getMonth() + 1 < 10) ? `0${fecha.getMonth()+1}` : fecha.getMonth() + 1;
    const day = (fecha.getDate() + 1 < 10) ? `0${fecha.getDate()}` : fecha.getDate();
    const hours = (fecha.getHours() + 1 < 10) ? `0${fecha.getHours()+1}` : fecha.getHours() + 1;
    const minutes = (fecha.getMinutes() < 10) ? `0${fecha.getMinutes()+1}` : fecha.getMinutes() + 1;
    const seconds = (fecha.getSeconds() < 10) ? `0${fecha.getSeconds()+1}` : fecha.getSeconds() + 1;
    return `${fecha.getFullYear()}_${month}_${day}_${hours}_${minutes}_${seconds}`;
  }


  /**
   * 
   * 
   * @param {String} dir 
   * @param {Array} [path=[]] 
   * @returns {Boolean}
   * 
   * @memberof FTPModel
   */
  _checkIfDirExists(dir, path = []) {
    for (let i = 0; i < path.length; i++) {
      if (path[i].name === dir) {
        return true;
      }
    }
    return false;
  }

  /**
   * 
   * 
   * @param {String} path 
   * @returns {Promise}
   * 
   * @memberof FTPModel
   */
  _createDir(path) {
    const _self = this;

    return new Promise((resolve, reject) => {
      _self._ftp.mkdir(path,true, (err) => {
        console.info("[!] Created DIR..... " + path);
        if (err) {
          console.log(err + "       "+ path);
          reject(err);
        }
        resolve(true);
      });
    });
  }

  /**
   * 
   * 
   * @param {Buffer} path 
   * @param {String} remotePath 
   * @returns {Promise}
   * 
   * @memberof FTPModel
   */
  _createFile(path, remotePath) {

    const _self = this;
    return new Promise((resolve, reject) => {
      _self._ftp.put(path, remotePath, function (err) {
        
        if (err && err.code!==550) {
          reject(err);
        } else {
          console.log("[!] Created file...." + remotePath);
          resolve(true);
        }

      });

    });
  }

  /**
   * 
   * 
   * 
   * @memberof FTPModel
   */
  _FTPDisconnect() {
    const _self = this;
    _self._ftp.end();
  }

  /**
   * 
   * 
   * @param {String} oldPath 
   * @param {String} newPath 
   * @returns {Promise}
   * 
   * @memberof FTPModel
   */
  _renameFolder(oldPath, newPath) {
    const _self = this;

    return new Promise((resolve, reject) => {
      _self._ftp.rename(oldPath, newPath, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });

  }

  /**
   * 
   * 
   * @param {Buffer} entry 
   * @returns {Promise}
   * 
   * @memberof FTPModel
   */
  _readDataFile(entry) {

    return new Promise(function (resolve, reject) {


      entry.file_data = [];

      entry.on('data', (chunk) => {
        entry.file_data[entry.file_data.length] = chunk;
      });
      entry.once('end', () => {
        resolve(Buffer.concat(entry.file_data));
      });
      entry.once('error', (error) => {
        reject(error);
      });
      entry.once('close', () => {
        console.log(`[**] Extracting ${entry.path}....`);
        entry.removeAllListeners();
      });
    });
  }


  /**
   * 
   * 
   * @param {File} path 
   * @param {String} remotePath 
   * @returns {Promise}
   * 
   * @memberof FTPModel
   */
  extractZIP(path, remotePath) {

    const _self = this;

    return new Promise((resolve, reject) => {
      if (!path) {
        resolve(true);
      }
      try {
        let unzip_pipe = unzip.Parse();
        unzip_pipe.once("error", (err) => {
          reject(err);
        });
        let uploadPipe = fs.createReadStream(path.path).pipe(unzip_pipe);
        let arrayDirectories = [];
        let arrayFiles = [];
        let directory = "";
        let type = "";
        let filename = "";
        let directories_array = [];
        const regular_expression = /.*index.*(\.html)$/;
        let index_file = "";



        const pathToFTP = PATH.dirname(remotePath) + "/";


        uploadPipe.once("error", function (err) {
          reject(err);
        });

        uploadPipe.on("entry", function (entry) {
          type = entry.type; // 'Directory' or 'File'
          filename = entry.path;
          filename.replace(" ", "\s");

          if (type == 'Directory') {
            directory = pathToFTP + filename;
            directory.replace(" ", "\s");
            directories_array.push(directory);
            arrayDirectories.push(_self._createDir(directory));
          } else {

            if (regular_expression.test(filename) &&
              (index_file.length === 0 || index_file.length > filename.length)) {
              index_file = _self._configuration.ftpConnection.equivalent_url + "/" + pathToFTP + filename;
            }


            if (directories_array.indexOf(pathToFTP + PATH.dirname(filename)) === -1) {
              arrayDirectories.push(_self._createDir(pathToFTP + PATH.dirname(filename)));
              directories_array.push(pathToFTP + PATH.dirname(filename));
            } 
            



            _self._readDataFile(entry).then((datos) => {
              arrayFiles.push({
                data: datos,
                entry: entry
              });
            });

          }

          entry.autodrain();
        });


        uploadPipe.on("close", function () {
          Promise.all(arrayDirectories).then(() => {
              setTimeout(() => {
                let arrayFilesPromises = [];
                for (let i = 0; i < arrayFiles.length; i++) {
                  arrayFilesPromises.push(_self._createFile(arrayFiles[i].data, pathToFTP + arrayFiles[i].entry.path));
                }
                Promise.all(arrayFilesPromises).then(() => {
                  uploadPipe.removeAllListeners();
                  _self._FTPDisconnect();
                  console.info("[ZIP FILE] SUBIDO CORRECTAMENTE......");
                  resolve(index_file);
                });
              }, 3000);
            })
            .catch((err) => {
              uploadPipe.removeAllListeners();
              _self._FTPDisconnect();
              reject(err);
            });
        });
      } catch (err) {
        reject(err);
      }

    });
  }

  /**
   * 
   * 
   * @param {String} filePath 
   * @returns {Promise} We returned a readableStream to pass it to the response
   * 
   * @memberof FTPModel
   */
  downloadFile(filePath) {
    const _self = this;

    const rutaFile = filePath;

    return new Promise((resolve, reject) => {

      // Once the connection is established
      // We look for the files/dirs inside the specified filepath
      _self._ftp.list(PATH.dirname(rutaFile), function (err, list) {
        // If there is an error listing on the FTP we reject the promise
        if (err) {
          _self._FTPDisconnect();
          reject(err);
        }

        // If the file does not exists in the FTP we return a message advising it
        if (_self._checkIfDirExists(PATH.basename(rutaFile), list)) {

          // If the file exists...
          _self._ftp.get(rutaFile, (err, fileStream) => {
            if (err) {
              _self._FTPDisconnect();
              reject(err);
            }


            fileStream.once("end", () => {
              _self._FTPDisconnect();
              console.log(`Fichero ${rutaFile} descargado correctamente`);
            });

            fileStream.once("error", () => {
              _self._FTPDisconnect();
              reject(`Error transmitting the file...`);
            });

            // We returned a readableStream to pass it to the response
            resolve(fileStream);

          });
        } else {
          reject(`File doesn't exist on the specified path`);
        }
      });


    });
  }

  /**
   * 
   * 
   * @param {File} file 
   * @param {String} FTPPath 
   * @returns {Promise}
   * 
   * @memberof FTPModel
   */
  uploadFile(file, FTPPath) {
    const _self = this;

    return new Promise(function (resolve, reject) {

      // Connect to the FTP server with the CONFIG object setted on the config.json file

      // When the connection is ready....
      // First of all we have to list the cwd to check if the user's directory exists.
      _self._ftp.list(PATH.dirname(PATH.dirname(FTPPath)), function (err, list) {
        // If there is any error firing the ls command
        if (err) {
          reject(err);
        }
        // If the user's directory exists, we only need to upload the file...
        if (_self._checkIfDirExists(PATH.parse(FTPPath).name, list)) {
          const newDirname = PATH.dirname(PATH.dirname(FTPPath)) + "/" + PATH.parse(FTPPath).name + "_backup_" + _self._appendDateToFilename();
          _self._renameFolder(PATH.parse(FTPPath).dir, newDirname).then(() => {
              _self._createDir(PATH.dirname(FTPPath)).then(() => {
                _self._createFile(file, FTPPath).then(() => {
                    resolve(true);
                  })
                  .catch((err) => {
                    console.log("Error creating file on FTP");
                    _self._FTPDisconnect();
                    reject(err);
                  });
              });
            })
            .catch((err) => {
              _self._FTPDisconnect();
              reject(err);
            });

          // If the user's directory doesn't exist we have to create it first, and upload the file later that.
        } else {
          _self._createDir(PATH.dirname(FTPPath)).then(() => {
              _self._createFile(file, FTPPath).then(() => {
                  resolve(true);
                })
                .catch((err) => {
                  console.log("Error creating file on FTP");
                  _self._FTPDisconnect();
                  reject(err);
                });
            })
            .catch((err) => {
              _self._FTPDisconnect();
              reject(err);
            });
        }

      });



    });
  }




  // END OF FTPModel Class
}



module.exports = FTPModel;
