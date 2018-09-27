'use strict';

const mongoose = require('mongoose');

const dohickySchema = mongoose.Schema({
    is_ok : {
        type : Boolean,
        default : true
    },
    thingamabob_id : String
},
{ collection : 'dohickies' });

const Dohicky = mongoose.model('Dohicky', dohickySchema);

module.exports = {Dohicky};