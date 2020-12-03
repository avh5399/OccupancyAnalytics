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
      userName: "user", //FILL THIS OUT
      password: "Capstone20" //FILL THIS OUT
    },
    type: "default"
  },
  server: "room-occupancy.database.windows.net", //FILL THIS OUT
  options: {
    database: "RoomsDB", //FILL THIS OUT
    encrypt: true,
    validateBulkLoadParameters: false
  }
};

const connection = new Connection(config);
connection.connect();
// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("CONNECTED!!! Running on http://localhost:1337/ [id number]");
    //queryDatabase();
  }
});


function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT * FROM sensors`,
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

app.get('/', function(req, res) {
  res.send("URL MISSING ID - for example: http://localhost:1337/7");
});

//When the page navigates to /
app.get('/:id', function(req,resp){

    var total = 0;
    var room_id = req.params.id;
    var total_workStations = 0;
    var maxOccupancy = 0;
    var currentOccupancy = 0;
    var peakOccupancy = 0;
    var sensorAMT = 0;
    var prevOneMonthTotal = 0;
    var prevTwoMonthTotal = 0;
    var prevThreeMonthTotal = 0;
    var prevFourMonthTotal = 0;

    var sqlCommand = "SELECT * FROM occupied WHERE room_id = ";
    sqlCommand = sqlCommand.concat(room_id);

    var sqlCommandTwo = "SELECT * FROM sensors WHERE room_id = ";
    sqlCommandTwo = sqlCommandTwo.concat(room_id);
    
    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
      sqlCommand,
      (err, rowCount) => {
        if (err) {
          console.log("ERROR:::");
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );


    const SecondRequest = new Request(
      sqlCommandTwo,
      (err, rowCount) => {
        if (err) {
          console.log("ERROR:::");
          console.error(err.message);
        } else {
          console.log(`${rowCount} row(s) returned`);
        }
      }
    );

    SecondRequest.on("row", columns => {
      columns.forEach(column => {
          if(column.metadata.colName == "occupancy") {
            console.log("%s\t%s", "Sensor Occupancy: ", column.value);
            currentOccupancy = parseInt(currentOccupancy) + parseInt(column.value);
          }
      });
    })
    .on("requestCompleted", () => {
      console.log('total: ' + total);
      connection.execSql(request);
    });

    


    
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
          }else if(column.metadata.colName == "MaxOccupancy") {
            console.log("%s\t%s", "Max Occupancy: ", column.value);
            maxOccupancy = parseInt(column.value);
          }else if(column.metadata.colName == "sensorAMT") {
            console.log("%s\t%s", "Sensor AMT: ", column.value);
            sensorAMT = parseInt(column.value);
          }else if(column.metadata.colName == "totalWorkstations") {
            console.log("%s\t%s", "Total Workstations: ", column.value);
            total_workStations = parseInt(column.value);
          }else if(column.metadata.colName == "peakOccupancy") {
            console.log("%s\t%s", "Peak Occupancy: ", column.value);
            peakOccupancy = parseInt(column.value);
          }else if(column.metadata.colName == "prevOneMonthTotal"){
            console.log("%s\t%s", "prevOneMonthTotal: ", column.value);
            prevOneMonthTotal = parseInt(column.value);
          }else if(column.metadata.colName == "prevTwoMonthTotal"){
            console.log("%s\t%s", "prevTwoMonthTotal: ", column.value);
            prevTwoMonthTotal = parseInt(column.value);
          }else if(column.metadata.colName == "prevThreeMonthTotal"){
            console.log("%s\t%s", "prevThreeMonthTotal: ", column.value);
            prevThreeMonthTotal = parseInt(column.value);
          }else if(column.metadata.colName == "prevFourMonthTotal"){
            console.log("%s\t%s", "prevFourMonthTotal: ", column.value);
            prevFourMonthTotal = parseInt(column.value);
            console.log("------------------");
          }

      });
    })
    .on("requestCompleted", () => {
      console.log('total: ' + total);
      //resp.send('People in room: ' + total);
      resp.render('index', {
        tot:total,
        totalWorkStation: total_workStations,
        roomID: room_id,
        maxOcc: maxOccupancy,
        currOcc: currentOccupancy,
        peakOcc: peakOccupancy,
        prevOneMonth: prevOneMonthTotal,
        prevTwoMonth: prevTwoMonthTotal,
        prevThreeMonth: prevThreeMonthTotal,
        prevFourMonth: prevFourMonthTotal
      });
      // resp.render("index", { username: user }); 
    });


    connection.execSql(SecondRequest);
})

// default URL for website
app.use('/test', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.listen(1337);
