const express = require("express");

const router = express.Router();

const {
  generateStudyMaterials,
} = require("../controllers/AIController");

router.post("/study-materials", generateStudyMaterials);

router.get("/", (req, res) => {
  res.send("AI ROUTE WORKING");
});

module.exports = router;