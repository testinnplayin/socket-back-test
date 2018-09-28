'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
const arrOrigins = [
    "http://localhost:8080",
    "https://localhost:8080",
    "http://localhost:8081",
    "localhost:8080",
    "*"
];

// NOTE : need to see if this will actually work with websocket stuff since it's not based on http
// UPDATE : if we want to use CORS with socket.io, we'll have to use the io methods and not this module
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

app.use(cors(corsOptions));

const http = require('http').Server(app);

const mongoose = require('mongoose');

const io = require('socket.io')(http);


const morgan = require('morgan');
app.use(morgan('common'));

const dbURL = 'mongodb://127.0.0.1:27017/test';
const port = '3000';
const port2 = '3001';

const {
    createThinggy,
    deleteThinggy,
} = require('./events/thingamabob');

const dohickyRouter = require('./routes/dohicky-router');
const thingamabobRouter = require('./routes/thingamabob-router');

app.use('/dohickies', dohickyRouter);
app.use('/thingamabobs', thingamabobRouter);

mongoose
    .connect(dbURL, { useNewUrlParser : true })
    .then(() => {
        http.listen(port, () => {
            console.log(`Socket server listening on port ${port}`);
        });
        // app.listen(port2, () => {
        //     console.log('App listening on port ', port2);
        // })
    })
    .catch(err => console.error(`Error connecting to database: ${err}`));

io.on('connection', function(socket) {
    console.log('connection event hit');
    console.log('client has connected to socket', socket.id);
    console.log('sockets opened ', io.sockets.sockets);
    createThinggy(socket);
    deleteThinggy(socket);

    socket.on('disconnect', function() {
        console.log('client disconnected ', socket.id);
    });
});