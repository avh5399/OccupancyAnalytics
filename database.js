const { Connection, Request } = require("tedious");
// var express = require('express');
const mysql = require('mysql');
// var app = express();
// var num = 0;

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
// capstoneFA20
// const config =
// {
// 	host: 'room-occupancy.database.windows.net',
//     user: 'user@room-occupancy',
// 	password: 'Capstone20',
//     database: 'RoomsDB',
//     port: 3306,
// 	ssl: true

// };

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("CONNECTED!!!");
    // queryDatabase();
  }
});

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('Database is connected successfully !');
//   });

module.exports = connection;