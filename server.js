
/********* REQUIRES ***************/
var http = require('http');
var mongo = require('mongodb');
var monk = require('monk');
//config databaseURL
var db = monk('localhost:27017/review');
var express = require('express');
var bodyParser = require('body-parser');

/***************************************/
/************** INIT *******************/
//express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//fix Access-Control-Allow-Origin bugs
allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);
/************************************************************/
/**************************** ROUTES ****************************/

//return all reviews
app.get('/review/', function(req, res) {
    var collection = db.get('review');
    collection.find({}, {order:1}, function(e,docs){
        res.json(docs);
    });
});


//return selected review
app.get('/review/:id', function(req, res) {
	var idValue = parseInt(req.params.id);
    var collection = db.get('review');
    collection.find({id: idValue}, function(e,docs){
        res.json(docs);
    });
});

//insert a review
app.post('/review/', function(req, res) {
	var collection = db.get('review');
 	collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//delete a review
app.delete('/review/:id', function(req, res){
	var idValue = parseInt(req.params.id);
	var collection = db.get('review');
 	collection.remove({id: idValue}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//update a review
app.put('/review/:id', function(req, res){
	var idValue = parseInt(req.params.id);
	var collection = db.get('review');
 	collection.update({id: idValue}, {$set:req.body}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

//update reviews order (by delete then reinsert)
app.put('/review/', function(req, res){

    var idValue = parseInt(req.params.id);
    var collection = db.get('review');

    //remove all documents
    collection.remove({},function(err,numberRemoved){

        //insert new documents
        collection.insert(req.body, function(err, result){
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
        });
    });
    
});
/******************************************************/

app.listen(8080);

