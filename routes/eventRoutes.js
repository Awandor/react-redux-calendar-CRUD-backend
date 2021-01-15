const { Router } = require( 'express' );

const router = Router();

const { getEvents, createEvent, updateEvent, deleteEvent } = require( '../controllers/eventController' );

const { check } = require( 'express-validator' );

const { validateParams } = require( '../middlewares/validateParams' );

const { validateToken } = require( '../middlewares/validateToken' );

const { isDate } = require( '../helpers/isDate' );

// ========================================
// Rutas de Usuarios | host + /api/events
// ========================================

// Get events

router.get( '/', [ validateToken ], getEvents );


// Create event

router.post( '/', [
  /* middlewares */
  validateToken,
  check( 'title', 'El título es obligatorio' ).not().isEmpty(),
  check( 'start', 'La fecha de inicio es obligatorio' ).not().isEmpty(),
  check( 'start', 'La fecha de inicio no es válida' ).custom( isDate ),
  check( 'end', 'La fecha de finalalización es obligatorio' ).not().isEmpty(),
  check( 'end', 'La fecha de finalalización no es válida' ).custom( isDate ),
  validateParams,
], createEvent );


// Update event

router.put( '/:id', [
  /* middlewares */
  validateToken,
  check( 'id', 'El id es obligatorio' ).not().isEmpty(),
  check( 'title', 'El título es obligatorio' ).not().isEmpty(),
  check( 'start', 'La fecha de inicio es obligatorio' ).not().isEmpty(),
  check( 'start', 'La fecha de inicio no es válida' ).custom( isDate ),
  check( 'end', 'La fecha de finalalización es obligatorio' ).not().isEmpty(),
  check( 'end', 'La fecha de finalalización no es válida' ).custom( isDate ),
  validateParams
], updateEvent );


// Delete event

router.delete( '/:id', [
  /* middlewares */
  validateToken,
  check( 'id', 'El id es obligatorio' ).not().isEmpty(),
  validateParams
], deleteEvent );


// Exportamos como se hace en Node.js

module.exports = router;
