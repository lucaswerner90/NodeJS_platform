/**
@module authentication/config
*/
/*
Here we export our default config for the authentication token.
Used to access to our API
*/
module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "TELEFONICAEducacionDigitalNodeServerJSYReact",
  SECURITY_ALGORITHM:'HS512'
};
