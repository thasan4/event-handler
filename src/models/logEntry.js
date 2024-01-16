import mongoose from 'mongoose';

const logEntrySchema = new mongoose.Schema({
  request: Object,
  response: Object,
  timestamp: Date
});

export default mongoose.model('LogEntry', logEntrySchema);