var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var config = require("../../config");
var http = require('http');
var https = require('https');

var formidable = require('formidable');
var fs = require('fs');


//require the csvtojson converter class 
var Converter = require("csvtojson").Converter;
var util = require('util');

//CRI change:
var bodyParser = require('body-parser');

// Configure application routes
module.exports = function (app) {

    // CRI change to allow JSON parsing from requests:    
    app.use(bodyParser.json()); // Support for json encoded bodies 
    app.use(bodyParser.urlencoded({
        extended: true
    })); // Support for encoded bodies

    function log(apiMethod, apiUri, msg) {
        console.log("[" + apiMethod + "], [" + apiUri + "], [" + msg + "], [UTC:" +
            new Date().toISOString().replace(/\..+/, '') + "]");
    }

    /**
     * Adding MongoDB APIs:
     * 
     */

    /* GET Records */
    /* GET Records by Query Parameter */
    app.get('/records', function (req, res) {

        var appKey = req.get("x-api-key");
        var collectionName = req.query.collectionName;

        console.log("x-api-key used is [" + appKey + "], collectionName is [" + collectionName + "]");

        if (appKey == null || appKey == undefined || collectionName == null || collectionName == undefined) {

            log("GET", "/records", "Invalid API Key or Collection name. Verify and try again.");
            res.status(400).end("Invalid API Key or Collection Name. Verify and try again."); //Bad request...
            return;
        }


        var DB_COLLECTION_NAME = "" + appKey + "_" + collectionName;

        var filterName = req.query.filterName; //Field name to Search for Records.
        var filterValue = req.query.filterValue; //Field key-value to search for Records.

        var db = req.db;

        log("GET", "/records", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        var q = {};

        if ((filterName != null && filterName != undefined) &&
            (filterValue == null || filterValue == undefined)) {

            log("GET", "/records", "Filter by field name [ " + filterName +
                "] present but no filterValue... Verify parameters and try again.");
            res.status(400).end("Filter by field name [ " + filterName +
                "] present but no filterValue... Verify parameters and try again."); //Bad request...
            return;

        }

        // Just ensuring that optional filter criteria were used
        if (filterName != null && filterName != undefined &&
            filterValue != null && filterValue != undefined) {

            // Building query with given key-value pair:
            q = '{\"' + filterName + '\":';

            // Validating if Value is not a number to add quotes:
            if (isNaN(filterValue)) {

                q += '\"' + filterValue + '\"}';

            } else {
                q += '' + filterValue + '}';
            } +
            log("GET", "/records", "Applying Filter [" + q + "]");

            q = JSON.parse(q);
            log("GET", "/records", "Applying Filter [" + JSON.stringify(q) + "]");

        }

        collection.find(q, {}, function (e, docs) {

            log("GET", "/records", "Found: [" + JSON.stringify({
                "CollectionName": collectionName,
                "Records": [docs]
            }) + "]");


            // In order to comply with the API documentation, 
            // let's validate if an Array was return, in which
            // case we simply return it.
            // Otherwise we will create an array of 1 element
            // in the response.
            var result = {};
            if (docs != null && docs != undefined && Array.isArray(docs)) {

                result = {
                    "CollectionName": collectionName,
                    "Records": docs
                };

            } else {

                result = {
                    "CollectionName": collectionName,
                    "Records": [docs]
                };
            }

            // Returning result
            res.send(result);
        });

    });

    /* POST records */
    app.post('/records', function (req, res) {        

        var appKey = req.get("x-api-key");
        var collectionName = req.body.CollectionName;

        console.log("x-api-key used is [" + appKey + "], collectionName is [" + collectionName + "]");

        if (appKey == null || appKey == undefined || collectionName == null || collectionName == undefined) {

            log("POST", "/records", "Invalid API Key or Collection name. Verify and try again.");
            res.status(400).end("Invalid API Key or Collection Name. Verify and try again."); //Bad request...
            return;
        }

        var DB_COLLECTION_NAME = "" + appKey + "_" + collectionName;

        // Set our internal DB variable
        var db = req.db;

        // Retrieve Records to be inserted from Body:
        var records = req.body.Records;

        if (records == null || records == undefined) {
            log("POST", "/records", "No Records detected... Please verify and try again.");
            res.status(400).end("No Records detected... Please verify and try again."); //Bad request...
            return;
        }

        log("POST", "/records", "Array of records to be inserted is [" + JSON.stringify(records) + "]");

        // Set collection
        log("POST", "/records", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(records, function (err, docs) {
            if (err) {
                log("POST", "/records", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened. Please veify log files to determine cause.'
                });
            } else {

                // It all worked! Let's return successful answer.
                log("POST", "/records", "Records were added successfully...");

                // In order to comply with the API documentation, 
                // let's validate if an Array was return, in which
                // case we simply return it.
                // Otherwise we will create an array of 1 element
                // in the response.
                var result = {};
                if (docs != null && docs != undefined && Array.isArray(docs)) {

                    result = {
                        "CollectionName": collectionName,
                        "Records": docs
                    };

                } else {

                    result = {
                        "CollectionName": collectionName,
                        "Records": [docs]
                    };
                }

                // Returning result
                res.send(result);

            }
        });
    });


    /* Delete Record by Id(s) */
    app.delete('/records/:id', function (req, res) {

        var appKey = req.get("x-api-key");
        var collectionName = req.query.collectionName;
        var currId = req.params.id;

        console.log("x-api-key used is [" + appKey + "], collectionName is [" + collectionName + "], id or record to be removed [" + currId + "]");

        if (appKey == null || appKey == undefined || collectionName == null ||
            collectionName == undefined || currId == null || currId == undefined) {

            log("DELETE", "/records", "Invalid or empty API Key, Collection name or id. Verify and try again.");
            res.status(400).end("Invalid or empty API Key, Collection name or id. Verify and try again."); //Bad request...
            return;
        }

        var DB_COLLECTION_NAME = "" + appKey + "_" + collectionName;

        var db = req.db;

        log("DELETE", "/records", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");

        var collection = db.get(DB_COLLECTION_NAME);

        log("DELETE", "/records", "Record to be removed by Id [" + currId + "]");

        //Remove record by id:
        try {
            collection.remove({
                "_id": currId
            });
        } catch (err) {

            log("DELETE", "/records", "Error while trying to delete _id [" + currId + "]");
            log("DELETE", "/records", "Error is [" + err.message + "] ");

            res.status(500).end("Error while trying to delete _id [" + currId + "] - Verify log files to determine cause."); //Bad request...
            return;

        }

        // Returning result
        res.send({
            "_id": currId
        });

    });


    /* Delete Record by Id(s) */
    app.post('/records/bulk/delete', function (req, res) {

        var appKey = req.get("x-api-key");
        var collectionName = req.body.CollectionName;

        console.log("x-api-key used is [" + appKey + "], collectionName is [" + collectionName + "]");

        if (appKey == null || appKey == undefined || collectionName == null || collectionName == undefined) {

            log("DELETE", "/records", "Invalid or empty API Key, Collection name or id. Verify and try again.");
            res.status(400).end("Invalid or empty API Key, Collection name or id. Verify and try again."); //Bad request...
            return;
        }

        var DB_COLLECTION_NAME = "" + appKey + "_" + collectionName;

        var ids = req.body.ListIdRecords;


        // In order to comply with the API documentation, 
        // let's validate if an Array was return, in which
        // case we simply return it.
        // Otherwise we will create an array of 1 element
        // in the response.

        var result = {
            "CollectionName": collectionName,
            "ListIdRecords": []
        };

        if (ids == null || ids == undefined || !Array.isArray(ids)) {

            log("DELETE", "/records", "Invalid or Empty array of IDs of records to be " +
                "removed. Verify and try again.");
            res.status(400).end("Invalid or Empty array of IDs of records to be removed. " +
                "Verify and try again."); //Bad request...
            return;
        }

        var db = req.db;

        log("DELETE", "/records", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        for (var i = 0; i < ids.length; ++i) {

            var currId = ids[i]._id;


            log("DELETE", "/records", "Record to be removed by Id [" + currId + "]");

            //Remove record by id:
            try {
                collection.remove({
                    "_id": currId
                });
            } catch (err) {

                log("DELETE", "/records", "Error while trying to delete _id [" + currId + "]");
                log("DELETE", "/records", "Error is [" + err.message + "] ");

                // Force skipping push into result
                continue;
            }

            // Let's add this id to the list of successfully deleted records:

            result.ListIdRecords.push({
                "_id": currId
            });
        }

        // It all worked! Let's return successful answer.
        log("DELETE", "/records", "Records [" + JSON.stringify(result) + "] were deleted successfully...");




        // Returning result
        res.send(result);

    });



    /**
     * Receive CSV File to be converted into JSON and stored as a Collection in DB
     * 
     */
    app.post('/ws/uploadfile', function (req, res) {

        console.log("*** Reading uploaded CSV file...");
        var form = new formidable.IncomingForm();
        var tempFile;
        form.parse(req, function (err, fields, files) {

            if (err) throw err;

            tempFile = files.file.path;
            var fileName = files.file.name;

            console.log("Temp uploaded file is [" + JSON.stringify(tempFile) + "], name is [" + fileName + "]");
            // e.g. /tmp/upload_6f97da965ddff07a670e738c046704cb
            fid = tempFile.split("/")[2];
            console.log("File id is [" + fid + "]");

            // res.writeHead(200, {
            //     'content-type': 'text/plain'
            // });
            // res.write('received upload:\n\n');
            // res.end(util.inspect({
            //     fields: fields,
            //     files: files
            // }));

            var fid = {
                fid: fid
            };

            res.write(JSON.stringify(fid));
            res.end();
        });

    });

    app.get('/csv2json/:fid', function (req, res) {

        var fid = req.params.fid;

        if (fid == null || fid == undefined) {            
            res.status(400).end("File Id is empty or invalid... Nothing to do..."); //Bad request...
            return;
        }

        var tempFile = "/tmp/" + fid;

        console.log("*** Converting CSV to JSON...");
        // create a new converter object
        var converter = new Converter({});

        console.log("File to read is [" + tempFile + "]");
        converter.fromFile(tempFile).then((jsonObj) => {
            console.log(jsonObj);
            res.write(JSON.stringify(jsonObj));
            res.end();            
        });




    });


};