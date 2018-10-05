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

router.get('/:id', (req, res) => {
    Thingamabob
        .findById(req.params.id)
        .then(tDoc => {
            if (!tDoc) {
                return res.status(404).json({ message : `Cannot find thingamabob of id ${req.params.id}` });
            }
            return res.status(200).json({ thingamabob : tDoc });
        })
        .catch(err => {
            console.error(`Internal error at thingamambob fetch ${req.params.id}: ${err}`);
            res.status(500).json({ message : `Cannot fetch thingamabob of id ${req.params.id}: ${err}`})
        });
});

module.exports = router;