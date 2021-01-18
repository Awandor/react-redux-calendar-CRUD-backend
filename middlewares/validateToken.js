const { response } = require( 'express' ); // Con esto tenemos el tipado de resp

const jwt = require( 'jsonwebtoken' );

const validateToken = ( req, resp = response, next ) => {

  // Vamos a recibir el token en los headers con parámetro x-token

  const token = req.header( 'x-token' );

  console.log( token );

  if ( !token ) {

    return resp.status( 401 ).json( {
      ok: false,
      msg: 'No hay token en la petición'
    } );

  }

  try {

    const payload = jwt.verify( token, process.env.TOKEN_SECRET_KEY );

    console.log( 'validateToken', payload );

    // Añadimos uid y name a req así lo recibe authController en el req y con esos datos puede generar un nuevo token

    req.uid = payload.uid;

    req.name = payload.name;

  } catch ( error ) {

    return resp.status( 401 ).json( {
      ok: false,
      msg: 'Token incorrecto'
    } );

  }

  next();
};


// Exportamos como se hace en Node.js

module.exports = { validateToken };
