'use strict';

const express = require('express');
const router = express.Router();

const {ts_value_history_Model} = require('../src/models/tsv_value_history');

router.get('/:id', (req, res) => {
    ts_value_history_Model
        .find({ 'ts_value_id' : req.params.id })
        .then(tsHists => {
            if (!tsHists) {
                return res.status(404).json({ message : 'Cannot find tsv histories'});
            }
            return res.status(200).json({ ts_value_histories : tsHists });
        })
        .catch(err => {
            console.error(`Error fetching tsv histories : ${err}`);
            return res.status(500).json({ message : `Internal server error, cannot fetch tsv histories : ${err}`});
        });
});

module.exports = router;