const express = require("express");

const router = express.Router();

const {

  generateFlashcards

} = require("../controllers/AIController");

router.post("/generate", generateStudyMaterials);

module.exports = router;