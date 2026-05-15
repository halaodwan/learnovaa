const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateFlashcards = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required"
      });
    }

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `
Create 5 flashcards about ${topic}.

Return ONLY valid JSON.
No explanation.
No markdown.
No \`\`\`json.

Format:

[
  {
    "question": "",
    "answer": ""
  }
]
`
          }
        ],
        model: "llama-3.1-8b-instant"
      });

    const text =
      completion.choices[0].message.content;

    // تنظيف النص لو رجع markdown
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const response = JSON.parse(cleanedText);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.log("Groq Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  generateFlashcards
};