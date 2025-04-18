import mongoose from "mongoose";


const meetingSchema = new mongoose.Schema({
  location: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true, unique: true },
  description: { type: String },    //review
  type: { type: String },
  priority: {
    type: String,
    enum: ['normal', 'high'],
    default: 'normal',
  },
  meeting_type: {
    type: String,
    enum: ['internal', 'external'],
    default: 'internal',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 360 * 60 * 60 * 24,
  }
});


const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;




