'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);

const mongoose = require('mongoose');

const io = require('socket.io')(http);

const cors = require('cors');

const morgan = require('morgan');
app.use(morgan('common'));

const dbURL = 'mongodb://127.0.0.1:27017/yuno';
const port = '3000';

const arrOrigins = [
    "http://localhost:8080",
    "https://localhost:8080",
    "http://localhost:8081",
    "*"
];

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

app.use(cors(corsOptions));

io.on('connection', function(socket) {
    console.log('client has connected to socket', socket.id);
    socket.on('disconnect', function() {
        console.log('client disconnected ', socket.id);
    });
});


app.use('*', (req, res) => {
    res.status(404).json({ message : 'Path not found' });
});

mongoose
    .connect(dbURL, { useNewUrlParser : true })
    .then(() => {
        http.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    })
    .catch(err => console.error(`Error connecting to database: ${err}`));