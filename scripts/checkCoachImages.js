import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_user?retryWrites=true&w=majority';

async function checkCoachImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Coach = (await import('../models/Coach.js')).default;
        const coaches = await Coach.find();
        
        console.log('\n📊 Coaches in database:');
        coaches.forEach(coach => {
            console.log(`   - ${coach.name}:`);
            console.log(`     Image: ${coach.image}`);
            console.log(`     Has image: ${!!coach.image}`);
        });

        // 測試圖片URL
        console.log('\n🔗 Testing image URLs:');
        coaches.forEach(coach => {
            console.log(`   - ${coach.name}: ${coach.image}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkCoachImages();
