var config = require("../../config");
var http = require('http');
var https = require('https');
const translate = require('google-translate-api');

var gmailSender = require('gmail-sender-oauth');

// node-oradb package...
var oracledb = require('oracledb');
var dbConfig = require('../../dbconfig.js');

var connectionPool = [];
var connections = 5;

exports.getOrders = function (id, callback) {

	var query;
	if (id != null && id != undefined) {
		query = `SELECT orderId, product, organization, shipment, quantity, unitprice, contact
		FROM orders
		WHERE orderId = :id`;
	} else {
		query = `SELECT orderId, product, organization, shipment, quantity, unitprice, contact
		FROM orders`;
	}

	console.log("Inside getOrdersById, before establishing connection. Query is [" + query + "], id is [" + id + "]");

	// Get a non-pooled connection
	oracledb.getConnection({
			user: dbConfig.user,
			password: dbConfig.password,
			connectString: dbConfig.connectString
		},
		function (err, connection) {
			if (err) {
				console.error(err.message);
				return;
			}

			if (id != null && id != undefined) {

				connection.execute(
					// The statement to execute
					query,

					// The "bind value" 180 for the bind variable ":id"
					[id],

					// execute() options argument.  Since the query only returns one
					// row, we can optimize memory usage by reducing the default
					// maxRows value.  For the complete list of other options see
					// the documentation.
					{
						maxRows: 1
						//, outFormat: oracledb.OBJECT  // query result format
						//, extendedMetaData: true      // get extra metadata
						//, fetchArraySize: 100         // internal buffer allocation size for tuning
					},

					// The callback function handles the SQL execution results
					function (err, result) {
						if (err) {
							console.error(err.message);
							doRelease(connection);
							return;
						}
						console.log(result.metaData); // [ { name: 'ORDERID' }, { name: 'PRODUCT' } ]
						console.log(result.rows); // [ [ 180, 'Holy Socks' ] ]
						doRelease(connection);

						callback(result.metaData, result.rows);
					});
			} else {

				connection.execute(
					// The statement to execute
					query,

					// The "bind value" 180 for the bind variable ":id"
					[],

					// execute() options argument.  Since the query only returns one
					// row, we can optimize memory usage by reducing the default
					// maxRows value.  For the complete list of other options see
					// the documentation.
					{},

					// The callback function handles the SQL execution results
					function (err, result) {
						if (err) {
							console.error(err.message);
							doRelease(connection);
							return;
						}
						console.log(result.metaData); // [ { name: 'ORDERID' }, { name: 'PRODUCT' } ]
						console.log(result.rows); // [ [ 180, 'Holy Socks' ] ]
						doRelease(connection);

						callback(result.metaData, result.rows);
					});
			}

		});
};

exports.insertOrders = function (orders, callback) {


	var strQuery = " INTO orders_admin.Orders (Product, Organization, Shipment, Quantity, UnitPrice, Contact)";
	strQuery += " VALUES (:Product, :Organization, :Shipment, :Quantity, :UnitPrice, :Contact) ";

	var query = "INSERT ALL";

	for (var x in orders) {

		query = query + strQuery;

		query = query.replace(/:Product/g, "'" + orders[x].Product + "'");
		query = query.replace(/:Organization/g, "'" + orders[x].Organization + "'");
		query = query.replace(/:Shipment/g, "'" + orders[x].Shipment + "'");
		query = query.replace(/:Quantity/g, "'" + orders[x].Quantity + "'");
		query = query.replace(/:UnitPrice/g, "'" + orders[x].UnitPrice + "'");
		query = query.replace(/:Contact/g, "'" + orders[x].Contact + "'");
	}

	query += "SELECT * FROM DUAL";

	console.log("orders length is [" + orders.length + "]");
	console.log("concatenated query to execute is [" + query + "]");

	// Get a non-pooled connection
	oracledb.getConnection({
			user: dbConfig.user,
			password: dbConfig.password,
			connectString: dbConfig.connectString
		},

		function (err, connection) {

			if (err) {
				console.error(err.message);
				return;
			}

			// for (var x in orders) {

				connection.execute(
					query, [], // Bind values
					{
						autoCommit: true
					}, // Override the default non-autocommit behavior
					function (err, result) {
						if (err) {
							console.error("Error ocurred [" + err.message + "]");
							doRelease(connection);
							return;
						}
						console.log("Rows inserted: " + result.rowsAffected); // 1?
						doRelease(connection);
						callback();
					});
			// }
			

		});
};


// Note: connections should always be released when not needed
function doRelease(connection) {
	connection.close(
		function (err) {
			if (err) {
				console.error(err.message);
			}
		});
}



exports.getJoke = function (id, callback) {

	try {
		id = id == null || id == undefined ? "" : "j/" + id;
		console.log("Inside getJoke, id is [" + id + "]");

		var host = config.JOKES_SERVER;
		var port = config.JOKES_PORT;



		var path = "/" + id;
		var method = "GET";
		var body = {};

		body = JSON.stringify(body);

		var secured = true; // Default to secured HTTPS endpoint.

		console.log("Calling (host, port, path, method, body) [" +
			host + ", " + port + ", " + path + ", " + method +
			", " + body + "]");

		// Invoke API and execute callback:
		sendRequest(host, port, path, method, body, secured, callback);

	} catch (error) {

		console.log("An unexpected error just occured [" + error + "] - Please verify input and try again");
	}
};

