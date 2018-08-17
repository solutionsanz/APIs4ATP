// Create and start server on configured port
var config = require('./config');
var server = require('./server');


if (config.MONGODB_SERVER === undefined ||
    config.MONGODB_PORT === undefined ||
    config.PORT === undefined) {
    console.log('Invalid mandatory properties. Please verify config properties file ' +
        'or environment variables and try again.');
    process.exit();
}

console.log("Configuration Parameters: ");
console.log("API_GW_ENABLED=" + config.API_GW_ENABLED); 
console.log("API_GW_SERVER=" + config.API_GW_SERVER); 
console.log("API_GW_BASEURL=" + config.API_GW_BASEURL); 
console.log("API_GW_PORT=" + config.API_GW_PORT);
console.log("API_GW_USERNAME=" + config.API_GW_USERNAME);
console.log("MONGODB_SERVER=" + config.MONGODB_SERVER);
console.log("MONGODB_PORT=" + config.MONGODB_PORT);
console.log("MONGODB_USERNAME=" + config.MONGODB_USERNAME);
console.log("PORT=" + config.PORT);

 server.listen(config.PORT, function () {

     console.log('APIs 4 Acorn Application - API server running on port ' + config.PORT + "!!!");
 });