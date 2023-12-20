/* Express App for WikiMedia Stream by API
 * @GhostKNA
 */



// app.js
const express = require('express');
const app = express();
const routes = require('./routes');

const dotenv = require("dotenv");
dotenv.config();
//Cron
const cron = require('node-cron');
const axios = require('axios');


// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de rutas
app.use('/', routes);

// Importa el archivo de ruta 
const vidplaykeyserviceRoute = require('./routes/vidplaykeyservice.cjs');


// Asigna las rutas a los archivos de ruta
app.get("/vidplaykey", vidplaykeyserviceRoute);

// Setup server port
const port = process.env.PORT;
const ip = process.env.IP;
console.log(port);


// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Servidor iniciado en el puerto: " + port);
});


//cron
// Ejecuta la tarea una vez al iniciar la aplicación
async function runTaskOnce() {
  console.log('Tarea ejecutada una vez al iniciar la aplicación');
  
  // Simula una solicitud a la ruta /vidplaykey
  try {
    // Realiza la solicitud a la ruta /vidplaykey usando axios
    // Puedes ajustar esto según tu aplicación y lógica de ruta real
    const response = await axios.get(`http://${ip}:${port}/vidplaykey`);
    console.log(response.data);
  } catch (error) {
    console.error('Error en la solicitud a /vidplaykey:', error.message);
  }
}

// Ejecuta la tarea al iniciar la aplicación
runTaskOnce();

// Programa la tarea cron para ejecutarse cada 5 minutos
// Ejecuta la tarea cron para ejecutarse cada 5 minutos con axios
//  cron.schedule('*/1 * * * *', async () => {
//    console.log('Tarea cron ejecutada cada 5 minutos');

//    try {
//      // Realiza la solicitud a la ruta /vidplaykey usando axios
//      // Puedes ajustar esto según tu aplicación y lógica de ruta real
//      const response = await axios.get(`http://${ip}:${port}/vidplaykey`);
//      console.log(response.data);
//    } catch (error) {
//      console.error('Error en la solicitud a /vidplaykey:', error.message);
//    }
//  });