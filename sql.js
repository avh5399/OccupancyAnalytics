const { Connection, Request } = require("tedious");
var express = require('express');
var mysql = require('mysql');
var app = express();
var num = 0;

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
app.get('/', function(req,resp){
    
    
    
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

app.listen(1337);