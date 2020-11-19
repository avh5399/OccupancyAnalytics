const { Connection, Request } = require("tedious");
var express = require('express');
var mysql = require('mysql');
var app = express();
var num = 0;

//Set view engine to ejs
app.set("view engine", "ejs"); 

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "user",
      password: "Capstone20"
    },
    type: "default"
  },
  server: "room-occupancy.database.windows.net",
  options: {
    database: "RoomsDB",
    encrypt: true
  }
};

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("CONNECTED!!!");
    queryDatabase();
  }
});


function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT * FROM rooms`,
    (err, rowCount) => {
      if (err) {
        console.log("ERROR:::");
        console.error(err.message);
      } else {
        console.log(`${rowCount} row(s) returned`);
      }
    }
  );

  request.on("row", columns => {
    columns.forEach(column => {
      //console.log("%s\t%s", column.metadata.colName, column.value);
        if(column.metadata.colName == "room_id"){
            console.log("%s\t%s", "Room ID: ", column.value);
        }else{
            console.log("%s\t%s", "Occupancy Count: ", column.value);
        }
        
    });
  });

  connection.execSql(request);
}


//When the page navigates to /
app.get('/test', function(req,resp){

    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
      `SELECT * FROM rooms`,
      (err, rowCount) => {
        if (err) {
          console.log("ERROR:::");
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );
    var total = 0;
    
    request
    .on("row", columns => {
      columns.forEach(column => {
        //console.log("%s\t%s", column.metadata.colName, column.value);
          if(column.metadata.colName == "room_id"){
              console.log("%s\t%s", "Room ID: ", column.value);
          }else{
              console.log("%s\t%s", "Occupancy Count: ", column.value);
              total = parseInt(total) + parseInt(column.value);
              console.log(total);
          }
          
      });
    })
    .on("doneProc", () => {
      console.log('total' + total);
      //resp.send('People in room: ' + total);
      var user ="flame";
      resp.render('index', {
        username: user,
        tot:total
      });
      // resp.render("index", { username: user }); 
    });


    connection.execSql(request);
})

// default URL for website
app.use('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.listen(1337);
