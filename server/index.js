const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const serveStatic = require('serve-static');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const words = require('./routes/api/words');

app.use('/api/words', words);
app.use(serveStatic(__dirname + "/public"));
const port = process.env.PORT || 5000;
const hostname = '127.0.0.1';

app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// // Handle production
// if (process.env.NODE_ENV === 'production') {
//     // Static folder
//     app.use(express.static(__dirname + '/public/'));

//     // Handle SPA

// }



app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });