import express from 'express';
import {
    getDashboardData,
    getStudents,
    approveStudent,
    getStudentById,
    seedDatabase
} from '../controllers/student.controller.js';

const router = express.Router();

// A helper route to add sample data to your database
router.get('/seed', seedDatabase);

// GET data for the KPI cards and charts
router.get('/dashboard-data', getDashboardData);

// GET all students based on query parameters (e.g., /api/students?status=pending)
router.get('/', getStudents);

// GET a single student's details (for the "View" button)
router.get('/:studentId', getStudentById);

// PATCH (update) a student's status to 'approved'
router.patch('/:studentId/approve', approveStudent);

export default router;