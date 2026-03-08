const Contract = require('../models/Contract');

exports.createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().populate('assignedTeam');
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
