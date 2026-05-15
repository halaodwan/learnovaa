const Groq = require("groq-sdk");
const { YoutubeTranscript } = require("youtube-transcript");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const isYouTubeLink = (text) => {
  return (
    typeof text === "string" &&
    (text.includes("youtube.com") || text.includes("youtu.be"))
  );
};

const getYouTubeTranscript = async (url) => {
  const transcript = await YoutubeTranscript.fetchTranscript(url);
  return transcript.map((item) => item.text).join(" ");
};

const parseAiJson = (text) => {
  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    const start = cleanedText.indexOf("{");
    const end = cleanedText.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("AI did not return valid JSON.");
    }

    return JSON.parse(cleanedText.slice(start, end + 1));
  }
};

const generateStudyMaterials = async (req, res) => {
  try {
    let { topic } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    topic = topic.trim();

    if (isYouTubeLink(topic)) {
      try {
        topic = await getYouTubeTranscript(topic);
      } catch (error) {
        console.log("YouTube transcript failed:", error.message);

        topic = `
The user provided a YouTube link, but the transcript could not be read.
Use the link as a reference only and create general study materials if possible.

YouTube link:
${topic}
`;
      }
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
      temperature: 0.2,
    });

    const text = completion.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response.",
      });
    }

    const response = parseAiJson(text);

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

    if (!question || typeof question !== "string") {
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
${question.trim()}

Answer clearly and simply.
`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
    });

    const answer = completion.choices?.[0]?.message?.content;

    res.json({
      success: true,
      answer: answer || "No answer generated.",
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
