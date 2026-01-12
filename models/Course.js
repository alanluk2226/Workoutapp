// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['yoga', 'bodyweight', 'hii', 'circuittraining', 'pilates', 'cardiokickboxing', 'zumba']
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
        required: true
    },
    schedule: {
        day: {
            type: String,
            required: true,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    },
    maxParticipants: {
        type: Number,
        default: 20
    },
    currentParticipants: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'full'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
