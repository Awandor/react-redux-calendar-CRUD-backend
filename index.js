// ========================================
// Express
// ========================================

const express = require( 'express' );
// import express from 'express' // ES6 importación de módulos no funciona en Node.js


// ========================================
// Variables de entorno
// ========================================

const env = require( 'dotenv' );

env.config();

// console.log( process.env ); // process muestra todos los procesos que están corriendo en Node.js y env muestra todas las variables de entorno


// ========================================
// Conexión a base de datos
// ========================================

const { dbConnection } = require( './database/dbConfig.js' );

dbConnection();


// ========================================
// Crear servidor express
// ========================================

const app = express();


// ========================================
// Escuchar peticiones
// ========================================

app.listen( process.env.PORT, () => {
  console.log( `\x1b[34m Servidor corriendo en puerto \x1b[1m${process.env.PORT}\x1b[0m` );
} );


// ========================================
// CORS
// ========================================

const cors = require( 'cors' );

app.use( cors() );


// ========================================
// Directorio público
// ========================================

app.use( express.static( 'public' ) );

// use es un Middleware que es una función que se ejecuta cada vez que alguien hace una petición al backend


// ========================================
// Lectura y parseo del Body
// ========================================

app.use( express.json() );


// ========================================
// Rutas
// ========================================

/* app.get( '/', ( req, resp ) => {

  console.log( 'Respuesta sólo en consola del servidor' );

  // Para respoder a la petición get necesitamos usar resp

  resp.json( {
    algo: 'hello'
  } );

} ); */

// Refactorizamos y colocamos las rutas en directorio routes

app.use( '/api/auth', require( './routes/authRoutes' ) );

app.use( '/api/events', require( './routes/eventRoutes' ) );

// '/api/auth' es el comienzo del endpoint seguido de los endpoints de las rutas de './routes/auth'
