// routes.js
// Initialize express router

const express = require('express');
const router = express.Router();
// Initialize the app
let app = express();


// Ruta de inicio
router.get('/', (req, res) => {
    res
    .status(200)
    .send(
      "<head>"+
      "<link rel='icon' type='image/png' sizes='32x32' href='/public/favicon.ico'>"+
      "</head>" +
      "<body style='background: #181A20;'> " +
      "<span><h1 style='color: white;'>¡Bienvenido a Wikimedia Vid Play Keys! </h1><span>"+
      "</span> </div>"+
      "<body>"
    );
});




// Export API routes
module.exports = router;