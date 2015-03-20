var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
app.use(bodyParser.json());
var basicAuth = require('basic-auth-connect');
var auth = basicAuth(function(user, pass) {
    return((user ==='cs360')&&(pass === 'test'));
  });
var options = {
    host: '127.0.0.1',
    key: fs.readFileSync('ssl/server.key'),
    cert: fs.readFileSync('ssl/server.crt')
};
  http.createServer(app).listen(80);
  https.createServer(options, app).listen(443);
//  app.get('/', function (req, res) {
//    res.send("Get Index");

app.use('/', express.static('./html', {maxAge: 60*60*1000}));


app.get('/getcity', function (req, res) {
    console.log("In getcity route");

        var urlObj = url.parse(req.url, true, false);
        var myRe = new RegExp("^"+urlObj.query["q"]);
        var jsonResult = [];



        fs.readFile('cities.txt', function(err, data){
                if(err) throw err;
                cities = data.toString().split("\n");
                for(var i = 0; i < cities.length; i++){
                        var result = cities[i].search(myRe);
                        if(result != -1){
                                console.log(cities[i]);
                                jsonResult.push({city:cities[i]});
                        }
                }
                console.log((jsonResult));
                res.json(jsonResult);

        });


  });



app.get('/comment', function (req, res) {
    	console.log("In comment route");
 	var itemDone;
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost/weather", function(err, db) {
        	if(err) throw err;
                db.collection("comments", function(err, comments){
                	if(err) throw err;
                        comments.find(function(err, items){
                        	items.toArray(function(err, itemArr){
                                	if(err) console.log("error");
                                        console.log("Document Array: ");
                                        console.log(itemArr);
					res.json(itemArr);
                                       // res.writeHead(200);
                                       // res.end(JSON.stringify(itemArr));
                                        console.log("0");
                             	});
             		console.log("1");
                        });
      		console.log("2");
                });
    	console.log("3");
        });
console.log("4");
});


app.post('/comment', auth, function (req, res) {
    	console.log("In POST comment route");
    	console.log(req.user);
    	console.log("Remote User");
    	console.log(req.remoteUser);
	console.log(req.body.Name);
	console.log(req.body.Comment);
        var jsonData = "";

        req.on('data', function (chunk) {
        	jsonData += chunk;

		console.log("in req.on data");
        });

//        req.on('end', function (){
		console.log("in end function");
 //       	var reqObj = JSON.parse(req.body); //jsondata
		var reqObj = req.body; 
                console.log(reqObj);
                console.log("Name: "+reqObj.Name);
                console.log("Comment: "+reqObj.Comment);
                var MongoClient = require('mongodb').MongoClient;
                MongoClient.connect("mongodb://localhost/weather", function(err, db) {
                	if(err) throw err;
                        db.collection('comments').insert(reqObj,function(err, records) {
                        	console.log("Record added as "+records[0]._id);
                        });
                });
                                
  //      });



    res.status(200);
    res.end();
  });




