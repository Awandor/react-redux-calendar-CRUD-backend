const EventModel = require( '../models/eventModel' );



// ========================================
// Get events
// ========================================

const getEvents = async( req, resp ) => {

  // console.log( 'Respuesta sólo en consola del servidor' );

  // console.log( req.body );

  try {

    // Con find podemos pasarle opciones para afinar la búsqueda y limitar los resultados para paginación

    const events = await EventModel.find().populate( 'user', 'name' );

    // Con populate podemos obtener las referencias que puedan haber, nosotros tenemos 'user' y sólo nos interesa la propiedad 'name'
    // el id se envía siempre por defecto

    console.log( 'EventModel', events );

    resp.status( 200 ).json( {
      ok: true,
      msg: 'getEvents',
      events
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
// Create event
// ========================================

const createEvent = async( req, resp ) => {

  // console.log( 'Respuesta sólo en consola del servidor' );

  // console.log( req.body );

  const event = new EventModel( req.body );

  try {

    // const evento = await EventModel.create( ...req.body ); // Otra manera de hacerlo con save

    event.user = req.uid;

    const eventSaved = await event.save();

    // console.log( evento );

    resp.status( 201 ).json( {
      ok: true,
      event: eventSaved
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
// Update event
// ========================================

const updateEvent = async( req, resp ) => {

  // console.log( 'Respuesta sólo en consola del servidor' );

  // console.log( req );

  const eventId = req.params.id;

  const uid = req.uid; // En req viene el uid

  try {

    // Primero verificamos que el evento existe por su id

    const eventFound = await EventModel.findById( eventId );

    if ( !eventFound ) {

      return resp.status( 404 ).json( {
        ok: false,
        msg: 'No existe un evento con este id'
      } );

    }

    // Verificamos que el usuario que está tratando de actualizar es el mismo que lo creó

    if ( eventFound.user.toString() !== uid ) {

      return resp.status( 401 ).json( {
        ok: false,
        msg: 'No está autorizado para actualizar este evento'
      } );

    }

    // Ha pasado las verificaciones, vamos a actualizar

    const newEvent = {
      ...req.body,
      user: uid
    }

    const eventUpdated = await EventModel.findByIdAndUpdate( eventId, newEvent, { new: true } );

    // {new: true} es una opción que retorna el documento actualizado de lo contrario por defecto envía el antiguo para comparar

    resp.status( 200 ).json( {
      ok: true,
      event: eventUpdated
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
// Delete event
// ========================================

const deleteEvent = async( req, resp ) => {

  // console.log( 'Respuesta sólo en consola del servidor' );

  // console.log( req.body );

  const eventId = req.params.id;

  const uid = req.uid; // En req viene el uid

  try {

    // Primero verificamos que el evento existe por su id

    const eventFound = await EventModel.findById( eventId );

    if ( !eventFound ) {

      return resp.status( 404 ).json( {
        ok: false,
        msg: 'No existe un evento con este id'
      } );

    }

    // Verificamos que el usuario que está tratando de actualizar es el mismo que lo creó

    if ( eventFound.user.toString() !== uid ) {

      return resp.status( 401 ).json( {
        ok: false,
        msg: 'No está autorizado para borrar este evento'
      } );

    }

    // Ha pasado las verificaciones, vamos a borrar

    console.log( 'eventId', eventId );

    // const eventDeleted = await EventModel.deleteOne( { _id: eventId } ); // otra forma

    const eventDeleted = await EventModel.findByIdAndDelete( eventId );

    // console.log( evento );

    resp.status( 200 ).json( {
      ok: true,
      event: eventDeleted
    } );

  } catch ( error ) {

    console.log( error ); // Solo en consola de servidor

    resp.status( 500 ).json( {
      ok: false,
      msg: 'Por favor, contacte con el administrador', // al usuario no queremos darle pistas sobre el error exacto
    } );

  }

};

// Exportamos como se hace en Node.js

// module.exports = {registerUser: registerUser};
module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
