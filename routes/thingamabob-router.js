'use strict';

const express = require('express');
const router = express.Router();

const {Thingamabob} = require('../src/models/thingamabob');

router.get('/', (req, res) => {
    Thingamabob
        .find()
        .exec()
        .then(thinggies => {
            if (!thinggies) {
                console.error(`Cannot find thinggies`);
                return res.status(404).json({ message : 'Cannot find thinggies' });
            }
            return res.status(200).json({ thingamabobs : thinggies });
        })
        .catch(err => res.status(500).send({ message : `Internal server error, cannot fetch thinggies: ${err}`}));
});

module.exports = router;