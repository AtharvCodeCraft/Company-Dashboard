require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Employee = require('./models/Employee');
const Team = require('./models/Team');
const Product = require('./models/Product');
const Sale = require('./models/Sale');
const Ticket = require('./models/Ticket');
const Contract = require('./models/Contract');
const Task = require('./models/Task');
const Project = require('./models/Project');

const connectDB = require('./config/db');

const seedDB = async () => {
  await connectDB();
  console.log('Connected to MongoDB. Starting seed...');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Employee.deleteMany({}),
    Team.deleteMany({}),
    Product.deleteMany({}),
    Sale.deleteMany({}),
    Ticket.deleteMany({}),
    Contract.deleteMany({}),
    Task.deleteMany({}),
    Project.deleteMany({}),
  ]);

  // Create Users
  const superAdmin = await User.create({ name: 'Super Admin', email: 'admin@worksphere.com', password: 'admin', role: 'Super Admin' });
  const manager = await User.create({ name: 'Jane Manager', email: 'jane@worksphere.com', password: 'password123', role: 'Manager' });
  const emp1 = await User.create({ name: 'John Smith', email: 'john@worksphere.com', password: 'password123', role: 'Employee' });
  const emp2 = await User.create({ name: 'Sarah Connor', email: 'sarah@worksphere.com', password: 'password123', role: 'Employee' });
  const emp3 = await User.create({ name: 'Mike Ross', email: 'mike@worksphere.com', password: 'password123', role: 'Employee' });

  // Create Team
  const team = await Team.create({ name: 'Engineering Team', description: 'Core product development team', leader: manager._id });

  // Create Employees  
  const e1 = await Employee.create({ user: emp1._id, employeeId: 'EMP-001', department: 'Engineering', designation: 'Frontend Dev', team: team._id, salary: 75000 });
  const e2 = await Employee.create({ user: emp2._id, employeeId: 'EMP-002', department: 'Engineering', designation: 'Backend Dev', team: team._id, salary: 80000 });
  const e3 = await Employee.create({ user: emp3._id, employeeId: 'EMP-003', department: 'Sales', designation: 'Account Executive', salary: 65000 });

  // Update team members
  team.members = [e1._id, e2._id];
  await team.save();

  // Create Products
  const p1 = await Product.create({ name: 'Worksphere Enterprise License', price: 999, stock: 50, category: 'Software' });
  const p2 = await Product.create({ name: 'Cloud Storage 1TB', price: 120, stock: 999, category: 'Service' });

  // Create Sales
  await Sale.create({ product: p1._id, quantity: 2, totalAmount: 1998, seller: superAdmin._id, customerName: 'Acme Corp' });
  await Sale.create({ product: p2._id, quantity: 5, totalAmount: 600, seller: emp3._id, customerName: 'Startup Inc' });

  // Create Project
  const project = await Project.create({ name: 'Dashboard v2', description: 'Redesign company dashboard', status: 'Active', team: team._id, manager: manager._id, deadline: new Date('2024-03-31') });

  // Create Tasks
  await Task.create({ title: 'Design UI Mockups', description: 'Create wireframes', project: project._id, assignee: e1._id, priority: 'High', status: 'In Progress', deadline: new Date('2024-01-20') });
  await Task.create({ title: 'Setup CI/CD Pipeline', description: 'GitHub Actions workflow', project: project._id, assignee: e2._id, priority: 'Medium', status: 'Todo', deadline: new Date('2024-01-25') });
  await Task.create({ title: 'Database Schema Design', description: 'Design MongoDB schemas', project: project._id, assignee: e2._id, priority: 'Urgent', status: 'Completed', deadline: new Date('2024-01-10') });

  // Create Tickets
  await Ticket.create({ title: 'Cannot access billing portal', description: 'Getting 403 error on billing page.', customerName: 'Alice Wong', customerEmail: 'alice@corp.com', status: 'Open' });
  await Ticket.create({ title: 'API returning 500 on data sync', description: 'Sync endpoint failing intermittently.', customerName: 'Bob Smith', customerEmail: 'bob@tech.io', status: 'In Progress', assignedTo: e1._id });

  // Create Contracts
  await Contract.create({ clientName: 'Acme Corp', description: 'Enterprise Dashboard build', value: 45000, startDate: new Date('2023-10-01'), deadline: new Date('2023-12-15'), status: 'Completed', assignedTeam: team._id });
  await Contract.create({ clientName: 'Global Tech', description: 'Cloud Migration Project', value: 120000, startDate: new Date('2023-11-01'), deadline: new Date('2024-03-30'), status: 'Active', assignedTeam: team._id });

  console.log('✅ Database seeded successfully!');
  console.log('🔑 Login: admin@worksphere.com / admin');
  process.exit(0);
};

seedDB().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
