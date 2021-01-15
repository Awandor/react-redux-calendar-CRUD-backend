// const express = require('express');

// const router = express.Router;

// Se puede usar desestructuración

const { Router } = require( 'express' );

const router = Router();

const { registerUser, loginUser, renewToken } = require( '../controllers/authController' );

const { check } = require( 'express-validator' );

const { validateParams } = require( '../middlewares/validateParams' );

const { validateToken } = require( '../middlewares/validateToken' )

// ========================================
// Rutas de Usuarios | host + /api/auth
// ========================================

// Register user

router.post( '/register', [
  /* middlewares */
  check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
  check( 'email', 'El email es obligatorio' ).not().isEmpty(),
  check( 'email', 'El email tiene que tener el formato correcto' ).isEmail(),
  check( 'password', 'El password debe tener al menos 6 caracteres' ).isLength( { min: 6 } ),
  validateParams
], registerUser );


// Login user

router.post( '/login', [
  check( 'email', 'El email es obligatorio' ).not().isEmpty(),
  check( 'email', 'El email tiene que tener el formato correcto' ).isEmail(),
  check( 'password', 'El password debe tener al menos 6 caracteres' ).isLength( { min: 6 } ),
  validateParams
], loginUser );


// Renew token

router.get( '/renew', [ validateToken ], renewToken );

// Exportamos como se hace en Node.js

module.exports = router;
