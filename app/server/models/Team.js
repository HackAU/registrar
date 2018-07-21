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


 //=========================================
 // Instance Methods
 //=========================================


 // checking if this password matches
 schema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


//=========================================
// Static Methods
//=========================================

schema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


module.exports = mongoose.model('Team', schema);