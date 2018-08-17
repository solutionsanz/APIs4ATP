// By default these properties assume an isolated stand alone deployment.
// Only MONGODB_SERVER, MONGODB_PORT and application PORT are required.
// If this applications requires API GW or remote/secured MongoDB access,
// setup the additional properties as system variables in your OS.
// For security purposes, make sure the system variables are not checked-in
// into version control repository.

module.exports = {
    "API_GW_ENABLED": process.env.API_GW_ENABLED || "false",
    "API_GW_SERVER": process.env.API_GW_SERVER || "NA",
    "API_GW_BASEURL": process.env.API_GW_BASEURL || "NA",
    "API_GW_PORT": process.env.API_GW_PORT || "NA",
    "API_GW_USERNAME": process.env.API_GW_USERNAME || "NA",
    "API_GW_PASSWORD": process.env.API_GW_PASSWORD || "NA",
    "MONGODB_SERVER": process.env.MONGODB_SERVER || "localhost",    
    "MONGODB_PORT": process.env.MONGODB_PORT || "27017",
    "MONGODB_USERNAME": process.env.MONGODB_USERNAME || "NA",
    "MONGODB_PASSWORD": process.env.MONGODB_PASSWORD || "NA",

    "PORT": process.env.PORT || "3000"
};