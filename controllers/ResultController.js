const { Result } = require('../models');

// GET all results

const getAllResults = async (req, res) => {

  try {

    const results = await Result.findAll();

    res.status(200).json(results);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// GET result by id

const getResultById = async (req, res) => {

  try {

    const result = await Result.findByPk(req.params.id);

    if (!result) {

      return res.status(404).json({ message: 'Result not found' });

    }

    res.status(200).json(result);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// POST create result

const createResult = async (req, res) => {

  try {

    const newResult = await Result.create(req.body);

    res.status(201).json(newResult);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// PUT update result

const updateResult = async (req, res) => {

  try {

    const result = await Result.findByPk(req.params.id);

    if (!result) {

      return res.status(404).json({ message: 'Result not found' });

    }

    await result.update(req.body);

    res.status(200).json({

      message: 'Result updated successfully',

      result,

    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// DELETE result

const deleteResult = async (req, res) => {

  try {

    const result = await Result.findByPk(req.params.id);

    if (!result) {

      return res.status(404).json({ message: 'Result not found' });

    }

    await result.destroy();

    res.status(200).json({ message: 'Result deleted successfully' });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

module.exports = {

  getAllResults,

  getResultById,

  createResult,

  updateResult,

  deleteResult,

};