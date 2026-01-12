import mongoose from 'mongoose';
import Coach from '../models/Coach.js';
import Course from '../models/Course.js';

const MONGODB_URI = 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_user?retryWrites=true&w=majority';

async function debugCourses() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. 檢查所有課程的原始數據（不 populate）
        console.log('\n📋 1. Raw Courses Data (without populate):');
        const rawCourses = await Course.find({});
        rawCourses.forEach(course => {
            console.log(`Course: ${course.name}`);
            console.log(`  Coach ID: ${course.coach}`);
            console.log(`  Coach ID type: ${typeof course.coach}`);
        });

        // 2. 檢查 populate 後的數據
        console.log('\n📋 2. Courses Data with populate:');
        const populatedCourses = await Course.find({})
            .populate('coach', 'name email phone specialization bio experience image employmentType');
        
        populatedCourses.forEach(course => {
            console.log(`Course: ${course.name}`);
            console.log(`  Coach:`, course.coach);
            if (course.coach) {
                console.log(`  Coach name: ${course.coach.name}`);
                console.log(`  Coach type: ${typeof course.coach}`);
            } else {
                console.log(`  ❌ Coach is null or undefined`);
            }
        });

        // 3. 檢查所有教練
        console.log('\n📋 3. All Coaches in Database:');
        const allCoaches = await Coach.find({});
        allCoaches.forEach(coach => {
            console.log(`Coach: ${coach.name} (ID: ${coach._id})`);
        });

        // 4. 檢查引用關係
        console.log('\n📋 4. Checking references:');
        for (const course of rawCourses) {
            const coach = await Coach.findById(course.coach);
            if (!coach) {
                console.log(`❌ Course "${course.name}" has invalid coach reference: ${course.coach}`);
            } else {
                console.log(`✅ Course "${course.name}" -> Coach "${coach.name}"`);
            }
        }

        await mongoose.connection.close();
        console.log('\n🎉 Debug completed');
        
    } catch (error) {
        console.error('❌ Debug error:', error);
    }
}

debugCourses();
