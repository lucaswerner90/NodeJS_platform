/** @module authentication/index
*/

const express=require('express');

const AUTHENTICATE_CORE=require('./coreFunctions');

/**
Creation of the router
*/
const authorizationRouter = express.Router();





/**
Logging or signup operation had been sent to server
*/
authorizationRouter.post('/login', AUTHENTICATE_CORE.emailLogin);

module.exports=authorizationRouter;
