const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateStudyMaterials = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-8b",
    });

    const prompt = `
You are an AI study assistant.

Create clear study materials from the following content:

${content}

Return the answer in this exact format:

Summary:
- Write a short summary.

Explanation:
- Explain the topic clearly and simply.

Flashcards:
1. Q: ...
   A: ...
2. Q: ...
   A: ...
3. Q: ...
   A: ...
4. Q: ...
   A: ...
5. Q: ...
   A: ...

Exam Questions:
1. ...
2. ...
3. ...
4. ...
5. ...
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      result: text,
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
  generateStudyMaterials,
};