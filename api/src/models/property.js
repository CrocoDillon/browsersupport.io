var mongoose = require('mongoose'),
    patch = require('mongoose-json-patch');

var Schema = mongoose.Schema,
    Mixed = mongoose.Schema.Types.Mixed;;

/**
 * Property Schema.
 */

var BrowserVersionSchema = {
      'version': String,
      'in': Boolean,
      'own': Boolean
    },
    BrowserSchema = [
      // desktop
      'ie',
      'edge',
      'firefox',
      'chrome',
      'safari',
      'opera',
      // mobile
      'ie_m',
      'android',
      'android_firefox',
      'android_chrome',
      'android_uc',
      'ios_safari',
      'opera_mini',
      'opera_m'
    ].reduce(function (schema, browser) {
      schema[browser] = [BrowserVersionSchema];
      return schema;
    }, {}),
    PropertySchema = new Schema({
      'name': { type: String, unique: true, required: true },
      'superclass': String,
      'descriptor': {
        'get': Mixed,
        'set': Mixed,
        'value': Mixed,
        'writable': Boolean,
        'configurable': Boolean,
        'enumerable': Boolean
      },
      'browsers': BrowserSchema
    }, {
      versionKey: false,
      toObject: {
        retainKeyOrder: true
      }
    });

PropertySchema.plugin(patch);

mongoose.model('Property', PropertySchema, 'properties');
