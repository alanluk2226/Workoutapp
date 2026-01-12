import mongoose from 'mongoose';
import Coach from '../models/Coach.js';
import Course from '../models/Course.js';

const MONGODB_URI = 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_user?retryWrites=true&w=majority';

async function checkData() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const coaches = await Coach.countDocuments();
        const courses = await Course.countDocuments();
        
        console.log('📊 Data Summary:');
        console.log(`   Coaches: ${coaches}`);
        console.log(`   Courses: ${courses}`);
        
        // 顯示詳細信息
        if (coaches > 0) {
            const coachList = await Coach.find({}, 'name email specialization');
            console.log('\n👥 Coaches:');
            coachList.forEach(coach => {
                console.log(`   - ${coach.name} (${coach.email}) - ${coach.specialization.join(', ')}`);
            });
        }
        
        if (courses > 0) {
            const courseList = await Course.find({}, 'name type coach')
                .populate('coach', 'name');
            console.log('\n📚 Courses:');
            courseList.forEach(course => {
                console.log(`   - ${course.name} (${course.type}) - Coach: ${course.coach.name}`);
            });
        }
        
        await mongoose.connection.close();
        console.log('\n✅ Data check completed');
        
    } catch (error) {
        console.error('❌ Error checking data:', error);
        process.exit(1);
    }
}

checkData();
