'use strict';

const express = require('express');
const app = express();

const mongoose = require('mongoose');

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

app.use('*', (req, res) => {
    res.status(404).json({ message : 'Path not found' });
});

mongoose
    .connect(dbURL, { useNewUrlParser : true })
    .then(() => {
        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    })
    .catch(err => console.error(`Error connecting to database: ${err}`));