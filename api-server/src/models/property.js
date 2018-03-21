import mongoose from 'mongoose'

const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  browsers: {
    type: Object,
  },
})

// Case insensitive index for suggestions
PropertySchema.index(
  { name: 1 },
  { name: 'name_c', collation: { locale: 'en', strength: 1 } }
)

// Text index for search
PropertySchema.index({ name: 'text' }, { name: 'name_text' })

const Property = mongoose.model('Property', PropertySchema, 'properties')

export default Property
