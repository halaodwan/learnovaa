const express = require('express');

const router = express.Router();

const {

  getAllResults,

  getResultById,

  createResult,

  updateResult,

  deleteResult,

} = require('../controllers/resultController');

router.get('/', getAllResults);

router.get('/:id', getResultById);

router.post('/', createResult);

router.put('/:id', updateResult);

router.delete('/:id', deleteResult);

module.exports = router;