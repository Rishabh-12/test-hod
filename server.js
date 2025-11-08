import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import studentRoutes from './routes/student.routes.js';

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Connection ---
// We use 127.0.0.1 instead of 'localhost' for more reliability
const MONGO_URI = 'mongodb://127.0.0.1:27017/placementPortal';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected successfully!'))
.catch(err => console.error('MongoDB Connection Error:', err));

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (allows your frontend to talk to this backend)
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());

// --- API Routes ---
// All student-related routes will be prefixed with /api/students
app.use('/api/students', studentRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
});