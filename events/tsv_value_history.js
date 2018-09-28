'use strict';

const mongoose = require('mongoose');

const {ts_value_history_Model} = require('../src/models/tsv_value_history');

function getTsvHistories(socket) {
    socket.on('GET_TSV_HISTORIES', function(data) {
        console.log('GET_TSV_HISTORIES triggered ', data);
        ts_value_history_Model
            .find({ 'ts_value_id' : data })
            .exec()
            .then(tsv_histories => {
                if (!tsv_histories) {
                    let err = new Error(`Cannot find tsv histories of tsv ${data._id}`);
                    socket.emit('TSV_HISTS_ERROR', err);
                }
                socket.emit('TSV_HISTS_SUCCESS', tsv_histories);
            })
            .catch(err => {
                console.error(`Cannot fetch tsv histories linked to tsv ${data._id}: ${err}`);
                socket.emit('TSV_HISTS_ERROR', err);
            });
    }
)};

module.exports = {getTsvHistories};