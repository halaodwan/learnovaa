const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateStudyMaterials = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
Create study materials about: ${topic}

Return ONLY valid JSON.
No markdown.
No explanation.
No code block.

Use this exact structure:

{
  "summary": "",
  "explanation": "",
  "flashcards": [
    {
      "question": "",
      "answer": ""
    }
  ],
  "examQuestions": [
    {
      "question": "",
      "answer": ""
    }
  ]
}

Make 5 flashcards and 5 exam questions.
`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const text = completion.choices[0].message.content;

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const response = JSON.parse(cleanedText);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.log("Groq Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const askAI = async (req, res) => {
  try {
    const { question, summary, explanation } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
You are an AI study assistant.

Use this study material if available:

Summary:
${summary || ""}

Explanation:
${explanation || ""}

User question:
${question}

Answer clearly and simply.
`,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    const answer = completion.choices[0].message.content;

    res.json({
      success: true,
      answer: answer,
    });
  } catch (error) {
    console.log("Groq Ask Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateStudyMaterials,
  askAI,
};