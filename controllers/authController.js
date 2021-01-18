// const { validationResult } = require( 'express-validator' );

const UserModel = require( '../models/userModel' );

const bcrypt = require( 'bcryptjs' );

const { generateJWT } = require( '../helpers/tokenGenerator' );


// ========================================
// Register user
// ========================================

const registerUser = async( req, resp ) => {

  // console.log( 'Respuesta sólo en consola del servidor' );

  // console.log( req.body );

  const { email, password } = req.body;

  try {

    let user = await UserModel.findOne( { email: email } );

    // console.log( usuario );

    // Para respoder a la petición necesitamos usar resp SÓLO UNA VEZ o dará error, por eso usamos return

    if ( user ) {
      return resp.status( 400 ).json( {
        ok: false,
        msg: 'Ya existe un usuario con ese email'
      } )
    }

    user = new UserModel( req.body );

    console.log( 'user de registerUser', user );

    // Encriptar password

    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync( password, salt );

    await user.save();

    // Generar json web token (JWT)

    console.log( 'user de registerUser 2', user );

    const token = await generateJWT( user._id, user.name );

    resp.status( 201 ).json( {
      ok: true,
      uid: user._id,
      name: user.name,
      msg: 'Usuario registrado con éxito',
      token
    } );

  } catch ( error ) {

    console.log( error ); // Solo en consola de servidor

    resp.status( 500 ).json( {
      ok: false,
      msg: 'Por favor, contacte con el administrador', // al usuario no queremos darle pistas sobre el error exacto
    } );

  }


  // Manejo de errores - lo hemos refactorizado a validateParams.js

  /* const errors = validationResult( req );

  if ( !errors.isEmpty() ) {

    return resp.status( 400 ).json( {
      ok: false,
      errors: errors.mapped()
    } );

  } */

};


// ========================================
// Login user
// ========================================

const loginUser = async( req, resp ) => {

  const { email, password } = req.body;

  try {

    const user = await UserModel.findOne( { email: email } );

    if ( !user ) {

      return resp.status( 400 ).json( {
        ok: false,
        msg: 'El usuario o la contraseña son incorrectos'
      } );

    }

    // Comparar passwords

    const validatePassword = bcrypt.compareSync( password, user.password ); // true / false

    if ( !validatePassword ) {

      return resp.status( 400 ).json( {
        ok: false,
        msg: 'El usuario o la contraseña son incorrectos 2'
      } );

    }

    // Generar json web token (JWT)

    const token = await generateJWT( user.id, user.name );


    resp.status( 202 ).json( {
      ok: true,
      uid: user.id,
      name: user.name,
      msg: 'Usuario ingresado con éxito',
      token
    } );

  } catch ( error ) {

    console.log( error ); // Solo en consola de servidor

    resp.status( 500 ).json( {
      ok: false,
      msg: 'Por favor, contacte con el administrador', // al usuario no queremos darle pistas sobre el error exacto
    } );

  }


};


// ========================================
// Validate and Renew token
// ========================================

const renewToken = async( req, resp ) => {

  console.log( 'datos extraidos del payload del token', req.uid, req.name );

  // Generar json web token (JWT)

  const token = await generateJWT( req.uid, req.name );

  resp.json( {
    ok: true,
    uid: req.uid,
    name: req.name,
    token
  } );

};


// Exportamos como se hace en Node.js

// module.exports = {registerUser: registerUser};
module.exports = { registerUser, loginUser, renewToken };
