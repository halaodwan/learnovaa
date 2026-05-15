const express = require("express");

const router = express.Router();

const {

  generateFlashcards

} = require("../controllers/AIController");

router.post(

  "/flashcards",

  generateFlashcards

);

router.get("/", (req, res) => {

  res.send("AI ROUTE WORKING");

});

module.exports = router;