const { Content } = require('../models');

const getAllContent = async (req, res) => {
  try {
    const content = await Content.findAll();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getContentById = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createContent = async (req, res) => {
  try {
    const newContent = await Content.create(req.body);
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContent = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    await content.update(req.body);
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    await content.destroy();
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent
};