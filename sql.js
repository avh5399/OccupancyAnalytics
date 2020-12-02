const { Connection, Request } = require("tedious");
var express = require('express');
var mysql = require('mysql');
var app = express();

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
app.get('/', function(req,resp){

    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
      `SELECT * FROM occupied`,
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
    var room_id = 0;
    var total_workStations = 0;
    var maxOccupancy = 0;
    var currentOccupancy = 0;
    var peakOccupancy = 0;
    
    request.on("row", columns => {
      columns.forEach(column => {
        //console.log("%s\t%s", column.metadata.colName, column.value);
          if(column.metadata.colName == "sensor_id"){
            console.log("%s\t%s", "Sensor ID: ", column.value);
          }else if(column.metadata.colName == "room_id") {
            console.log("%s\t%s", "Room ID: ", column.value);
            room_id = parseInt(column.value);
          }else if(column.metadata.colName == "day_occupied") {
            console.log("%s\t%s", "Day Occupied: ", column.value);
          }else if(column.metadata.colName == "TotalOccupancy") {
            console.log("%s\t%s", "Total/Max Occupancy: ", column.value);
            maxOccupancy = parseInt(column.value);
          }else if(column.metadata.colName == "currentOccupancy") {
            console.log("%s\t%s", "Current Occupancy: ", column.value);
            total = parseInt(total) + parseInt(column.value);
            currentOccupancy = parseInt(column.value);
          }else if(column.metadata.colName == "totalWorkstations") {
            console.log("%s\t%s", "Total Workstations: ", column.value);
            total_workStations = parseInt(column.value);
          }else if(column.metadata.colName == "peakOccupancy") {
            console.log("%s\t%s", "Peak Occupancy: ", column.value);
            peakOccupancy = parseInt(column.value);
            console.log("------------------");
          }
          
      });
    })
    .on("doneProc", () => {
      console.log('total: ' + total);
      //resp.send('People in room: ' + total);
      var user ="flame";
      resp.render('index', {
        username: user,
        tot:total,
        totalWorkStation: total_workStations,
        roomID: room_id,
        maxOcc: maxOccupancy,
        currOcc: currentOccupancy,
        peakOcc: peakOccupancy
      });
      // resp.render("index", { username: user }); 
    });


    connection.execSql(request);
})

// default URL for website
app.use('/test', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.listen(1337);
