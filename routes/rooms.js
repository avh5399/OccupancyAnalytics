var Request = require('tedious').Request;
var express = require('express');
var router = express.Router();
var db = require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table

router.get('/rooms-list', function(req, res, next) {
  //   var sql='SELECT * FROM rooms';
  //   db.query(sql, function (err, data, fields) {
  //   if (err) throw err;
  //   res.render('rooms-list', { title: 'Rooms List', userData: data});
  // });
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
  

  // request.on("row", columns => {
  //   columns.forEach(column => {
  //     //console.log("%s\t%s", column.metadata.colName, column.value);
  //       if(column.metadata.colName == "room_id"){
  //           console.log("%s\t%s", "Room ID: ", column.value);
  //       }else{
  //           console.log("%s\t%s", "Occupancy Count: ", column.value);
  //       }
        
  //   });
  // });
  request.on('row', function(columns){
    if (err) throw err;
    columns.forEach(column =>{
      if(column.metadata.colName == "room_id"){
        var id = column.value
      }
      else{
        var occ = column.value
      }
      table +='<tr><td>'+ (i+1) +'</td><td>'+ id+'</td><td>'+ occ+'</td></tr>';
    
    });


  });
  db.execSql(request, function (err, data, fields) {
    if (err) throw err;
    var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].room_id +'</td><td>'+ res[i].occupancy +'</td></tr>';
      }
      table ='<table border="1"><tr><th>Nr.</th><th>Name</th><th>Address</th></tr>'+ table +'</table>';
  });
});
module.exports = router;



