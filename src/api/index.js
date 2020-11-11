const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');
const config = require('../common/config');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }
    next();
});

app.use(router);

const listener = app.listen(config.apiPort, () => console.log(`Now listening on port ${listener.address().port}`));
