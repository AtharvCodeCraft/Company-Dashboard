const Employee = require('../models/Employee');

const User = require('../models/User');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('user', 'name email role isActive').populate('team', 'name');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user', 'name email role').populate('team', 'name');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, employeeId, department, designation, salary, team } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create User
    user = await User.create({
      name,
      email,
      password: password || 'Welcome@123', // Default password
      role: role || 'Employee'
    });

    // Create Employee
    const employee = await Employee.create({ 
      user: user._id, 
      employeeId, 
      department, 
      designation, 
      salary, 
      team 
    });

    const populatedEmployee = await Employee.findById(employee._id).populate('user', 'name email role isActive');
    res.status(201).json(populatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
