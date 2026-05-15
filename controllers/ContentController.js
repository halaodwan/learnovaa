
const { Content } = require('../models');

const getAllContent = async (req, res) => {
  try {
    const options = req.query.user_id
      ? { where: { user_id: req.query.user_id } }
      : {};

    const content = await Content.findAll(options);

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

const allowedTypes = ["summary", "explanation", "flashcards", "exam"];

const createContent = async (req, res) => {
  try {
    const { user_id, material_id, type, content_text } = req.body;

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid type. Allowed types: summary, explanation, flashcards, exam"
      });
    }

    const newContent = await Content.create({
      user_id,
      material_id,
      type,
      content_text,
    });

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
