const Groq = require("groq-sdk");

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const generateStudyMaterials = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an AI study assistant. Generate clear study materials for students.",
        },
        {
          role: "user",
          content: `
Create study materials from this content:

${content}

Return:
1. Summary
2. Explanation
3. 5 Flashcards as question and answer
4. 5 Exam questions
          `,
        },
      ],
    });

    res.status(200).json({
      result: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "AI generation failed",
      error: error.message,
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