'use strict';

const express = require('express');
const router = express.Router();

const {Dohicky} = require('../src/models/dohicky');

// get all dohickies

router.get('/', (req, res) => {
    Dohicky
        .find()
        // .populate({ path : 'thingamabob_id', select : 'awesome_field' })
        .exec()
        .then(dohickies => {
            console.log('dohickies success ', dohickies)
            if (!dohickies) {
                return res.status(404).json({ message : 'Cannot find dohickies' });
            }
            return res.status(200).json({ dohickies : dohickies });
        })
        .catch(err => res.status(500).json({ message : `Internal server error, cannot fetch dohikies: ${err}`}));
});

module.exports = router;