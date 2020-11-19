// mysql.server start &  mysql.server stop
var express = require('express');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
   //properties...
    host: 'localhost',
    user:'root',
    password:'password', //Yes, I did in fact make a password called "password"
    database:'testDB',
        
});

connection.connect(function(error){
    if(!!error){
        console.log("ERROR");
    }else{
        console.log("CONNECTED!!!");
    }
})

//When the page navigates to /
app.get('/', function(req,resp){
    //about mysql
    //if you want to query something from the DB
    connection.query("SELECT * FROM Test", function(error, rows, fields){
        //callback function
        if(!!error){
            console.log("ERROR IN QUERY");
        }else{
            console.log("SUCCESS QUERY");
            // console.log(rows); for all
            console.log(rows[0].idTest);
            resp.send('People in room: ' + rows[0].idTest)
        }
        
    });
})

//When the page navigates to /
app.get('/lab', function(req,resp){
    //about mysql
    //if you want to query something from the DB
    connection.query("SELECT * FROM Test", function(error, rows, fields){
        //callback function
        if(!!error){
            console.log("ERROR IN QUERY");
        }else{
            console.log("SUCCESS QUERY");
            // console.log(rows); for all
            console.log(rows[0].idTest);
            resp.send('People in Lab: ' + rows[3].idTest)
        }
        
    });
})

app.listen(1337);
