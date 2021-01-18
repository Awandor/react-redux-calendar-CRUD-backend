// Si queremos el tipado de resp podemos hacer lo siguiente
const { response } = require( 'express' );

const { validationResult } = require( 'express-validator' );

const validateParams = ( req, resp = response, next ) => {

  const errors = validationResult( req );

  /* if ( !errors.isEmpty() ) {

    return resp.status( 400 ).json( {
      ok: false,
      errors: errors.mapped()
    } );

  } */

  if ( !errors.isEmpty() ) {

    const errorsArray = [];

    const errorsMapped = errors.mapped();

    for ( const property in errorsMapped ) {

      if ( property === 'email' || property === 'password' ) {

        errorsArray.push( errorsMapped[ property ].msg );

      }

    }

    const errorsString = errorsArray.join( ', ' );

    return resp.status( 400 ).json( {
      ok: false,
      msg: errorsString
    } );

  }

  next(); // Callback que ejecuta el siguiente check

}

// Exportamos como se hace en Node.js

module.exports = { validateParams };
