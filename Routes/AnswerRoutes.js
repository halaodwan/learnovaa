const express = require('express');

const router = express.Router();

const {
  getAllAnswers,
  getAnswerById,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} = require('../controllers/AnswerController');

router.get('/', getAllAnswers);

router.get('/:id', getAnswerById);

router.post('/', createAnswer);

router.put('/:id', updateAnswer);

router.delete('/:id', deleteAnswer);

module.exports = router;