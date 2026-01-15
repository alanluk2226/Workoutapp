import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import User from './models/User.js';
import Workout from './models/Workout.js';
import Course from './models/Course.js';
import Coach from './models/Coach.js';
import Enrollment from './models/Enrollment.js';

const app = express();

app.use(express.static('public'));

// Middleware
app.use(express.json());
// 修復 CORS 配置
app.use(cors({
    origin: true, // 允許所有來源，或者指定 'http://localhost:8099'
    credentials: true // 這很重要，允許發送 cookies 和會話信息
}));
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for authentication)
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// MongoDB connection
const uri = 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_user?retryWrites=true&w=majority';
const PORT = 8099;

// Set view engine
app.set('view engine', 'ejs');

// Simple authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get("/", (req, res) => {
    res.status(200).render('index', { 
        title: "Home page",
        user: req.session.user || null 
    });
});

app.get("/create", requireAuth, (req, res) => {
    res.status(200).render('create', { 
        title: "Create page",
        user: req.session.user 
    });
});

app.get("/read", requireAuth, (req, res) => {
    res.status(200).render('read', { 
        title: "Read page",
        user: req.session.user 
    });
});

app.get("/update", requireAuth, (req, res) => {
    res.status(200).render('update', { 
        title: "Update page",
        user: req.session.user 
    });
});

app.get("/delete", requireAuth, (req, res) => {
    res.status(200).render('delete', { 
        title: "Delete page",
        user: req.session.user 
    });
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.status(200).render('login', { title: "Login page" });
});

app.get("/register", (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.status(200).render('register', { title: "Register page" });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Logout failed' 
            });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });

        // Save user to database
        await newUser.save();

        // Automatically log in user after signup
        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        };

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                joinDate: newUser.joinDate
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during signup'
        });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Create session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        
        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                joinDate: user.joinDate
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

// Get current user route
app.get('/api/current-user', (req, res) => {
    if (req.session.user) {
        res.json({
            success: true,
            user: req.session.user
        });
    } else {
        res.json({
            success: false,
            message: 'No user logged in'
        });
    }
});

// Get all users route (for testing)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Fitness Workout Tracker API is running!',
        timestamp: new Date().toISOString()
    });
});

// Create (CRUD) workout
app.post('/api/workouts', requireAuth, async (req, res) => {
    try {
        const {
            exerciseType,
            exerciseName,
            date,
            startTime,
            endTime,
            duration,
            caloriesBurned,
            intensity,
            sets,
            reps,
            weight,
            distance,
            distanceUnit,
            notes
        } = req.body;

        // 驗證必需字段
        if (!exerciseType || !exerciseName || !date || !duration || !caloriesBurned) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: exerciseType, exerciseName, date, duration, caloriesBurned"
            });
        }

        // 創建 workout 對象
        const workoutData = {
            user: req.session.user.id,
            exerciseType,
            exerciseName,
            date: new Date(date),
            startTime: startTime ? new Date(`${date}T${startTime}`) : new Date(),
            endTime: endTime ? new Date(`${date}T${endTime}`) : new Date(new Date().getTime() + duration * 60000),
            duration: parseInt(duration),
            caloriesBurned: parseInt(caloriesBurned),
            intensity: intensity || 'moderate',
            status: 'completed'
        };

        // 可選字段
        if (sets) workoutData.sets = parseInt(sets);
        if (reps) workoutData.reps = parseInt(reps);
        if (weight) workoutData.weight = parseFloat(weight);
        if (distance) workoutData.distance = parseFloat(distance);
        if (distanceUnit) workoutData.distanceUnit = distanceUnit;
        if (notes) workoutData.notes = notes;

        const workout = new Workout(workoutData);
        await workout.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Workout created successfully!',
            workout 
        });
    } catch (error) {
        console.error('Create workout error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || "server error"
        });
    }
});