exports.sendNotification = function (jk, name, mobile, method, callback) {

	try {
		console.log("Sending joke [" + jk.joke + "] to [" + mobile + "] by [" + method + "]");

		var host = config.API_GW_SERVER;
		var port = config.API_GW_PORT;

		switch (method.toUpperCase()) {
			case "SMS":
				method = "sms";
				break;
			case "VOICE":
				method = "voicecall";
				break;
			default:
				method = "sms";
		}

		var fullText = (name == null || name == "" || name == undefined) ? 'A friend ' : name + ', a friend ';
		fullText += 'thinks you will like this joke: '
		fullText += jk.joke
		fullText += ' - For more information go to http://apismadeeasy.cloud.';

		var path = "/api/notifications/" + method;
		var method = "POST";
		var body = {
			'to': mobile,
			'msg': fullText
		};

		body = JSON.stringify(body);

		var secured = true; // Default to secured HTTPS endpoint.

		console.log("Calling (host, port, path, method, body) [" +
			host + ", " + port + ", " + path + ", " + method +
			", " + body + "]");

		// Invoke API and execute callback:
		sendRequest(host, port, path, method, body, secured, callback);
	} catch (error) {

		console.log("An unexpected error just occured [" + error + "] - Please verify input and try again");
	}
};

exports.translateJoke = function (jk, lang, callback) {

	translate(jk.joke, {
		from: 'en',
		to: lang
	}).then(res => {

		var transJoke = res.text;
		console.log("Translated joke is [" + transJoke + "]");

		// Substituting original joke by the translation:
		jk.joke = transJoke;

		// Executing callback:
		callback(jk);

		// More info: https://www.npmjs.com/package/google-translate-api
		// For full list of supported languages: https://github.com/matheuss/google-translate-api/blob/master/languages.js

	}).catch(err => {
		console.error("Oopss, something went wrong while attempting to translate. Error was [" + err + "]");

		// Callback with original joke:
		callback(jk);
	});
}

exports.getBulkJokes = function (page, callback) {

	try {
		page = page == null || page == undefined ? 1 : page;
		console.log("Inside getBulkJokes, page is [" + page + "]");

		var host = config.JOKES_SERVER;
		var port = config.JOKES_PORT;

		var path = "/search?limit=30" + "&page=" + page;
		var method = "GET";
		var body = {};

		body = JSON.stringify(body);

		var secured = true; // Default to secured HTTPS endpoint.

		console.log("Calling (host, port, path, method, body) [" +
			host + ", " + port + ", " + path + ", " + method +
			", " + body + "]");

		// Invoke API and execute callback:
		sendRequest(host, port, path, method, body, secured, callback);

	} catch (error) {

		console.log("An unexpected error just occured [" + error + "] - Please verify input and try again");
	}
};

exports.sendBulkJokes = function () {

	// Invoke API:
	// Call the voicecall API:        
	var host = config.API_GW_SERVER;
	var port = config.API_GW_PORT;
	var path = config.API_GW_BASEURL + "/bulk/jokes/notification";
	var method = "POST";
	var body = "";

	// Invoke API and execute callback:
	sendBulkJokeRequest(host, port, path, method, body, true); // Secured, i.e. to be run on HTTPS
};

function sendRequest(host, port, path, method, body, secured, callback) {

	try {

		var post_req = null;

		var options = {
			host: host,
			port: port,
			path: path,
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			}
		};

		var transport = secured ? https : http;

		post_req = transport.request(options, function (res) {

			console.log("Sending [" + host + ":" + port + path + "] under method [" + method + "]");
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			var fullResponse = "";

			res.on('data', function (chunk) {
				fullResponse += chunk;
			});

			res.on('end', function () {

				console.log('Response: ', fullResponse);

				try {
					var result = JSON.parse(fullResponse);
				} catch (error) {

					console.log("An unexpected error just occured [" + error + "] - Please verify input and try again");
				}
				// Executing callback function:
				callback(result);
			});
		});

		post_req.on('error', function (e) {
			console.log('There was a problem with request: ' + e.message);
			return undefined;
		});

		post_req.write(body);
		post_req.end();

	} catch (error) {

		console.log("An unexpected error just occured [" + error + "] - Please verify input and try again");
	}

}

// TODO: Re-visit this funciton and merge with 'sendRequest'
// This is a temp function... Necessary to send POST bulk jokes.
// The generic function "sendRequest" varies in the ['Content-Length': post_data.length]
// Also the required res/on end - That caused troubles for the POST request.
function sendBulkJokeRequest(host, port, path, method, post_data, secured) {

	var post_req = null;

	var options = {
		host: host,
		port: port,
		path: path,
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
			'Content-Length': post_data.length
		}
	};

	if (secured) {

		post_req = https.request(options, function (res) {

			console.log("Sending [" + host + ":" + port + path + "] under method [" + method + "]");
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('Response: ', chunk);
			});
		});

	} else {

		post_req = http.request(options, function (res) {

			console.log("Sending [" + host + ":" + port + path + "] under method [" + method + "]");
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('Response: ', chunk);
			});
		});

	}


	post_req.on('error', function (e) {
		console.log('There was a problem with request: ' + e.message);
	});

	post_req.write(post_data);
	post_req.end();

}

exports.getNewID = function () {

	var length = 6,
		charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return "ORD_" + retVal;
}


exports.sendEmail = function (to, subject, body) {

	console.log("Uploading client secret info");

	gmailSender.setClientSecretsFile('client_secret.json');

	var params = {
		from: config.GMAIL_FROM,
		to: to,
		subject: subject,
		body: body
	};

	console.log("Uploading Access Token");

	var accessToken = require("../../client_access_token.json");

	console.log("Sending email...");

	gmailSender.send(accessToken, params, function (err, resp) {
		if (err) {
			return console.error('Something went wrong: ' + err);
		} else {
			console.log('Message sent with id: ' + resp.id);
		}

	});

}