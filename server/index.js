const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
var http = require('http');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.enable('trust proxy');
app.use(function(req, res, next) {
    if (req.secure){
        return next();
    }
    res.redirect("https://" + req.headers.host + req.url);
});

const words = require('./routes/api/words');

app.use('/api/words', words);

// Handle production
if (process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express.static(__dirname + '/public/'));

    // Handle SPA
    app.get(/.*/, (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });
}


const port = process.env.PORT || 5000;
// app.use(enforce.HTTPS({ trustProtoHeader: true }))

http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + app.get('port'));
});