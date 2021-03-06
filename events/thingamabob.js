'use strict';

const io = require('socket.io');

const mongoose = require('mongoose');

const {Dohicky} = require('../src/models/dohicky');
const {Thingamabob} = require('../src/models/thingamabob');

// horrible code that would have to be refactored if this was an even remotely normal project

function createThinggy(socket) {
    console.log('createThinggy triggered ', socket.id);

    socket.on('CREATE_THINGGY', function(data) {
        Thingamabob
            .create(data)
            .then(thinggy => {
                console.log('Thinggy created ', thinggy);
                socket.emit('CREATION_SUCCESS', thinggy);
                let newDohicky = {
                    is_ok : true,
                    thingamabob_id : thinggy._id
                };
                Dohicky
                    .create(newDohicky)
                    .then(nD => {
                        socket.emit('D_CREATE_SUCCESS', nD);
                    })
                    .catch(err => {
                        console.error(`Problem creating dohicky: ${err}`);
                        socket.emit('D_CREATE_ERROR', err);
                    });
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
            .findOneAndRemove({ _id : data._id})
            .exec()
            .then((r) => {
                if (r.n === 0) {
                    console.error(`Cannot find thinggy of id ${data._id} for deletion`);
                    let err = new Error(`Cannot find thinggy of id ${data._id} for deletion`);
                    socket.emit('DELETION_ERROR', err);
                }
                console.log('successfull deletion of ', data._id);
                socket.emit('DELETION_SUCCESS', data._id);
                Dohicky
                    .findOneAndUpdate({ thingamabob_id : data._id }, { $set : { is_ok : false } }, { new : true })
                    .exec()
                    .then(doh => {
                        if (!doh) {
                            console.error(`Cannot find dohicky linked to deleted thingamabob ${data._id}`);
                            let err = new Error(`Cannot find dohicky linked to deleted thingamabob: ${data._id}`);
                            socket.emit('D_UPDATE_ERROR', err);
                        }

                        console.log('doh ', doh);
                        socket.emit('D_UPDATE_SUCCESS', doh);
                       
                    })
                    .catch(err => {
                        console.error(`Cannot fetch dohicky linked to thingamabob ${data._id}: ${err}`);
                        socket.emit('D_UPDATE_ERROR', err);
                    })
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