const path = require('path');
const express = require('express');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({
    logger
});
const bodyParser = require('body-parser');
const registerRouteGetMapMarkers = require('./route-get-map-markers');

const app = express();

app.use(expressPino);

app.use(express.static(path.join(__dirname, '../frontend')));

app.use(bodyParser.json());

registerRouteGetMapMarkers(app);

app.get('/healthcheck', (_, res) => res.send('ok'));

app.listen(3000);