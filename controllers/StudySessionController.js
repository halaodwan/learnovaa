const { StudySession } = require('../models');

const getAllStudySessions = async (req, res) => {
  try {
    const sessions = await StudySession.findAll();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudySessionById = async (req, res) => {
  try {
    const session = await StudySession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudySession = async (req, res) => {
  try {
    const newSession = await StudySession.create(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudySession = async (req, res) => {
  try {
    const session = await StudySession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }
    await session.update(req.body);
    res.status(200).json({ message: 'Study session updated successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudySession = async (req, res) => {
  try {
    const session = await StudySession.findByPk(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }
    await session.destroy();
    res.status(200).json({ message: 'Study session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStudySessions,
  getStudySessionById,
  createStudySession,
  updateStudySession,
  deleteStudySession,
};