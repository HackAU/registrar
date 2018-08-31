var mongoose = require('mongoose');
var validator = require('validator');

/**
 * Settings Schema!
 *
 * Fields with select: false are not public.
 * These can be retrieved in controller methods.
 *
 * @type {mongoose}
 */
var schema = new mongoose.Schema({
    status: String,
    title: String,
    description: {
        type: String,
        default: "None"
    },
    lastUpdated: {
        type: Number,
        default: Date.now(),
    },

});



module.exports = mongoose.model('Team', schema);