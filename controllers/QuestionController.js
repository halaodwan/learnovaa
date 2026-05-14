const { Question, Option } = require("../models");

// GET all questions with options
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [
        {
          model: Option,
          as: "Options",
        },
      ],
    });

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET question by id
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [
        {
          model: Option,
          as: "Options",
        },
      ],
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE question
const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE question
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.update(req.body);

    res.status(200).json({
      message: "Question updated successfully",
      question,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE question
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.destroy();

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};