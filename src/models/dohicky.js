'use strict';

const mongoose = require('mongoose');

const dohickySchema = mongoose.Schema({
    is_ok : {
        type : Boolean,
        default : true
    },
    thingamabob_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Thingamabob'
    },
    thingamabob_bp : mongoose.Schema.Types.Mixed
},
{ collection : 'dohickies' });

const Dohicky = mongoose.model('Dohicky', dohickySchema);

module.exports = {Dohicky};