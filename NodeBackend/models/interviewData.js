import mongoose from 'mongoose';

const interviewEntrySchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    analysis: {
        clarity: { type: String, required: true },
        confidence: { type: String, required: true },
        relevance: { type: String, required: true }
    }
},{_id: false})
const interviewDataSchema = new mongoose.Schema({
    userId: String,
    interviewEntries:[interviewEntrySchema]

}, { timestamps: true });

const InterviewData = mongoose.model('InterviewData', interviewDataSchema);

export default InterviewData;