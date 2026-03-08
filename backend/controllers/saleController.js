const Sale = require('../models/Sale');

exports.createSale = async (req, res) => {
  try {
    const sale = await Sale.create({ ...req.body, seller: req.user._id });
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('product').populate('seller', 'name email');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
