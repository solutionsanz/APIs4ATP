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


function getAJoke() {

    document.getElementById("newJoke").innerHTML = "Loading...";

    // var server = "https://icanhazdadjoke.com";
    var server = "https://apip.oracleau.cloud"
    var uri = "/api/jokes/jokes"

    var uri = server + uri; // Get a random joke

    console.log("Within getAJoke uri is [" + uri + "]");

    // Initiating XMLHttpRequest Object:
    var http_request = initiateXMLHttpObject();

    http_request.onreadystatechange = function () {

        if (http_request.readyState == 4) {

            console.log("http_request.responseText is [" + http_request.responseText + "]");


            // Javascript function JSON.parse to parse JSON data
            var jsonObj = JSON.parse(http_request.responseText);


            // Refreshing Disabled Property values:			
            var id = jsonObj.id;
            var joke = jsonObj.joke;

            console.log("id is [" + id + "] joke is [" + joke + "]");
            document.getElementById("newJoke").innerHTML = joke;
            document.getElementById("theOriginalJoke").innerHTML = joke;
            document.getElementById("theJokeTBSent").innerHTML = joke;
            document.getElementById("signUpForm").theOriginalJokeId.value = id;
        }
    }

    sendRequest(http_request, "GET", uri, true);
}


function translateJoke() {

    document.getElementById("theTranslatedJoke").innerHTML = "Loading...";

    // var server = "https://icanhazdadjoke.com";
    var server = "https://apip.oracleau.cloud"
    var apipUri = "/api/jokes/jokes/";

    //var server = "http://10.0.0.55:3000"
    //var apipUri = "/jokes/";

    var jokeId = document.getElementById("signUpForm").theOriginalJokeId.value;
    var lang = document.getElementById("signUpForm").language.value;

    if (jokeId == null || jokeId == undefined) {

        console.assert.log("Critical error. Joke Id is null - cannot proceed.");
        return;
    }

    if (lang == null || lang == undefined) {

        console.assert.log("Critical error. Language is null - cannot proceed.");
        return;
    }

    var uri = server + apipUri + jokeId + "/translate";
    uri += "?language=" + lang;

    console.log("Within translateJoke uri is [" + uri + "]");

    // Initiating XMLHttpRequest Object:
    var http_request = initiateXMLHttpObject();

    http_request.onreadystatechange = function () {

        if (http_request.readyState == 4) {

            console.log("http_request.responseText is [" + http_request.responseText + "]");


            // Javascript function JSON.parse to parse JSON data
            var jsonObj = JSON.parse(http_request.responseText);


            // Refreshing Disabled Property values:			
            var id = jsonObj.id;
            var joke = jsonObj.joke;

            console.log("id is [" + id + "] joke is [" + joke + "]");
            document.getElementById("theTranslatedJoke").innerHTML = joke;
            document.getElementById("theJokeTBSent").innerHTML = joke;

        }
    }

    sendRequest(http_request, "GET", uri, true);
}

function sendJoke() {

    document.getElementById("sendJokeLabel").innerHTML = "Sending...";

    // var server = "https://icanhazdadjoke.com";
    var server = "https://apip.oracleau.cloud"
    var apipUri = "/api/jokes/jokes/";

    // var server = "http://10.0.0.55:3000"
    // var apipUri = "/jokes/";

    var jokeId = document.getElementById("signUpForm").theOriginalJokeId.value;
    var lang = document.getElementById("signUpForm").language.value;
    var mobile = document.getElementById("signUpForm").mobile.value;

    console.log("Within sendJoke, jokeId is [" + jokeId + "], lang is [" + lang + "] mobnile is [" + mobile + "]");

    if (jokeId == null || jokeId == undefined) {

        console.assert.log("Critical error. Joke Id is null - cannot proceed.");
        return;
    }

    if (mobile == null || mobile == undefined) {

        console.assert.log("Critical error. Mobile is null - cannot proceed.");
        return;
    }

    var uri = server + apipUri + jokeId;
    uri += "?mobile=" + mobile;
    uri += "&method=" + "sms";

    if (lang != null && lang != undefined && lang != "") {
        uri += "&language=" + lang;
    }

    console.log("Within sendJoke uri is [" + uri + "]");

    // Initiating XMLHttpRequest Object:
    var http_request = initiateXMLHttpObject();

    http_request.onreadystatechange = function () {

        if (http_request.readyState == 4) {

            console.log("http_request.responseText is [" + http_request.responseText + "]");


            // Javascript function JSON.parse to parse JSON data
            var jsonObj = JSON.parse(http_request.responseText);


            // Refreshing Disabled Property values:			
            var id = jsonObj.id;
            var joke = jsonObj.joke;

            document.getElementById("sendJokeLabel").innerHTML = "Sent!";
            console.log("id is [" + id + "] joke is [" + joke + "]");

        }
    }

    sendRequest(http_request, "POST", uri, true);
}

function sendRequest(http_request, verb, uri, async) {

    //alert("Debugging on: Sending [" + uri + "] under verb [" + verb + "]");

    http_request.open(verb, uri, async);
    http_request.setRequestHeader("Accept", "application/json");
    http_request.send();

    //alert("Your message was sent successfully.");
}

function initiateXMLHttpObject() {

    // Initiating XMLHttpRequest Object:
    var http_request = new XMLHttpRequest();

    try {
        // Opera 8.0+, Firefox, Chrome, Safari
        http_request = new XMLHttpRequest();
    } catch (e) {
        // Internet Explorer Browsers
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                // Something went wrong
                alert("Your browser broke!");
                return false;
            }
        }
    }

    return http_request;
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