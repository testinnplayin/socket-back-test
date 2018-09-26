'use strict';

const io = require('socket.io');

const Thingamabob = require('../src/models/thingamabob');

function createThinggy(socket) {
    console.log('createThinggy triggered ', socket.id);

    socket.on('CREATE_THINGGY', function(data) {
        Thingamabob
            .create(data)
            .exec()
            .then(thinggy => {
                console.log('Thinggy created ', thinggy);
                io.emit('CREATION_SUCCESS', thinggy);
            })
            .catch(err => {
                console.error(`Problem creating thinggy: ${err}`);
                io.emit('CREATION_ERROR', err);
            });
    });
}

module.exports = {createThinggy};