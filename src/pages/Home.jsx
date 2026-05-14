import { useEffect, useState } from "react";
import {
  Paperclip,
  FileText,
  File,
  Headphones,
  Image,
  Video,
  BookOpen,
  AlignJustify,
  Layers,
  ClipboardList,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Send,
  MessageSquare,
} from "lucide-react";

function Home() {
  const API_URL = "http://localhost:3000";

  const [contentText, setContentText] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");

  const [seconds, setSeconds] = useState(() => {
    return Number(localStorage.getItem("studySeconds")) || 0;
  });

  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem("studyRunning") === "true";
  });

  const userId = 1;
  const materialId = 1;

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          localStorage.setItem("studySeconds", newSeconds);
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => {
    const newState = !isRunning;
    setIsRunning(newState);
    localStorage.setItem("studyRunning", newState);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const saveContent = async (type) => {
    if (contentText.trim() === "") {
      alert("Please paste or write content first.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/contents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          material_id: materialId,
          type: type,
          content_text: contentText,
          created_at: new Date(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${type} saved successfully!`);
        console.log(data);
      } else {
        alert("Failed to save content.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    }
  };

  const createFlashcard = async () => {
    if (contentText.trim() === "") {
      alert("Please enter content first.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          material_id: materialId,
          question: "Flashcard question from uploaded content",
          answer: contentText,
          created_at: new Date(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Flashcard created successfully!");
        console.log(data);
      } else {
        alert("Failed to create flashcard.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    }
  };

  const createExam = async () => {
    try {
      const response = await fetch(`${API_URL}/exams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          material_id: materialId,
          type: "practice",
          number_of_questions: 5,
          duration: 30,
          created_at: new Date(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Exam created successfully!");
        console.log(data);
      } else {
        alert("Failed to create exam.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    }
  };

  const saveStudySession = async () => {
    if (seconds === 0) {
      setIsRunning(false);
      localStorage.setItem("studyRunning", "false");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/study-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          duration: seconds,
          date: new Date(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Study session saved successfully!");
        console.log(data);
      } else {
        alert("Failed to save study session.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    }

    setIsRunning(false);
    setSeconds(0);
    localStorage.removeItem("studySeconds");
    localStorage.setItem("studyRunning", "false");
  };

  const sendQuestion = async () => {
    if (aiQuestion.trim() === "") {
      alert("Please write a question first.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exam_id: 1,
          type: "ai",
          question_text: aiQuestion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Question saved successfully!");
        console.log(data);
        setAiQuestion("");
      } else {
        alert("Failed to save question.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800 mb-5">
              <Paperclip size={22} className="text-slate-700" />
              Upload Content
            </h2>

            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Paste your study content here..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-300"
              rows="3"
            />

            <button
              onClick={() => saveContent("text")}
              className="w-full bg-[#1e3a8a] hover:bg-[#1a3277] text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 mb-4 transition"
            >
              <Paperclip size={18} />
              Attach Files
            </button>

            <div className="grid grid-cols-5 gap-3 mb-5">
              <div className="bg-slate-100 rounded-xl h-20 flex flex-col items-center justify-center text-slate-600 text-sm">
                <FileText size={22} className="mb-2" />
                Text
              </div>

              <div className="bg-slate-100 rounded-xl h-20 flex flex-col items-center justify-center text-slate-600 text-sm">
                <File size={22} className="mb-2" />
                File
              </div>

              <div className="bg-slate-100 rounded-xl h-20 flex flex-col items-center justify-center text-slate-600 text-sm">
                <Headphones size={22} className="mb-2" />
                Audio
              </div>

              <div className="bg-slate-100 rounded-xl h-20 flex flex-col items-center justify-center text-slate-600 text-sm">
                <Image size={22} className="mb-2" />
                Image
              </div>

              <div className="bg-slate-100 rounded-xl h-20 flex flex-col items-center justify-center text-slate-600 text-sm">
                <Video size={22} className="mb-2" />
                Video
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => saveContent("explanation")}
                className="bg-[#1e3a8a] hover:bg-[#1a3277] text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
              >
                <BookOpen size={18} />
                Explain
              </button>

              <button
                onClick={() => saveContent("summary")}
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
              >
                <AlignJustify size={18} />
                Summarize
              </button>

              <button
                onClick={createFlashcard}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
              >
                <Layers size={18} />
                Flashcards
              </button>

              <button
                onClick={createExam}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
              >
                <ClipboardList size={18} />
                Exams
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800 mb-5">
              <Timer size={22} className="text-slate-700" />
              Study Timer
            </h2>

            <div className="text-center text-5xl font-bold text-[#1e3a8a] mb-5">
              {formatTime(seconds)}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={toggleTimer}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? "Pause" : "Start Study Session"}
              </button>

              <button
                onClick={saveStudySession}
                className="bg-slate-500 hover:bg-slate-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800 mb-5">
            <MessageSquare size={22} className="text-sky-500" />
            Ask AI
          </h2>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center text-sm font-bold shrink-0">
                AI
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 text-slate-700 text-sm shadow-sm max-w-[85%]">
                Hello! I’m your AI study assistant. Upload content and I’ll help you
                create flashcards, summaries, explanations, and exams. What would you
                like to learn today?
              </div>
            </div>

            <div className="flex justify-end items-start gap-3 mb-4">
              <div className="bg-slate-200 rounded-2xl px-4 py-3 text-slate-700 text-sm shadow-sm max-w-[70%]">
                Can you summarize my biology notes?
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-sm font-bold shrink-0">
                A
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center text-sm font-bold shrink-0">
                AI
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 text-slate-700 text-sm shadow-sm max-w-[85%]">
                Of course! Please upload your biology notes using the Attach Files
                button, then click "Summarize" to get started.
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-4">
            Learnova uses AI to help you study smarter — create flashcards, summaries,
            explanations, and practice exams from any content.
          </p>

          <div className="mt-auto flex items-center gap-3">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={sendQuestion}
              className="bg-[#1e3a8a] hover:bg-[#1a3277] text-white p-3 rounded-xl transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;