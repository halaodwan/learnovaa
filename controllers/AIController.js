const Groq = require("groq-sdk");
const { YoutubeTranscript } = require("youtube-transcript");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const isYouTubeLink = (text) => {
  return (
    typeof text === "string" &&
    /(?:youtube\.com|youtu\.be)/i.test(text)
  );
};

const extractYouTubeUrl = (text) => {
  if (!isYouTubeLink(text)) return "";

  const match = text.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/i
  );

  return match?.[0] || text.trim();
};

const extractYouTubeVideoId = (value) => {
  if (!value || typeof value !== "string") return "";

  const text = value.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(text)) {
    return text;
  }

  const normalized = /^https?:\/\//i.test(text) ? text : `https://${text}`;

  try {
    const url = new URL(normalized);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (host.endsWith("youtube.com")) {
      if (url.searchParams.get("v")) {
        return url.searchParams.get("v");
      }

      const parts = url.pathname.split("/").filter(Boolean);
      const videoPathTypes = ["embed", "shorts", "live", "v"];

      if (videoPathTypes.includes(parts[0])) {
        return parts[1] || "";
      }
    }
  } catch {
    const fallback = text.match(
      /(?:youtube\.com\/(?:.*v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
    );

    return fallback?.[1] || "";
  }

  return "";
};

const removeYouTubeUrlFromText = (text, youtubeUrl) => {
  if (!text) return "";

  return text
    .replace(youtubeUrl, "")
    .replace(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s]+/gi,
      ""
    )
    .trim();
};

const getYouTubeTranscript = async (url) => {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    throw new Error("Invalid YouTube link.");
  }

  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  const transcriptText = transcript.map((item) => item.text).join(" ").trim();

  if (!transcriptText) {
    throw new Error("No readable transcript was found for this YouTube video.");
  }

  return transcriptText;
};

const buildStudyTopic = async (topic = "", youtubeUrl = "") => {
  const cleanTopic = typeof topic === "string" ? topic.trim() : "";
  const cleanYouTubeUrl =
    typeof youtubeUrl === "string" && youtubeUrl.trim()
      ? youtubeUrl.trim()
      : extractYouTubeUrl(cleanTopic);

  const parts = [];
  const topicWithoutYouTube = removeYouTubeUrlFromText(
    cleanTopic,
    cleanYouTubeUrl
  );

  if (cleanYouTubeUrl) {
    const transcriptText = await getYouTubeTranscript(cleanYouTubeUrl);
    parts.push(`YouTube video transcript:\n${transcriptText}`);
  }

  if (topicWithoutYouTube) {
    parts.push(topicWithoutYouTube);
  }

  return parts.join("\n\n").trim();
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
    let { topic, youtubeUrl } = req.body;

    if (
      (!topic || typeof topic !== "string" || topic.trim() === "") &&
      (!youtubeUrl || typeof youtubeUrl !== "string" || youtubeUrl.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Topic or YouTube link is required",
      });
    }

    try {
      topic = await buildStudyTopic(topic, youtubeUrl);
    } catch (error) {
      console.log("YouTube transcript failed:", error.message);

      return res.status(400).json({
        success: false,
        message:
          "Could not read this YouTube video. Make sure the link is valid and the video has captions/transcript.",
      });
    }

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "No readable study content was found.",
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
      temperature: 0.2,
    });

    const text = completion.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response.",
      });
    }

<<<<<<< Updated upstream
    const response = parseAiJson(text);
=======
    // 🔥 FIX: safe JSON parsing
    let response;

    try {
      response = JSON.parse(cleanedText);
    } catch (err) {
      console.log("⚠️ JSON Parse Failed, fallback activated");

      response = {
        summary: "",
        explanation: cleanedText || "",
        flashcards: [],
        examQuestions: [],
      };
    }
>>>>>>> Stashed changes

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
