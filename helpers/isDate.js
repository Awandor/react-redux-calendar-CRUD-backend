// ========================================
// Custom date validator
// ========================================

const moment = require( 'moment' );

const isDate = ( value ) => {

  console.log( value );

  const date = moment( value );

  if ( date.isValid() ) {

    return true;

  }

  return false
};


// Exportamos como se hace en Node.js

// module.exports = {registerUser: registerUser};
module.exports = { isDate };
