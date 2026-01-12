import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    specialization: [{
        type: String,
        enum: ['yoga', 'bodyweight', 'hii', 'circuittraining', 'pilates', 'cardiokickboxing', 'zumba']
    }],
    bio: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    image: {
        type: String, 
        default: '/images/default-coach.jpg'
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time'],
        default: 'full-time'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Coach = mongoose.model('Coach', coachSchema);
export default Coach;
