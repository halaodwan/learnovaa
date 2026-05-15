const express = require("express");
const router = express.Router();

const {
  getAllStudyMaterials,
  getStudyMaterialById,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
} = require("../controllers/StudyMaterialController");

router.get("/", getAllStudyMaterials);

router.get("/history", getAllStudyMaterials);

router.post("/", createStudyMaterial);

router.get("/:id", getStudyMaterialById);

router.put("/:id", updateStudyMaterial);

router.delete("/:id", deleteStudyMaterial);

module.exports = router;