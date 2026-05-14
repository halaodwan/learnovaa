const { Option } = require('../models');


const getAllOptions = async (req, res) => {
  try {
    const options = await Option.findAll();
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getOptionById = async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    res.status(200).json(option);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createOption = async (req, res) => {
  try {
    const newOption = await Option.create(req.body);
    res.status(201).json(newOption);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateOption = async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    await option.update(req.body);

    res.status(200).json({
      message: 'Option updated successfully',
      option,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteOption = async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);

    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    await option.destroy();

    res.status(200).json({ message: 'Option deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOptions,
  getOptionById,
  createOption,
  updateOption,
  deleteOption,
};