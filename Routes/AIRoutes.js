const express = require("express");

const router = express.Router();

const {
  generateStudyMaterials,
  askAI,
} = require("../controllers/AIController");

router.post("/study-materials", generateStudyMaterials);

router.post("/ask", askAI);

router.get("/", (req, res) => {
  res.send("AI ROUTE WORKING");
});

module.exports = router;