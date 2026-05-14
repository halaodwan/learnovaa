const { StudyMaterial } = require('../models');

const getAllStudyMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.findAll();
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudyMaterialById = async (req, res) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createStudyMaterial = async (req, res) => {
  try {
    const newMaterial = await StudyMaterial.create(req.body);
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    await material.update(req.body);
    res.status(200).json({ message: 'Study material updated successfully', material });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    await material.destroy();
    res.status(200).json({ message: 'Study material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStudyMaterials,
  getStudyMaterialById,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
};