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

module.exports = {

  generateFlashcards

};