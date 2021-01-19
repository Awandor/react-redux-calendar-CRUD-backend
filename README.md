# Calendar Backend

Los temas a tratar son:

- Node
- Express
- Mongoose
- Modelos
- Controllers
- Middlewares de Express
- JWT
- Autenticación pasiva
- Payloads
- Encriptación
- Rutas
- CORS
- Revalidar tokens
- MongoDB
- MongoAtlas
- MongoCompass

Dentro de la carpeta de proyecto iniciamos con > `npm init -y` esto genera un `package.json` que es el punto de entrada de cualquier
aplicación con node.js.

Creamos `index.js` con un Hola mundo


## Nodemon
Cada vez que hacemos un cambio en el back-end tenemos que bajar y levantar el servidor de nuevo

Para ello instalamos una librería nodemon de forma global desde una consola con permisos de Administrador

`npm install -g nodemon` si ya lo tenemos instalado no hace falta

Editamos package.json y en scripts añadimos líneas

`"dev": "nodemon index.js",` este comando es para desarrollo
`"start": "node index.js"` este comando sería `npm start` y es para correr el backend en producción, con `start` no hace falta `run`

Bajamos el servidor y lo levantamos con el nuevo script `npm run dev`

y ya lo recarga automáticamente cada vez que guardemos un cambio.

nodemon se cancela con control + c


## COLORES PARA LA CONSOLA

Reset = "\x1b[0m"

Bright = "\x1b[1m"

Dim = "\x1b[2m"

Underscore = "\x1b[4m"

Blink = "\x1b[5m"

Reverse = "\x1b[7m"

Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"

FgRed = "\x1b[31m"

FgGreen = "\x1b[32m"

FgYellow = "\x1b[33m"

FgBlue = "\x1b[34m"

FgMagenta = "\x1b[35m"

FgCyan = "\x1b[36m"

FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"

BgRed = "\x1b[41m"

BgGreen = "\x1b[42m"

BgYellow = "\x1b[43m"

BgBlue = "\x1b[44m"

BgMagenta = "\x1b[45m"

BgCyan = "\x1b[46m"

BgWhite = "\x1b[47m"

## Express

Instalamos `express.js`

Vamos a usar este servidor porque es muy fácil hacer peticiones o servicios Rest en el lado de Node

Node es sencillamente js corriendo de lado del servidor.

Todo nuestro js va a poder correr en este servidor express

`npm install express --save`

En `index.js` hacemos la configuración básica de express según la documentación, 
- Crear servidor express,
- Escuchar peticiones,
- Crear rutas


## Variables de entorno y carpeta pública

Creamos carpeta `public` a la que todo el mundo tendrá acceso de lectura y dentro `index.html`

En `index.js` usamos un middleware que apunta a la carpeta `public`

Cremos en la raíz `.env` que va a contener nuestras variables de entorno, de momento ponemos PORT=4000

Instalamos > `npm i dotenv` y lo requerimos en `index.js`

Nodemon no escucha cambios en `.env` así que bajamos y levantamos el servidor de nuevo.


## Rutas de los usuarios

Vamos a crear las rutas es decir los endpoints que los usuarios van a usar para comunicarse con el backend

Creamos `routes/authRoutes.js` y creamos 3 rutas login, register, renew

Como el código va a crecer vamos a modular la lógica en `controllers/authController.js`


## Códigos de respuesta de servidor

`https://www.restapitutorial.com/httpstatuscodes.html`


## Express validator

> `npm i express-validator` Lo importamos en `authRoutes.js` y extraemos `check` que es un middleware que
validará los campos obligatorios.

Después en `authController.js` importamos también `express-validator` y extraemos `validationResult` y lo
usamos en la lógica de las rutas.


## Custom Middlewares

El manejo de errores lo vamos a hacer con un custom middlewares `middlewares/validateParams.js` que después
implementamos en `authRoutes.js` después de cada `check`


## Base de Datos

Vamos a usar Mongo Atlas `https://www.mongodb.com/cloud/atlas` hacemos el login con Google y tenemos un cluster
máximo para la versión gratuita.

Nos conectamos al cluster usando MongoDB Compass si no lo tenemos instalado en el ordenador lo instalamos
con next, next.

Abrimos MongoDB Compass y pegamos el connection string de Mongo Atlas poniendo la contraseña en <password>

Una vez estamos conectados podemos cerrar la ventana de Mongo Atlas.


## Mongoose

Mongoose facilita la conexión de Node.js con Mongo Atlas `https://mongoosejs.com/`

> `npm install mongoose --save`

Creamos `database/dbConfig.js`

En `.env` ponemos la conexón a la base de datos

Importamos `dbConfig.js` en `index.js` y extraemos `dbConnection` e invocamos la función.


## Crear un usuario en la base de datos

Las bases de datos no relacionales como mongo Atlas no tienen tablas sino modelos donde se almacenan los datos

Creamos `models/userModel.js`, importamos `mongoose` y extraemos `Schema` y `model`

Con `Schema` definimos los campos con sus propiedades y con `model` le damos un nombre y le incorporamos el `Schema` y lo exportamos

En `authController.js` importamos `UserModel` y lo usamos para crear un nuevo usuario en la base de datos


## Validaciones del usuario

Nuestro modelo creado `UserModel` nos permite hacer búsquedas en la base de datos con `findOne`, antes de enviar los datos a
la base de datos podemos buscar y ver si existe un usuario con el mismo email.


## Encriptar la contraseña

Vamos a usar un hash de una sola vía: no se puede desencriptar > `npm i bcryptjs`