// Read (CRUD) workout
app.get('/api/workouts', requireAuth, async (req, res) => {
    try {
        const workouts = await Workout.find({ 
            user: req.session.user.id 
        });
        res.json({ 
            success: true, 
            workouts 
        });
    } catch (error) {
        console.error('Read workouts error:', error);
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// Read One (CRUD) workout
app.get('/api/workouts/:id', requireAuth, async (req, res) => {
    try {
        const workout = await Workout.findOne({ 
            _id: req.params.id, 
            user: req.session.user.id 
        });
        if (!workout) return res.status(404).json({ 
            success: false, 
            error: 'Workout schedule not found' 
        });
        res.json({ 
            success: true, 
            workout 
        });
    } catch (error) {
        console.error('Read workout error:', error);
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// Update (CRUD) workout
app.put('/api/workouts/:id', requireAuth, async (req, res) => {
    try {
        console.log('Update workout request:', {
            id: req.params.id,
            userId: req.session.user.id,
            body: req.body
        });
        
        const workout = await Workout.findOneAndUpdate({ 
            _id: req.params.id, 
            user: req.session.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!workout) {
            console.log('Workout not found');
            return res.status(404).json({ 
                success: false, 
                error: 'Workout schedule not found' 
            });
        }
        
        console.log('Workout updated successfully:', workout);
        res.json({ 
            success: true, 
            workout 
        });
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || "server error"
        });
    }
});

// Delete (CRUD) workout
app.delete('/api/workouts/:id', requireAuth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.session.user.id 
        });
        if (!workout) return res.status(404).json({ 
            success: false, 
            error: 'Workout schedule not found' 
        });
        res.json({ 
            success: true, 
            message: 'Workout schedule deleted' 
        });
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// 課程相關 API 路由

// 獲取所有課程 - 添加調試信息
app.get('/api/courses', async (req, res) => {
    try {
        console.log('🔍 Debug: Fetching courses with populate...');
        
        const courses = await Course.find({ status: 'active' })
            .populate('coach', 'name email phone specialization bio experience image employmentType')
            .sort({ 'schedule.day': 1, 'schedule.startTime': 1 });
        
        // 添加調試輸出
        console.log('📋 Courses found:', courses.length);
        courses.forEach((course, index) => {
            console.log(`Course ${index + 1}: ${course.name}`);
            console.log(`  Coach:`, course.coach);
            if (course.coach && course.coach.name) {
                console.log(`  Coach name: "${course.coach.name}"`);
            } else {
                console.log(`  ❌ Coach data missing or invalid`);
            }
        });
        
        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
});

// 獲取用戶已註冊的課程
app.get('/api/my-courses', requireAuth, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ 
            user: req.session.user.id,
            status: 'active'
        }).populate({
            path: 'course',
            populate: {
                path: 'coach',
                select: 'name email phone specialization bio experience image employmentType'
            }
        });
        
        res.json({
            success: true,
            enrollments
        });
    } catch (error) {
        console.error('Get my courses error:', error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
});

// 註冊課程
app.post('/api/courses/:courseId/enroll', requireAuth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }
        
        if (course.status !== 'active') {
            return res.status(400).json({
                success: false,
                error: "Course is not available for enrollment"
            });
        }
        
        if (course.currentParticipants >= course.maxParticipants) {
            return res.status(400).json({
                success: false,
                error: "Course is full"
            });
        }
        
        // 檢查是否已經註冊
        const existingEnrollment = await Enrollment.findOne({
            user: req.session.user.id,
            course: req.params.courseId,
            status: 'active'
        });
        
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                error: "Already enrolled in this course"
            });
        }
        
        // 創建註冊記錄
        const enrollment = new Enrollment({
            user: req.session.user.id,
            course: req.params.courseId
        });
        
        await enrollment.save();
        
        // 更新課程參與人數
        course.currentParticipants += 1;
        if (course.currentParticipants >= course.maxParticipants) {
            course.status = 'full';
        }
        await course.save();
        
        res.json({
            success: true,
            message: "Successfully enrolled in the course",
            enrollment
        });
    } catch (error) {
        console.error('Enroll course error:', error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
});

// 取消課程註冊
app.post('/api/courses/:courseId/unenroll', requireAuth, async (req, res) => {
    try {
        const enrollment = await Enrollment.findOneAndUpdate(
            {
                user: req.session.user.id,
                course: req.params.courseId,
                status: 'active'
            },
            {
                status: 'cancelled'
            },
            {
                new: true
            }
        );
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: "Enrollment not found"
            });
        }
        
        // 更新課程參與人數
        const course = await Course.findById(req.params.courseId);
        if (course) {
            course.currentParticipants = Math.max(0, course.currentParticipants - 1);
            if (course.status === 'full') {
                course.status = 'active';
            }
            await course.save();
        }
        
        res.json({
            success: true,
            message: "Successfully unenrolled from the course"
        });
    } catch (error) {
        console.error('Unenroll course error:', error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
});

