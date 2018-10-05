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

const {
    createThinggy,
    deleteThinggy,
} = require('./events/thingamabob');
const {getTsvHistories} = require('./events/tsv_value_history');

const dohickyRouter = require('./routes/dohicky-router');
const thingamabobRouter = require('./routes/thingamabob-router');
const tsvHistoryRouter = require('./routes/tsv_history-router');

app.use('/dohickies', dohickyRouter);
app.use('/thingamabobs', thingamabobRouter);
app.use('/tsvs', tsvHistoryRouter);

mongoose
    .connect(dbURL, { useNewUrlParser : true })
    .then(() => {
        http.listen(port, () => {
            console.log(`Socket server listening on port ${port}`);
        });
    })
    .catch(err => console.error(`Error connecting to database: ${err}`));

io.on('connection', function(socket) {
    console.log('client has connected to socket', socket.id);
    console.log('sockets opened ', io.sockets.sockets);
    createThinggy(socket);
    deleteThinggy(socket);

    // getTsvHistories(socket);

    socket.on('disconnect', function() {
        console.log('client disconnected ', socket.id);
    });
});