const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression')
var http = require('http');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.enable('trust proxy');

const words = require('./routes/api/words');

app.use('/api/words', words);
app.use(compression());

if (process.env.NODE_ENV == 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`)
        } else {
            next();
        }
    });

    // static folder
    app.use(express.static(__dirname + '/public/'));

    // handle spa
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

app.use(express.static('public'))

const port = process.env.PORT || 5000;

http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + app.get('port'));
});