// 獲取教練列表
app.get('/api/coaches', async (req, res) => {
    try {
        const coaches = await Coach.find({ status: 'active' });
        res.json({
            success: true,
            coaches
        });
    } catch (error) {
        console.error('Get coaches error:', error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
});

// 獲取單個教練詳情
app.get('/api/coaches/:coachId', async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.coachId);
        if (!coach) {
            return res.status(404).json({
                success: false,
                error: "Coach not found"
            });
        }
        
        // 獲取教練的課程
        const courses = await Course.find({ 
            coach: req.params.coachId,
            status: 'active'
        });
        
        res.json({
            success: true,
            coach,
            courses
        });
    } catch (error) {
        console.error('Get coach error:', error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
});

// 課程頁面路由 - 修復後的版本
app.get("/courses", (req, res) => {
    res.status(200).render('courses', { 
        title: "Fitness Courses",
        user: req.session.user || null
    });
});

app.get("/my-courses", requireAuth, (req, res) => {
    res.status(200).render('my-courses', { 
        title: "My Courses",
        user: req.session.user
    });
});

// 教練詳情頁面 - 修復後的版本
app.get("/coach/:coachId", async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.coachId);
        if (!coach) {
            return res.status(404).render('404', { 
                title: "Coach Not Found",
                user: req.session.user || null
            });
        }
        
        const courses = await Course.find({ 
            coach: req.params.coachId,
            status: 'active'
        });
        
        res.status(200).render('coach', { 
            title: `Coach ${coach.name}`,
            user: req.session.user || null,
            coach,
            courses
        });
    } catch (error) {
        console.error('Coach page error:', error);
        res.status(500).render('error', { 
            title: "Error",
            user: req.session.user || null
        });
    }
});

// Admin routes
app.get("/admin", requireAuth, (req, res) => {
    res.status(200).render('admin', { 
        title: "Admin Dashboard",
        user: req.session.user 
    });
});

// Admin API - Get all courses
app.get('/api/admin/courses', requireAuth, async (req, res) => {
    try {
        const courses = await Course.find().populate('coach');
        res.json({ success: true, courses });
    } catch (error) {
        console.error('Admin get courses error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// Admin API - Create course
app.post('/api/admin/courses', requireAuth, async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.json({ success: true, course });
    } catch (error) {
        console.error('Admin create course error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin API - Update course
app.put('/api/admin/courses/:id', requireAuth, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.json({ success: true, course });
    } catch (error) {
        console.error('Admin update course error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin API - Delete course
app.delete('/api/admin/courses/:id', requireAuth, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.json({ success: true, message: 'Course deleted' });
    } catch (error) {
        console.error('Admin delete course error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin API - Get all coaches
app.get('/api/admin/coaches', requireAuth, async (req, res) => {
    try {
        const coaches = await Coach.find();
        res.json({ success: true, coaches });
    } catch (error) {
        console.error('Admin get coaches error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// Admin API - Create coach
app.post('/api/admin/coaches', requireAuth, async (req, res) => {
    try {
        const coach = new Coach(req.body);
        await coach.save();
        res.json({ success: true, coach });
    } catch (error) {
        console.error('Admin create coach error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin API - Update coach
app.put('/api/admin/coaches/:id', requireAuth, async (req, res) => {
    try {
        const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coach) return res.status(404).json({ success: false, error: 'Coach not found' });
        res.json({ success: true, coach });
    } catch (error) {
        console.error('Admin update coach error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin API - Delete coach
app.delete('/api/admin/coaches/:id', requireAuth, async (req, res) => {
    try {
        const coach = await Coach.findByIdAndDelete(req.params.id);
        if (!coach) return res.status(404).json({ success: false, error: 'Coach not found' });
        res.json({ success: true, message: 'Coach deleted' });
    } catch (error) {
        console.error('Admin delete coach error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin API - Get all users
app.get('/api/admin/users', requireAuth, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json({ success: true, users });
    } catch (error) {
        console.error('Admin get users error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// Admin API - Change user password
app.put('/api/admin/users/:id/password', requireAuth, async (req, res) => {
    try {
        const { newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { password: hashedPassword },
            { new: true }
        );
        
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, message: 'Password updated' });
    } catch (error) {
        console.error('Admin change password error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin API - Delete user
app.delete('/api/admin/users/:id', requireAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        
        // Also delete user's workouts and enrollments
        await Workout.deleteMany({ user: req.params.id });
        await Enrollment.deleteMany({ user: req.params.id });
        
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin API - Get enrollments count
app.get('/api/admin/enrollments', requireAuth, async (req, res) => {
    try {
        const enrollments = await Enrollment.find();
        res.json({ success: true, enrollments });
    } catch (error) {
        console.error('Admin get enrollments error:', error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB Atlas successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    await connectToDatabase();
});
