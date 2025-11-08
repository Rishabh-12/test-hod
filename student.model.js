import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gpa: {
        type: Number,
        required: true,
        min: 0,
        max: 4.0
    },
    department: {
        type: String,
        required: true,
        default: 'Computer Science'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'placed'], // Only these values are allowed
        default: 'pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    placedAt: {
        type: String,
        default: null // e.g., "Google", "Microsoft"
    }
});

// Create the model from the schema
const Student = mongoose.model('Student', studentSchema);

export default Student;