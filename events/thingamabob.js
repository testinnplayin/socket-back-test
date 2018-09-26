'use strict';

const io = require('socket.io');

const {Thingamabob} = require('../src/models/thingamabob');

// horrible code that would have to be refactored

function createThinggy(socket) {
    console.log('createThinggy triggered ', socket.id);

    socket.on('CREATE_THINGGY', function(data) {
        Thingamabob
            .create(data)
            .then(thinggy => {
                console.log('Thinggy created ', thinggy);
                socket.emit('CREATION_SUCCESS', thinggy);
            })
            .catch(err => {
                console.error(`Problem creating thinggy: ${err}`);
                socket.emit('CREATION_ERROR', err);
            });
    });
}


function deleteThinggy(socket) {
    console.log('deleteThinggy triggered ', socket.id);

    socket.on('DELETE_THINGGY', function(data) {
        Thingamabob
            .findByIdAndRemove(data._id)
            .exec()
            .then((r) => {
                if (r.n === 0) {
                    console.error(`Cannot find thinggy of id ${data._id} for deletion`);
                    let err = new Error(`Cannot find thinggy of id ${data._id} for deletion`);
                    socket.emit('DELETE_ERROR', err);
                }
                socket.emit('DELETE_SUCCESS');
            })
            .catch(err => {
                console.error(`Cannot delete thinggy of id ${data._id}: ${err}`);
                socket.emit('DELETE_ERROR', err);
            })
    });
}

// function getThinggies(socket) {
//     console.log('getThinggies triggered ', socket.id);

//     socket.on('GET_THINGGIES', function(data) {
//         Thingamabob
//             .find()
//             .exec()
//             .then(thinggies => {
//                 if (!thinggies) {
//                     console.error(`Cannot find thinggies`);
//                     let err = new Error(`Cannot find thinggies`);
//                     socket.emit('GET_ALL_ERROR', err);
//                 }
//                 console.log('Fetching thinggies');
//                 socket.emit('GET_ALL_SUCCESS', thinggies);
//             })
//             .catch(err => {
//                 console.error(`Cannot fetch thinggies: ${err}`);
//                 socket.emit('GET_ALL_ERROR', err);
//             });
//     });
// }

function getThinggy(socket) {
    console.log('getThinggy triggered ', socket.id);

    socket.on('GET_THINGGY', function(data) {
        Thingamabob
            .findById(data._id)
            .exec()
            .then(thinggy => {
                if (!thinggy) {
                    let err = new Error(`Cannot find thinggy of id ${data._id}`);
                    console.error(`Cannot find thinggy of id ${data._id}: ${err}`);
                    socket.emit('GET_THINGGY_ERROR', err);
                }
                socket.emit('GET_THINGGY_SUCCESS', thinggy);
            })
            .catch(err => {
                console.error(`Cannot fetch thinggy of id ${data._id}: ${err}`);
                socket.emit('GET_THINGGY_ERROR', err);
            });
    });
}

function updateThinggy(socket) {
    console.log('updateThinggy triggered ', socket.id);

    socket.on('UPDATE_THINGGY', function(data) {
        Thingamabob
            .findByIdAndUpdate(data._id, { $set : data }, { new : true })
            .then(thinggy => {
                console.log(`Thinggy of id ${thinggy._id} updated, new version: ${thinggy}`);
                socket.emit('UPDATE_SUCCESS', thinggy);
            })
            .catch(err => {
                console.error(`Problem updating thinggy of id ${data._id}: ${err}`);
                socket.emit('UPDATE_ERROR', err);
            })
    });
}

module.exports = {
    createThinggy,
    deleteThinggy,
    getThinggy,
    updateThinggy
};