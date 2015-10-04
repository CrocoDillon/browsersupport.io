var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Property Schema.
 */

var PropertySchema = new Schema({
  'name': { type: String, unique: true, required: true }
}, {
  versionKey: false
});

mongoose.model('Property', PropertySchema, 'properties');