Lo importamos en `authController.js` y encriptamos la contraseña antes de enviarla a la base de datos


## Login de usuario

De manera muy similar al registro de usuario, pero comparando además las contraseñas, encriptamos la contraseña recibida y la
comparamos con la que hay en base de datos


## token

Una vez hemos validado el usuario en el backend vamos a generar un token para ese usuario.

Usaremos Json Web Token (JWT) `https://jwt.io/`

> `npm i jsonwebtoken`

Cada vez que un usuario trata de hacer una petición al backend, éste comprobará si el token es correcto.

La generación del JWT consta de 3 partes:

1. Header: tipo de token y algoritmo utilizado

2. Payload: los datos del usuario que vamos a utilizar para la generación del token, esto es reversible así que no pueden ser datos sensibles

3. Verify signature: La parte más importante, es la firma que lleva una palabra secreta para que no se pueda generar un token falso
y tiene una fecha de expiración, nosotros lo pondremos a dos horas. A las dos horas el token expirará pero lo vamos a estar renovando
periódicamente siempre y cuando el usuario esté verificado.

Vamos a generar el token tanto cuando hace el login como cuando se registra con éxito

Creamos `helpers/tokenGenerator.js` importamos JWT y lo implementamos mediante una Promesa

Ahora en `authController.js` importamos `tokenGenerator.js` y con él generamos el token


## Renovar token

Antes de renovar el token hay que validar que el token es correcto, para ello vamos a crear un nuevo middleware que se ejecutará
entre la petición y la acción de la base de datos `middlewares/validateToken`, lo importamos en `authRoutes.js` y lo implementamos
en la ruta `renew`.

`validateToken` recibe el token y de él extraemos el payload con `uid` y `name`, los añadimos al `req` que recibe `renewToken` y con
esos datos podemos generar un nuevo token que enviamos en la `resp`


## CORS

Con CORS podemos restringir las peticiones a ciertos dominios, ciertos origenes, no es infalible pero es una capa más de seguridad.
`https://www.npmjs.com/package/cors`

> `npm install cors`

En `index.js` lo importamos y lo implementamos para todas las rutas.


## CRUD de eventos

Creamos `routes/eventRoutes.js`

Vamos a validar fechas > `npm i moment`

Creamos `models/eventModel.js` construimos el modelo y añadimos como referencia el usuario

Creamos `routes/eventRoutes.js` realizamos todos los checks y validamos el token

Creamos `controllers/eventController.js` Verificamos que el usuario que está tratando de actualizar o borrar es el mismo que lo creó


## Despliegue del backend en Heroku

Creamos `.gitignore` y añadimos `node_modules`

> `git init`, `git add .`, `git commit -m "backend 1.0"`

Vamos a `https://www.heroku.com/` donde podemos desplegar hasta 5 apps de forma gratuita.

En `package.json` vemos en la parte de scripts `start`, esto es lo que va a ejecutar Heroku, debe apuntar a `node index.js`

En `index.js` debemos tener `process.env.PORT` Heroku pondrá ahí su propio puerto

En Heroku creamos una nueva app y escogemos Deployment method > Heroku Git

Si no tenemos instalado Heroku CLI lo instalamos, podemos comprobarlo con > `heroku --version`

Ahora > `heroku login`

> `heroku git:remote -a awandor-calendar` enlazamos nuestro repositorio local con Heroku

> `git push heroku master` subimos la app

En Heroku open app nos abre la aplicación, ahí tenemos la url de nuestro backend remoto

Ya podemos probar en Postman que todas las rutas funcionan con la nueva url.

Si quiséramos ver los logs en consola de nuestra app > `heroku logs -n 1000 --tail` --tail es para que esté escuchando



# GIT

En nuestra cuenta de github creamos un repositorio

Si no tenemos repositorio git local lo creamos > `git init`

Si no tenemos archivo `.gitignore` lo creamos, especialmente para evitar `node_modules`

Añadimos los cambios a GIT> `git add .`
Commit > `git commit -m "Primer commit"`

Si en este punto borro accidentalmente algo puedo recuperarlo con > `git checkout -- .`

Que nos recontruye los archivos tal y como estaban en el último commit.

Enlazamos el repositorio local con un repositorio externo en GitHub donde tenemos cuenta y hemos creado un repositorio
`git remote add origin https://github.com/Awandor/react-redux-calendar-CRUD-backend.git`

Situarnos en la rama master > `git branch -M master`

Subir todos los cambios a la rama master remota > `git push -u origin master`

Para reconstruir en local el código de GitHub nos bajamos el código y ejecutamos `npm install` que instala todas las dependencias


## Tags y Releases

Crear un tag en Github y un Release

> `git tag -a v1.0.0 -m "Versión 1 - Lista para producción"`

> `git tag` muestra los tags

> `git push --tags` > sube los tags al repositorio remoto

En github vamos a Tags > Add release notes


## Desplegar aplicación en GitHub Pages

Tenemos que hacer un pequeño cambio en las rutas de `index.html` del build, en vez de apuntar a la raíz del servidor deben de apuntar
al directorio que contiene `index.html` simplemente con `./`

Vamos github y creamos un nuevo repositorio, podemos hacer 2 cosas:
1. Crear un proyecto aparte sólo con el contenido de build y subirlo a github
2. Renombrar el directorio build a docs, así no será ignorado por `.gitignore` y GitHub Pages lo va a detectar como posible entrada a la app
y subimos toda la app a github

Ahora vamos acceder al repositorio como si fuera una página web

Vamos a Settings > GitHub Pages > Source > master branch > Save

La app es ahora accesible desde `https://awandor.github.io/...`