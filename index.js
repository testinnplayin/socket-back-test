'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);

const mongoose = require('mongoose');

const io = require('socket.io')(http);

const cors = require('cors');

const morgan = require('morgan');
app.use(morgan('common'));

const dbURL = 'mongodb://127.0.0.1:27017/test';
const port = '3000';

const arrOrigins = [
    "http://localhost:8080",
    "https://localhost:8080",
    "http://localhost:8081",
    "*"
];

const {
    createThinggy,
    deleteThinggy,
    getThinggies,
    getThinggy,
    updateThinggy
} = require('./events/thingamabob');

// NOTE : need to see if this will actually work with websocket stuff since it's not based on http
const corsOptions = {
    origin : arrOrigins,
    credentials : true,
    optionsSuccessStatus : 200,
    methods : [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'OPTIONS'
    ]
};

mongoose
    .connect(dbURL, { useNewUrlParser : true })
    .then(() => {
        http.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    })
    .catch(err => console.error(`Error connecting to database: ${err}`));

io.on('connection', function(socket) {
    console.log('client has connected to socket', socket.id);
    createThinggy(socket);
    
    socket.on('disconnect', function() {
        console.log('client disconnected ', socket.id);
    });
});