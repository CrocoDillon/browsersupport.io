var mongoose = require('mongoose'),
    patch = require('mongoose-json-patch');

var Schema = mongoose.Schema,
    Mixed = mongoose.Schema.Types.Mixed;;

/**
 * Property Schema.
 */

var PropertySchema = new Schema({
  'name': { type: String, unique: true, required: true },
  'superclass': { type: String },
  'descriptor': {
    'get': { type: Mixed },
    'set': { type: Mixed },
    'value': { type: Mixed },
    'writable': { type: Boolean },
    'configurable': { type: Boolean },
    'enumerable': { type: Boolean }
  }
}, {
  versionKey: false
});

PropertySchema.plugin(patch);

mongoose.model('Property', PropertySchema, 'properties');
