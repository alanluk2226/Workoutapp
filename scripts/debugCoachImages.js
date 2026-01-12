import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_user?retryWrites=true&w=majority';

// 教練名稱與圖片檔名映射
function getCoachImageFilename(coachName) {
    const nameMappings = {
        'Amy Yip': 'Amy.png',
        'Jade An': 'JadeAn.png', 
        'Alan Chow': 'AlanChow.png',
        'Peter Zhang': 'PeterZhang.png',
        'John Doe': 'JohnDoe.png'
    };
    
    return nameMappings[coachName] || null;
}

async function debugCoachImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Coach = (await import('../models/Coach.js')).default;
        const Course = (await import('../models/Course.js')).default;
        
        // 檢查 coaches 目錄中的圖片
        console.log('\n📁 CHECKING COACH IMAGES DIRECTORY:');
        const coachesDir = path.join(__dirname, '../public/images/coaches');
        try {
            const imageFiles = fs.readdirSync(coachesDir);
            console.log('Coach image files found:', imageFiles);
        } catch (error) {
            console.log('Error reading coaches directory:', error.message);
        }

        // 檢查教練
        console.log('\n👥 COACHES IN DATABASE:');
        const coaches = await Coach.find();
        
        coaches.forEach(coach => {
            const customImageFilename = getCoachImageFilename(coach.name);
            const customImagePath = customImageFilename ? `/images/coaches/${customImageFilename}` : null;
            const fullImagePath = customImagePath ? path.join(__dirname, '../public', customImagePath) : null;
            const hasCustomImage = fullImagePath && fs.existsSync(fullImagePath);
            
            console.log(`📸 ${coach.name}:`);
            console.log(`   Current image: "${coach.image}"`);
            console.log(`   Custom image file: ${customImageFilename}`);
            console.log(`   Custom image exists: ${hasCustomImage}`);
            console.log(`   Has custom image: ${coach.image !== '/images/default-coach.jpg'}`);
        });

        // 更新教練圖片路徑（取消註解來執行更新）
        console.log('\n🔄 UPDATING COACH IMAGE PATHS:');
        for (const coach of coaches) {
            const customImageFilename = getCoachImageFilename(coach.name);
            if (customImageFilename) {
                const newImagePath = `/images/coaches/${customImageFilename}`;
                const fullImagePath = path.join(__dirname, '../public', newImagePath);
                
                if (fs.existsSync(fullImagePath)) {
                    // 更新資料庫
                    await Coach.findByIdAndUpdate(coach._id, { 
                        image: newImagePath 
                    });
                    console.log(`✅ Updated ${coach.name} image to: ${newImagePath}`);
                } else {
                    console.log(`❌ Image not found for ${coach.name}: ${fullImagePath}`);
                }
            }
        }

        // 重新查詢更新後的教練資料
        console.log('\n👥 UPDATED COACHES IN DATABASE:');
        const updatedCoaches = await Coach.find();
        updatedCoaches.forEach(coach => {
            console.log(`📸 ${coach.name}:`);
            console.log(`   Image: "${coach.image}"`);
            console.log(`   Has custom image: ${coach.image !== '/images/default-coach.jpg'}`);
        });

        // 檢查課程和對應的教練
        console.log('\n📚 COURSES WITH COACH INFO:');
        const courses = await Course.find().populate('coach');
        courses.forEach(course => {
            console.log(`🎯 ${course.name}:`);
            console.log(`   Coach: ${course.coach.name}`);
            console.log(`   Coach Image: "${course.coach.image}"`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugCoachImages();
