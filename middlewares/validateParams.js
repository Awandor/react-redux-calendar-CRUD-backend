// Si queremos el tipado de resp podemos hacer lo siguiente
const { response } = require( 'express' );

const { validationResult } = require( 'express-validator' );

const validateParams = ( req, resp = response, next ) => {

  const errors = validationResult( req );

  if ( !errors.isEmpty() ) {

    return resp.status( 400 ).json( {
      ok: false,
      errors: errors.mapped()
    } );

  }

  next(); // Callback que ejecuta la siguiente check
}



// Exportamos como se hace en Node.js

module.exports = { validateParams };
