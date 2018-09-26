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
                return res.send(404).json({ message : 'Cannot find thinggies' });
            }
            console.log('Fetching thinggies');
            return res.send(200).json({ thingamabobs : thinggies });
        })
        .catch(err => res.status(500).send({ message : `Internal server error, cannot fetch thinggies: ${err}`}));
});

module.exports = router;