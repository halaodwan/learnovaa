const express = require('express');

const router = express.Router();

const {

  getAllFlashcards,

  getFlashcardById,

  createFlashcard,

  updateFlashcard,

  deleteFlashcard,

} = require('../controllers/flashcardController');

router.get('/', getAllFlashcards);

router.get('/:id', getFlashcardById);

router.post('/', createFlashcard);

router.put('/:id', updateFlashcard);

router.delete('/:id', deleteFlashcard);

module.exports = router;