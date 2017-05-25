const seneca = require('seneca');

const CONFIG_MICRO = require('./config.json');

const CLIENT_TIMEOUT = 99999;

/**
 * 
 * 
 * @class ClientMicroservice
 * @desc Control the execution of every microservice in the webapp
 */
class ClientMicroservice {

  /**
   * Creates an instance of ClientMicroservice.
   * 
   */
  constructor() {
    this._login_client = seneca().client(CONFIG_MICRO.login_microservice);
    this._file_client = seneca().client(CONFIG_MICRO.filehandler_microservice);
    this._db_client = seneca().client(CONFIG_MICRO.db_microservice);
    this._email_client = seneca().client(CONFIG_MICRO.email_microservice);
  }


  /**
   * 
   * 
   * @param {Object} data 
   * @returns {Promise} Resolving if the email was sended or not
   * @desc Sends an email after an specified action
   */
  send_email(data) {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self._email_client.act({
        timeout$: CLIENT_TIMEOUT,
        role: 'email',
        cmd: 'send',
        data: data
      }, (error, result) => {
        if (error) reject(error);
        resolve(result.answer);
      });
    });
  }

  /**
   * 
   * 
   * @param {string} [query=""] Query to be sended to the DB
   * @param {any} [obj={}] Object with properties to be replaced on the selected query
   * @returns {Promise} Promise with data about the query sended or error just in case query went wrong
   * @desc Sends a query to the DB and returns the result of it or an error just in case there is one.
   */
  send_query(query = "", obj = {}) {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self._db_client.act({
        timeout$: CLIENT_TIMEOUT,
        role: 'db',
        cmd: 'send_query',
        query: query,
        obj: obj
      }, (error, result) => {
        if (result) {
          resolve(result.answer);
        } else {
          reject(error);
        }

      });
    });
  }


  /**
   * 
   * 
   * @param {Object} {body} 
   * @returns 
   * @desc Control the login of the user to the platform
   */
  login_user({body}) {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self._login_client.act({
        role: 'authentication',
        cmd: 'login',
        data: body
      }, (error, result) => {
        if (error !== null) reject(error);
        else resolve(result.answer);
        
      });
    });
  }


  /**
   * 
   * 
   * @param {String} filepath 
   * @param {Response} response 
   * @returns Returns the file selected through the FTP
   * @desc Downlaod the file directly from the FTP
   */
  download_file(filepath, response) {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self._file_client.act({
        role: 'ftp',
        cmd: 'download',
        filepath: filepath,
        response: response
      }, (error, result) => {
        if (error) reject(error);
        resolve(result.answer);
      });
    });
  }


  /**
   * 
   * 
   * @param {Form} form 
   * @returns {Promise} If the file was uploaded correctly
   * @desc Uplaods a file to the FTP
   */
  upload_file(form) {
    const _self = this;
    return new Promise((resolve, reject) => {
      _self._file_client.act({
        role: 'ftp',
        cmd: 'upload',
        data: form
      }, (error, result) => {
        if (error) reject(error);
        resolve(result.answer);
      });
    });
  }


}

module.exports = ClientMicroservice;
