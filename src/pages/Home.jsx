import { useEffect, useRef, useState } from "react";
import {
  Paperclip,
  File,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Send,
  MessageSquare,
  Sparkles,
  PlayCircle,
} from "lucide-react";

function Home() {
  const API_URL = "http://localhost:3000";
  const fileInputRef = useRef(null);

  const [contentText, setContentText] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [totalSessions, setTotalSessions] = useState(4);
  const [currentSession, setCurrentSession] = useState(1);
  const [mode, setMode] = useState("study");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [planRunning, setPlanRunning] = useState(false);
  const [planStarted, setPlanStarted] = useState(false);

  const userId = 1;

  const getPositiveNumber = (value, fallback = 1) => {
    const number = Number(value);
    return Number.isFinite(number) && number >= 1 ? number : fallback;
  };

  useEffect(() => {
    if (!planRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (mode === "study") {
          setMode("break");
          return breakMinutes * 60;
        }

        if (currentSession < totalSessions) {
          setCurrentSession((prevSession) => prevSession + 1);
          setMode("study");
          return studyMinutes * 60;
        }

        setPlanRunning(false);
        setPlanStarted(false);
        alert("Study plan completed!");
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    planRunning,
    mode,
    currentSession,
    totalSessions,
    studyMinutes,
    breakMinutes,
  ]);

  const startStudyPlan = () => {
    setMode("study");
    setCurrentSession(1);
    setTimeLeft(studyMinutes * 60);
    setPlanStarted(true);
    setPlanRunning(true);
  };

  const resumeStudyPlan = () => {
    setPlanRunning(true);
  };

  const pauseStudyPlan = () => {
    setPlanRunning(false);
  };

  const handleMainTimerButton = () => {
    if (planRunning) {
      pauseStudyPlan();
      return;
    }

    if (planStarted) {
      resumeStudyPlan();
      return;
    }

    startStudyPlan();
  };

  const formatPlanTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const getSessionProgress = () => {
    const totalTime = mode === "study" ? studyMinutes * 60 : breakMinutes * 60;

    if (totalTime <= 0) return 0;

    return Math.min(
      100,
      Math.max(0, Math.round(((totalTime - timeLeft) / totalTime) * 100))
    );
  };

  const resetStudyPlan = async () => {
    const completedStudySessions =
      mode === "break" ? currentSession : currentSession - 1;

    const currentStudyProgress =
      mode === "study" ? studyMinutes * 60 - timeLeft : 0;

    const totalStudySeconds =
      completedStudySessions * studyMinutes * 60 + currentStudyProgress;

    if (totalStudySeconds > 0) {
      try {
        const response = await fetch(`${API_URL}/study-sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            duration: totalStudySeconds,
            date: new Date().toISOString(),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Study plan saved successfully!");
          console.log(data);
        } else {
          alert("Failed to save study plan.");
          console.log(data);
        }
      } catch (error) {
        console.error(error);
        alert("Backend connection failed.");
      }
    }

    setPlanRunning(false);
    setPlanStarted(false);
    setMode("study");
    setCurrentSession(1);
    setTimeLeft(studyMinutes * 60);
  };

  const uploadFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/contents/upload-file`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("File uploaded successfully!");
        console.log(data);
        setUploadedFileName(data.fileName);
      } else {
        alert("Failed to upload file.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    }
  };

  const generateAll = async () => {
    const sourceText =
      youtubeLink.trim() !== ""
        ? youtubeLink.trim()
        : contentText.trim() !== ""
        ? contentText.trim()
        : uploadedFileName.trim();

    if (sourceText === "") {
      alert("Please paste text, add a YouTube link, or upload a file first.");
      return;
    }

    try {
      setAiLoading(true);
      setAiResult("");

      const response = await fetch(`${API_URL}/ai/study-materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: sourceText,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("aiSummary", data.data.summary);
        localStorage.setItem("aiExplanation", data.data.explanation);
        localStorage.setItem(
          "aiFlashcards",
          JSON.stringify(data.data.flashcards)
        );
        localStorage.setItem(
          "aiExamQuestions",
          JSON.stringify(data.data.examQuestions)
        );

        alert("Study materials generated successfully!");
      } else {
        alert("AI generation failed.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection failed.");
    } finally {
      setAiLoading(false);
    }
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
          question_text: aiQuestion.trim(),
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

            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                YouTube Video
              </label>

              <div className="flex items-center gap-3 border border-red-200 bg-red-50 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-red-300 transition">
                <div className="bg-red-500 p-2 rounded-xl">
                  <PlayCircle size={22} className="text-white" />
                </div>

                <input
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="Paste YouTube link here..."
                  className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {youtubeLink && (
                <p className="text-xs text-red-500 mt-2">
                  YouTube video attached
                </p>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => uploadFile(e.target.files?.[0])}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#1e3a8a] hover:bg-[#1a3277] text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 mb-4 transition"
            >
              <Paperclip size={18} />
              Attach Files
            </button>

            {uploadedFileName && (
              <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 mb-4">
                <File size={20} className="text-slate-600" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Uploaded file
                  </p>
                  <p className="text-xs text-slate-500">{uploadedFileName}</p>
                </div>
              </div>
            )}

            <button
              onClick={generateAll}
              disabled={aiLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl py-4 font-medium flex items-center justify-center gap-2 transition"
            >
              <Sparkles size={18} />
              {aiLoading ? "Generating..." : "Generate Study Materials"}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800 mb-5">
              <Timer size={22} className="text-slate-700" />
              Custom Study Timer
            </h2>

            {!planStarted && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div>
                  <label className="text-sm text-slate-600">Study min</label>
                  <input
                    type="number"
                    min="1"
                    value={studyMinutes}
                    onChange={(e) => {
                      const value = getPositiveNumber(e.target.value, 1);
                      setStudyMinutes(value);
                      if (!planRunning && mode === "study") {
                        setTimeLeft(value * 60);
                      }
                    }}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Break min</label>
                  <input
                    type="number"
                    min="1"
                    value={breakMinutes}
                    onChange={(e) =>
                      setBreakMinutes(getPositiveNumber(e.target.value, 1))
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-600">Sessions</label>
                  <input
                    type="number"
                    min="1"
                    value={totalSessions}
                    onChange={(e) =>
                      setTotalSessions(getPositiveNumber(e.target.value, 1))
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 mt-1 outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>
            )}

            <p className="text-center text-slate-600 mb-2">
              {mode === "study" ? "Study Time" : "Break Time"} - Session{" "}
              {currentSession} / {totalSessions}
            </p>

            <div className="text-center text-5xl font-bold text-[#1e3a8a] mb-4">
              {formatPlanTime(timeLeft)}
            </div>

            <div className="w-full bg-slate-200 rounded-full h-3 mb-5 overflow-hidden">
              <div
                className="bg-[#1e3a8a] h-3 rounded-full transition-all"
                style={{ width: `${getSessionProgress()}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleMainTimerButton}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
              >
                {planRunning ? <Pause size={18} /> : <Play size={18} />}
                {planRunning
                  ? "Pause"
                  : planStarted
                  ? "Resume"
                  : "Start Study Plan"}
              </button>

              <button
                onClick={resetStudyPlan}
                className="bg-slate-500 hover:bg-slate-600 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition"
              >
                <RotateCcw size={18} />
                Reset & Save
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
                Hello! I’m your AI study assistant. Upload content and I’ll help
                you create flashcards, summaries, explanations, and exams. What
                would you like to learn today?
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
                Of course! Please upload your biology notes using the Attach
                Files button, then click "Generate Study Materials" to get
                started.
              </div>
            </div>
          </div>

          {aiResult && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm overflow-y-auto max-h-[300px]">
              <h3 className="font-semibold text-slate-800 mb-2">
                Generated Study Materials
              </h3>
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                {aiResult}
              </pre>
            </div>
          )}

          <p className="text-sm text-slate-500 mb-4">
            Learnova uses AI to help you study smarter - create flashcards,
            summaries, explanations, and practice exams from any content.
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