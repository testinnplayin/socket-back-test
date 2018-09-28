const mongoose = require('mongoose');

const schema = mongoose.Schema(
{
        // ts_value_id : String,
        ts_value_id: {type: mongoose.Schema.Types.ObjectId, default: null},
        value: {type: mongoose.Schema.Types.Mixed, default: null},
        expiration_time: {type: mongoose.Schema.Types.Mixed, default: null},
        collection_time: {type: mongoose.Schema.Types.Mixed, default: null},
        unit: {type: mongoose.Schema.Types.String, default: ''},
        datapoint_id: {type: mongoose.Schema.Types.ObjectId, default: null}
},
{
    collection: 'timestamped_values_history',
    minimize: false,
    timestamps : true
});

schema.methods.apiRepr = function () {
    return {
        //_id : this._id,
        //ts_value_id : this.ts_value_id,
        //datapoint_id : this.datapoint_id,
        unit : this.unit,
        collection_time : this.collection_time,
        value : this.value
    };
};

const ts_value_history_Model = mongoose.model('ts_value_history_Model', schema);


module.exports = {ts_value_history_Model};
