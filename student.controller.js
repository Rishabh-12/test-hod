import Student from '../models/student.model.js';

// --- Controller for Seeding Database (for testing) ---
export const seedDatabase = async (req, res) => {
    try {
        // Clear existing students
        await Student.deleteMany({});

        // Sample data based on your frontend
        const sampleStudents = [
            // Pending
            { name: 'Sarah Johnson', studentId: 'CS2024001', gpa: 3.8, status: 'pending', appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { name: 'Michael Chen', studentId: 'CS2024002', gpa: 3.9, status: 'pending', appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
            { name: 'Emily Rodriguez', studentId: 'CS2024003', gpa: 3.7, status: 'pending', appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
            { name: 'David Kumar', studentId: 'CS2024004', gpa: 3.6, status: 'pending', appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            { name: 'Jessica Park', studentId: 'CS2024005', gpa: 3.9, status: 'pending', appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },

            // Profiles (Approved or Placed)
            { name: 'Alex Thompson', studentId: 'CS2023089', gpa: 3.8, status: 'placed', placedAt: 'Google', appliedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
            { name: 'Priya Sharma', studentId: 'CS2023090', gpa: 3.9, status: 'placed', placedAt: 'Microsoft', appliedDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000) },
            { name: 'Ben Carter', studentId: 'CS2023091', gpa: 3.5, status: 'approved', appliedDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000) },
        ];

        await Student.insertMany(sampleStudents);
        res.status(200).json({ message: 'Database seeded successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Controller for KPI Cards ---
export const getDashboardData = async (req, res) => {
    try {
        const totalPlaced = await Student.countDocuments({ status: 'placed' });
        const pendingApprovals = await Student.countDocuments({ status: 'pending' });
        const activeStudents = await Student.countDocuments({ status: 'approved' }); // Active but not yet placed
        const totalEligible = totalPlaced + activeStudents; // A simple metric

        let placementRate = 0;
        if (totalEligible > 0) {
            placementRate = Math.round((totalPlaced / totalEligible) * 100);
        }

        res.status(200).json({
            totalPlaced: totalPlaced,
            pendingApprovals: pendingApprovals,
            activeStudents: activeStudents + totalPlaced, // Total approved students
            placementRate: `${placementRate}%`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Controller for Student Lists (with filtering) ---
export const getStudents = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        // Filter by status (can be comma-separated: ?status=approved,placed)
        if (status) {
            query.status = { $in: status.split(',') };
        }

        // Filter by search (name or studentId)
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' }; // Case-insensitive regex
            query.$or = [
                { name: searchRegex },
                { studentId: searchRegex }
            ];
        }

        // We only care about Computer Science for this HOD
        query.department = 'Computer Science';

        const students = await Student.find(query).sort({ appliedDate: 'desc' });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Controller for "Approve" Button ---
export const approveStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const updatedStudent = await Student.findOneAndUpdate(
            { studentId: studentId },
            { status: 'approved' },
            { new: true } // Return the updated document
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student approved!', student: updatedStudent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Controller for "View" Button ---
export const getStudentById = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findOne({ studentId: studentId });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};