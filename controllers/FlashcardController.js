const { Flashcard } = require('../models');



const getAllFlashcards = async (req, res) => {

  try {

    const flashcards = await Flashcard.findAll();

    res.status(200).json(flashcards);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



const getFlashcardById = async (req, res) => {

  try {

    const flashcard = await Flashcard.findByPk(req.params.id);

    if (!flashcard) {

      return res.status(404).json({ message: 'Flashcard not found' });

    }

    res.status(200).json(flashcard);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



const createFlashcard = async (req, res) => {

  try {

    const newFlashcard = await Flashcard.create(req.body);

    res.status(201).json(newFlashcard);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



const updateFlashcard = async (req, res) => {

  try {

    const flashcard = await Flashcard.findByPk(req.params.id);

    if (!flashcard) {

      return res.status(404).json({ message: 'Flashcard not found' });

    }

    await flashcard.update(req.body);

    res.status(200).json({

      message: 'Flashcard updated successfully',

      flashcard,

    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};



const deleteFlashcard = async (req, res) => {

  try {

    const flashcard = await Flashcard.findByPk(req.params.id);

    if (!flashcard) {

      return res.status(404).json({ message: 'Flashcard not found' });

    }

    await flashcard.destroy();

    res.status(200).json({ message: 'Flashcard deleted successfully' });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

module.exports = {

  getAllFlashcards,

  getFlashcardById,

  createFlashcard,

  updateFlashcard,

  deleteFlashcard,

};