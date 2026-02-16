import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  college_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  course_of_study: {
    type: String,
    required: true,
    trim: true
  },
  whatsapp_number: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
  },
  selected_events: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one event must be selected'
    }
  },
  transaction_id: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  payment_proof_url: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Registration', registrationSchema);
