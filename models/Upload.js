import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: false,
  },
  file: {
    type: String,
    required: false,
  },
  userPosted: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default  mongoose.model('Upload', uploadSchema);
