const { Exam } = require('../models');

// GET all exams

const getAllExams = async (req, res) => {

  try {

    const exams = await Exam.findAll();

    res.status(200).json(exams);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// GET exam by id

const getExamById = async (req, res) => {

  try {

    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {

      return res.status(404).json({ message: 'Exam not found' });

    }

    res.status(200).json(exam);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// POST create exam

const createExam = async (req, res) => {

  try {

    const newExam = await Exam.create(req.body);

    res.status(201).json(newExam);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// PUT update exam

const updateExam = async (req, res) => {

  try {

    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {

      return res.status(404).json({ message: 'Exam not found' });

    }

    await exam.update(req.body);

    res.status(200).json({

      message: 'Exam updated successfully',

      exam,

    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

// DELETE exam

const deleteExam = async (req, res) => {

  try {

    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {

      return res.status(404).json({ message: 'Exam not found' });

    }

    await exam.destroy();

    res.status(200).json({ message: 'Exam deleted successfully' });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

module.exports = {

  getAllExams,

  getExamById,

  createExam,

  updateExam,

  deleteExam,

};