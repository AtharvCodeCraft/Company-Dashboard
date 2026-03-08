const User = require('../models/User');
const Employee = require('../models/Employee');
const Team = require('../models/Team');
const Task = require('../models/Task');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Ticket = require('../models/Ticket');
const Contract = require('../models/Contract');
const Attendance = require('../models/Attendance');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const activeContracts = await Contract.countDocuments({ status: 'Active' });

    // Revenue: sum of all sale amounts
    const revenueResult = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySales = await Sale.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { month: { $month: '$date' }, year: { $year: '$date' } },
        revenue: { $sum: '$totalAmount' }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Aggregations for Pie Charts
    const employeesByDept = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const revenueByCategory = await Sale.aggregate([
      { $lookup: { from: 'products', localField: 'product', foreignField: '_id', as: 'productInfo' } },
      { $unwind: '$productInfo' },
      { $group: { _id: '$productInfo.category', value: { $sum: '$totalAmount' } } }
    ]);

    const tasksByPriority = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      totalEmployees,
      totalTasks,
      completedTasks,
      openTickets,
      activeContracts,
      totalRevenue,
      monthlySales,
      employeesByDept,
      revenueByCategory,
      tasksByPriority
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
