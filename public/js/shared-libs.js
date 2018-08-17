// Shared libs



/*
//Nice way to add a listner on a button, without having to chase the onclick...
							   
	$(document).ready(function() {

	  $("#button").click(function(){
		 $(".target").effect( "highlight", 
		  {color:"#669966"}, 3000 );
	  });

   });
  */

function handleUpload() {

    /************************************************/
    /************* Uploading File **************/
    console.log("Submitting form via AJAX");

    document.getElementById("uploadFileLabel").innerHTML = "Uploading...";
    var collectionName = document.getElementById("collection").value;

    console.log("Collection name is [" + collectionName + "]");

    var formData = new FormData();
    formData.append('file', $('#file')[0].files[0]);
    var fid = "";

    $.ajax({
        url: 'uploadfile',
        type: 'POST',
        data: formData,
        processData: false, // tell jQuery not to process the data
        contentType: false, // tell jQuery not to set contentType
        success: function (data) {

            console.log("Resulting data from file upload is [" + data + "]");
            fid = JSON.parse(data).fid;
            console.log("FID is [" + fid + "]");


            /**************************************************************/
            /************* Retrieving JSON Payload **************/

            var server = "http://localhost:3000/csv2json/";
            var uri = server + fid

            console.log("URI is [" + uri + "]");


            $.getJSON(uri, function (data) {

                var jsonValue = JSON.stringify(data);
                console.log("Resulting JSON data from fid is [" + jsonValue + "]");

                document.getElementById("jsonPayload").value = jsonValue;
                document.getElementById("jsonPayload").style.display = 'block';

                /**************************************************************/
                /************* Pushing JSON to Acorn service **************/

                var server = "http://localhost:3000/records";
                var uri = server

                console.log("Pushing JSON to Acorn service URI is [" + uri + "]");

                var jsonRecord = {
                    "CollectionName": collectionName,
                    "Records": data
                  };

                console.log("jsonRecord to send is [" + JSON.stringify(jsonRecord) + "]");

                // Send the request
                $.ajax({
                    type: "POST",
                    beforeSend: function (request) {
                        request.setRequestHeader("x-api-key", "demo"); // @TODO: think how to pass authentication key
                    },
                    url: uri,
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(jsonRecord),
                    success: function (msg) {
                        console.log("The result =" + JSON.stringify(msg));
                    }
                });

                // $.post(uri, data, function (response) {

                //     //var response = JSON.stringify(response);
                //     console.log("Result from POSTing JSON data into Acorn [" + response + "]");

                // }, 'json');
            });

        }
    });

    document.getElementById("uploadFileLabel").innerHTML = "";




}



function getAPISynch(repid) {

    /**
     *	This operation is Synchronous and as such, it should not be abused.
     **/

    var uri = "http://" + globalIPAddress + ":7001/SCRequestAPIProject/request/id/" + reqid; // OSB REST Adapter

    var xmlHttp = null;

    xmlHttp = initiateXMLHttpObject();
    xmlHttp.open("GET", uri, false);
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.send(null);
    //alert("response is [" + xmlHttp.responseText + "]");

    // Javascript function JSON.parse to parse JSON data
    var jsonObj = JSON.parse(xmlHttp.responseText);
    var customername = jsonObj.Requests[0].customername;

    //alert("customername is [" + customername + "]");
    return customername;
}