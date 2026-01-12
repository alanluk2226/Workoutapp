import mongoose from 'mongoose';
import Coach from '../models/Coach.js';
import Course from '../models/Course.js';

const MONGODB_URI = 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_user?retryWrites=true&w=majority';

async function initData() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 強制清空現有數據
        console.log('🗑️ Clearing existing data...');
        await Coach.deleteMany({});
        await Course.deleteMany({});
        console.log('✅ Cleared all existing data');

        console.log('👥 Creating coaches...');
        
        // 創建教練 - 使用你的圖片路徑
        const coaches = await Coach.insertMany([
            {
                name: "Amy Yip",
                email: "amy.yip@fitness.com",
                phone: "123456789",
                specialization: ["yoga"],
                bio: "5 years of yoga experience, millions of yoga video teaching views on YouTube platform",
                experience: "5 years yoga teaching experience",
                employmentType: "part-time",
                image: "/images/coaches/Amy.png",
                status: "active"
            },
            {
                name: "Jade An",
                email: "jade.an@fitness.com",
                phone: "213456789",
                specialization: ["bodyweight", "hii", "circuittraining"],
                bio: "A former athlete who has won 10 gold medals in all-around sports, 18 silver medals in weightlifting, and 30 bronze medals in swimming competitions",
                experience: "8 years professional training",
                employmentType: "full-time",
                image: "/images/coaches/Jade.png",
                status: "active"
            },
            {
                name: "Alan Chow",
                email: "alan.chow@fitness.com",
                phone: "543216789",
                specialization: ["pilates", "bodyweight", "hii"],
                bio: "With extensive experience in Pilates teaching, increase muscle strength and flexibility through Pilates core training",
                experience: "6 years Pilates instruction",
                employmentType: "full-time",
                image: "/images/coaches/Alan.png",
                status: "active"
            },
            {
                name: "Peter Zhang",
                email: "peter.zhang@fitness.com",
                phone: "321456789",
                specialization: ["cardiokickboxing"],
                bio: "Won two championships in free fighting and won 12 consecutive victories in lightweight boxing",
                experience: "10 years martial arts training",
                employmentType: "full-time",
                image: "/images/coaches/Peter.png",
                status: "active"
            },
            {
                name: "John Doe",
                email: "john.doe@fitness.com",
                phone: "432156789",
                specialization: ["zumba"],
                bio: "Won the third place in the Brazilian Zumba competition, has many years of dance experience, and is an orthodox local dance",
                experience: "7 years dance instruction",
                employmentType: "part-time",
                image: "/images/coaches/John.png",
                status: "active"
            }
        ], { validateBeforeSave: false });

        console.log(`✅ Created ${coaches.length} coaches`);

        // 顯示教練圖片信息
        console.log('\n📸 Coach Images:');
        coaches.forEach(coach => {
            console.log(`   - ${coach.name}: ${coach.image}`);
        });

        console.log('📚 Creating courses...');
        
        // 創建課程
        const courses = await Course.insertMany([
            {
                name: "Morning Yoga Flow",
                type: "yoga",
                coach: coaches[0]._id,
                schedule: {
                    day: "monday",
                    startTime: "06:00",
                    endTime: "08:00"
                },
                maxParticipants: 15,
                currentParticipants: 0,
                description: "Start your day with a peaceful yoga session to improve flexibility and mental clarity",
                status: "active"
            },
            {
                name: "Bodyweight Bootcamp",
                type: "bodyweight",
                coach: coaches[1]._id,
                schedule: {
                    day: "monday",
                    startTime: "09:00",
                    endTime: "10:00"
                },
                maxParticipants: 20,
                currentParticipants: 0,
                description: "Full body workout using your body weight - no equipment needed!",
                status: "active"
            },
            {
                name: "HIIT Fat Burn",
                type: "hii",
                coach: coaches[1]._id,
                schedule: {
                    day: "tuesday",
                    startTime: "09:00",
                    endTime: "10:00"
                },
                maxParticipants: 18,
                currentParticipants: 0,
                description: "High intensity interval training for maximum fat burn and cardiovascular improvement",
                status: "active"
            },
            {
                name: "Circuit Training",
                type: "circuittraining",
                coach: coaches[1]._id,
                schedule: {
                    day: "wednesday",
                    startTime: "09:00",
                    endTime: "10:00"
                },
                maxParticipants: 22,
                currentParticipants: 0,
                description: "Rotate through different exercise stations for a complete full-body workout",
                status: "active"
            },
            {
                name: "Pilates Core Strength",
                type: "pilates",
                coach: coaches[2]._id,
                schedule: {
                    day: "monday",
                    startTime: "14:00",
                    endTime: "15:00"
                },
                maxParticipants: 12,
                currentParticipants: 0,
                description: "Focus on core strength, flexibility, and overall body conditioning",
                status: "active"
            },
            {
                name: "Cardio Kickboxing",
                type: "cardiokickboxing",
                coach: coaches[3]._id,
                schedule: {
                    day: "monday",
                    startTime: "19:00",
                    endTime: "21:00"
                },
                maxParticipants: 25,
                currentParticipants: 0,
                description: "Learn kickboxing techniques while burning calories and improving coordination",
                status: "active"
            },
            {
                name: "Zumba Dance Party",
                type: "zumba",
                coach: coaches[4]._id,
                schedule: {
                    day: "tuesday",
                    startTime: "11:00",
                    endTime: "12:00"
                },
                maxParticipants: 30,
                currentParticipants: 0,
                description: "Fun dance workout with Latin rhythms - great for all fitness levels!",
                status: "active"
            }
        ], { validateBeforeSave: false });

        console.log(`✅ Created ${courses.length} courses`);
        console.log('🎉 Data initialization completed successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing data:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

initData();
