const { Answer, Option } = require('../models');


const getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.findAll({
      include: {
        model: Option,
        as: 'option',
      },
    });

    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id, {
      include: {
        model: Option,
        as: 'option',
      },
    });

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createAnswer = async (req, res) => {
  try {
    const newAnswer = await Answer.create(req.body);
    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    await answer.update(req.body);

    res.status(200).json({
      message: 'Answer updated successfully',
      answer,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    await answer.destroy();

    res.status(200).json({ message: 'Answer deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAnswers,
  getAnswerById,
  createAnswer,
  updateAnswer,
  deleteAnswer,
};