const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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

    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https')
          res.redirect(`https://${req.header('host')}${req.url}`)
        else
          next()
      })
}

const port = process.env.PORT || 5000;

app.listen(port, () => { console.log(`Server started on port ${port}`)});