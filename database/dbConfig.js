const mongoose = require( 'mongoose' );

const dbConnection = async() => {

  try {

    await mongoose.connect( process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } );

    console.log( `\x1b[34m Database \x1b[1mConnected\x1b[0m` );

  } catch ( error ) {

    console.log( error );

    throw new Error( '\x1b[31mError a la hora de inicializar conexión a la base de datos\x1b[0m' )
  }
}


// Exportamos como se hace en Node.js

// module.exports = {registerUser: registerUser};
module.exports = { dbConnection };
