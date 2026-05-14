const express = require("express");
const router = express.Router();

const {
  generateStudyMaterials,
} = require("../controllers/AIController");

router.post("/generate", generateStudyMaterials);

module.exports = router;