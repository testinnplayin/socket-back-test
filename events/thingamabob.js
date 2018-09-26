'use strict';

const io = require('socket.io');

const {Thingamabob} = require('../src/models/thingamabob');

function createThinggy(socket) {
    console.log('createThinggy triggered ', socket.id);

    socket.on('CREATE_THINGGY', function(data) {
        console.log('data ', data);
        Thingamabob
            .create(data)
            // .exec()
            .then(thinggy => {
                console.log('Thinggy created ', thinggy);
                socket.emit('CREATION', thinggy);
            })
            .catch(err => {
                console.error(`Problem creating thinggy: ${err}`);
                socket.emit('CREATION', err);
            });
    });
}

module.exports = {createThinggy};