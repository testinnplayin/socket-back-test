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
                    thingamabob_id : thinggy._id,
                    thingamabob_bp : thinggy
                };
                Dohicky
                    .create(newDohicky)
                    .then(nD => {
                        console.log('Dohicky created ', nD)
                        Dohicky
                            .find({ _id : nD._id })
                            .populate({ path : 'thingamabob_id', select : 'awesome_field' })
                            .then(dohicky => {
                                console.log(`Successful populate of new dohicky `, dohicky);
                                socket.emit('D_CREATE_SUCCESS', dohicky);
                            })
                            .catch(err => {
                                console.error(`Error trying to populate and send dohicky: ${err}`);
                                socket.emit('D_CREATE_ERROR', err);
                            })
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

module.exports = {
    createThinggy,
    deleteThinggy
};