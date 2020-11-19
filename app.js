var express = require('express');
var app = express();

var roomsRouter = require('./routes/rooms');
app.use('/rooms', roomsRouter);

app.listen(3306);