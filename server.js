var path = require('path');
var http = require('http');
var express = require('express');
var yaml = require('js-yaml');
var fs = require('fs');
var config = require('./config');

// Create an Express web app
var app = express();


// New Code
var mongo = require('mongodb');
var monk = require('monk');
var MONGODB_CREDENTIALS = "";

if ((config.MONGODB_USERNAME != null && config.MONGODB_PASSWORD != null &&
        config.MONGODB_USERNAME != undefined && config.MONGODB_PASSWORD != undefined) &&
    config.MONGODB_USERNAME != "NA" && config.MONGODB_PASSWORD != "NA") {

    MONGODB_CREDENTIALS = config.MONGODB_USERNAME + ":" + config.MONGODB_PASSWORD + "@";
    console.log("Connecting to MongoDB with username [" + config.MONGODB_USERNAME + "]");
}


var db = monk(MONGODB_CREDENTIALS + config.MONGODB_SERVER + ':' + config.MONGODB_PORT + '/acorn');

// Converting YAML into JSON for Swagger UI loading purposes:
var inputfile = 'apis-acorn.yml',
    outputfile = 'apis-acorn.json';

swaggerFileDef = yaml.load(fs.readFileSync(inputfile, {
    encoding: 'utf-8'
}));

// Storing YAML -> JSON Format for visibility purposes:
//fs.writeFileSync(outputfile, JSON.stringify(swaggerFileDef, null, 2));


// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-App-Key, regodate, id');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Include the html assets
app.get('/acorn-apis/v1', function (req, res) {

    // Issuing dynamic updates:
    var isAPIGWSecured = false;

    /**
     * 1. Updating the Host location
     */
    if (config.API_GW_ENABLED != null &&
        config.API_GW_ENABLED != undefined &&
        config.API_GW_ENABLED == "true") {

        console.log("API_GW_ENABLED");

        swaggerFileDef.host = config.API_GW_SERVER;
        swaggerFileDef.host += config.API_GW_BASEURL == "NA" ? "" : config.API_GW_BASEURL;

        // API GAteway is enabled, thus we default to HTTPS as first option:
        isAPIGWSecured = true;

    } else {

        // Updating the Host file dynamically
        swaggerFileDef.host = "" + req.headers.host;
    }

    /**
     * 2. Updating the default Scheme to use (i.e. HTTP or HTTPS)
     */
    if (isAPIGWSecured) {

        console.log("Default HTTPS over HTTP");

        // Swap and default HTTPS as first option:
        swaggerFileDef.schemes = ['HTTPS', 'HTTP'];
    }

    // Returning swagger definition:
    res.send(swaggerFileDef);
});

app.use('/', express.static(path.join(__dirname, 'swagger-dist')));
app.use('/ws', express.static(path.join(__dirname, 'public')));
//app.use('/upload', express.static(path.join(__dirname, 'public', 'upload.html')));


// Configure routes and middleware for the application
require('./router')(app);

// Create an HTTP server to run our application
var server = http.createServer(app);

// export the HTTP server as the public module interface
module.exports = server;