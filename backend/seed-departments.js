require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const DepartmentSchema = new mongoose.Schema({
  name: String,
  description: String,
}, { timestamps: true });

const Department = mongoose.model('Department', DepartmentSchema);

const departments = [
  { name: 'Front End', description: 'Frontend development team' },
  { name: 'Backend', description: 'Backend development team' },
  { name: 'Full Stack', description: 'Full stack development team' },
  { name: 'DevOps', description: 'DevOps and infrastructure team' },
  { name: 'Network', description: 'Network and security team' },
  { name: 'HR', description: 'Human resources department' },
];

const seedDepartments = async () => {
  try {
    await connectDB();

    // Clear existing departments
    await Department.deleteMany({});
    console.log('Cleared existing departments');

    // Insert new departments
    const created = await Department.insertMany(departments);
    
    console.log('✅ Departments created successfully!');
    console.log(`Total: ${created.length} departments`);
    created.forEach(dept => {
      console.log(`- ${dept.name} (ID: ${dept._id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedDepartments();
