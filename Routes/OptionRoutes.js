const express = require('express');

const router = express.Router();

const {
  getAllOptions,
  getOptionById,
  createOption,
  updateOption,
  deleteOption,
} = require('../controllers/OptionController');

router.get('/', getAllOptions);

router.get('/:id', getOptionById);

router.post('/', createOption);

router.put('/:id', updateOption);

router.delete('/:id', deleteOption);

module.exports = router;