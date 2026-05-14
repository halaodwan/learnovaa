const express = require('express');
const router = express.Router();

const {
  getAllStudySessions,
  getStudySessionById,
  createStudySession,
  updateStudySession,
  deleteStudySession,
} = require('../controllers/StudySessionController');

router.get('/', getAllStudySessions);
router.get('/:id', getStudySessionById);
router.post('/', createStudySession);
router.put('/:id', updateStudySession);
router.delete('/:id', deleteStudySession);

module.exports = router;