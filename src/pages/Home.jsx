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
  const [uploadedFileText, setUploadedFileText] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [currentMaterialId, setCurrentMaterialId] = useState(null);
  const [currentExamId, setCurrentExamId] = useState(null);

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

  const requestJson = async (url, options = {}) => {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Request failed");
    }

    return data;
  };

  const getSavedId = (data) => {
    return (
      data?.id ||
      data?.data?.id ||
      data?.material?.id ||
      data?.exam?.id ||
      null
    );
  };

  const createMaterial = async (content) => {
    const data = await requestJson(`${API_URL}/study-materials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        content: content.slice(0, 255) || "Generated Study Material",
        type: "ai",
        created_at: new Date().toISOString(),
      }),
    });

    const id = getSavedId(data);

    if (!id) {
      throw new Error("Study material was created, but no id was returned.");
    }

    return id;
  };

  const createExam = async (materialId) => {
    const data = await requestJson(`${API_URL}/exams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        material_id: materialId,
        type: "AI",
        number_of_questions: 5,
        duration: 15,
      }),
    });

    const id = getSavedId(data);

    if (!id) {
      throw new Error("Exam was created, but no id was returned.");
    }

    return id;
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
        const data = await requestJson(`${API_URL}/study-sessions`, {
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

        alert("Study plan saved successfully!");
        console.log(data);
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to save study plan.");
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
      const data = await requestJson(`${API_URL}/contents/upload-file`, {
        method: "POST",
        body: formData,
      });

      alert("File uploaded successfully!");
      console.log(data);
      setUploadedFileName(data.fileName || data?.data?.fileName || file.name);
      setUploadedFileText(data.extractedText || data?.data?.extractedText || "");

      if (!data.extractedText && !data?.data?.extractedText) {
        alert("File uploaded, but no readable text was found inside it.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to upload file.");
    }
  };

  const generateAll = async () => {
    const sources = [
      contentText.trim(),
      uploadedFileText.trim(),
    ].filter(Boolean);

    const sourceText = sources.join("\n\n");
    const cleanYouTubeLink = youtubeLink.trim();

    if (sourceText === "" && cleanYouTubeLink === "") {
      alert("Please paste text, add a YouTube link, or upload a file first.");
      return;
    }

    try {
      setAiLoading(true);
      setAiResult("");

      const aiData = await requestJson(`${API_URL}/ai/study-materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: sourceText,
          youtubeUrl: cleanYouTubeLink,
        }),
      });

      if (!aiData.success || !aiData.data) {
        throw new Error("AI generation failed.");
      }

      const generated = aiData.data;
      const materialTitle = cleanYouTubeLink || sourceText;
      const materialId = await createMaterial(materialTitle);
      const examId = await createExam(materialId);

      await requestJson(`${API_URL}/contents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          material_id: materialId,
          type: "summary",
          content_text: generated.summary || "",
        }),
      });

      await requestJson(`${API_URL}/contents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          material_id: materialId,
          type: "explanation",
          content_text: generated.explanation || "",
        }),
      });

      for (const card of generated.flashcards || []) {
        await requestJson(`${API_URL}/flashcards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            material_id: materialId,
            question: card.question || "",
            answer: card.answer || "",
          }),
        });
      }

      for (const examQuestion of generated.examQuestions || []) {
        const savedQuestion = await requestJson(`${API_URL}/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exam_id: examId,
            type: examQuestion.type || "Essay",
            question_text: examQuestion.question || "",
          }),
        });

        const questionId =
          savedQuestion.id ||
          savedQuestion?.data?.id ||
          savedQuestion?.question?.id ||
          savedQuestion?.data?.question?.id;

        if (questionId) {
          await requestJson(`${API_URL}/answers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              question_id: questionId,
              selected_option_id: null,
              answer_text: examQuestion.answer || "",
              is_correct: true,
            }),
          });
        }
      }

      setCurrentMaterialId(materialId);
      setCurrentExamId(examId);
      setAiResult("");

      alert("Study materials saved to database successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Backend connection failed.");
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
      setAiLoading(true);

      const data = await requestJson(`${API_URL}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: aiQuestion.trim(),
          summary: contentText,
          explanation: aiResult,
          material_id: currentMaterialId,
          exam_id: currentExamId,
        }),
      });

      if (data.success) {
        setAiResult(data.answer || "No answer generated.");
        setAiQuestion("");
      } else {
        alert("AI answer failed.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "AI answer failed.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-sky-50">
              <h2 className="flex items-center gap-3 text-2xl font-semibold text-slate-800">
                <span className="w-10 h-10 rounded-2xl bg-[#1e3a8a] text-white flex items-center justify-center shadow-sm">
                  <Paperclip size={21} />
                </span>
                Upload Content
              </h2>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-4 focus-within:ring-2 focus-within:ring-sky-200 transition">
                <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
                  Notes
                </label>
                <textarea
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Paste your study content here..."
                  className="w-full min-h-[110px] bg-transparent text-slate-700 placeholder:text-slate-400 outline-none resize-y"
                  rows="4"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
                  YouTube Video
                </label>

                <div className="flex items-center gap-3 border border-red-100 bg-red-50/70 rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-red-200 transition">
                  <div className="bg-red-500 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <PlayCircle size={22} className="text-white" />
                  </div>

                  <input
                    type="text"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="Paste YouTube link here..."
                    className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 min-w-0"
                  />

                  {youtubeLink && (
                    <span className="hidden sm:inline-flex text-xs font-semibold text-red-600 bg-white/80 border border-red-100 rounded-full px-3 py-1">
                      Attached
                    </span>
                  )}
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
                className="w-full bg-[#1e3a8a] hover:bg-[#1a3277] text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 mb-4 transition shadow-sm"
              >
                <Paperclip size={18} />
                Attach Files
              </button>

              {uploadedFileName && (
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-white text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
                    <File size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700">
                      Uploaded file
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {uploadedFileName}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={generateAll}
                disabled={aiLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:from-violet-300 disabled:to-fuchsia-300 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Sparkles size={18} />
                {aiLoading ? "Generating..." : "Generate Study Materials"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-sky-50">
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-2xl font-semibold text-slate-800">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <Timer size={21} />
                  </span>
                  Custom Study Timer
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    mode === "study"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {mode === "study" ? "Focus" : "Break"}
                </span>
              </div>
            </div>

            <div className="p-6">
              {!planStarted && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <label className="text-xs font-semibold uppercase text-slate-500">
                      Study min
                    </label>
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
                      className="w-full bg-transparent text-lg font-semibold text-slate-800 mt-1 outline-none"
                  />
                </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <label className="text-xs font-semibold uppercase text-slate-500">
                      Break min
                    </label>
                  <input
                    type="number"
                    min="1"
                    value={breakMinutes}
                    onChange={(e) =>
                      setBreakMinutes(getPositiveNumber(e.target.value, 1))
                    }
                      className="w-full bg-transparent text-lg font-semibold text-slate-800 mt-1 outline-none"
                  />
                </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <label className="text-xs font-semibold uppercase text-slate-500">
                      Sessions
                    </label>
                  <input
                    type="number"
                    min="1"
                    value={totalSessions}
                    onChange={(e) =>
                      setTotalSessions(getPositiveNumber(e.target.value, 1))
                    }
                      className="w-full bg-transparent text-lg font-semibold text-slate-800 mt-1 outline-none"
                  />
                </div>
              </div>
            )}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 mb-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-medium text-slate-500 mb-1">
                      {mode === "study" ? "Study Time" : "Break Time"}
                    </p>
                    <div className="text-5xl font-bold text-[#1e3a8a]">
                      {formatPlanTime(timeLeft)}
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Session {currentSession} of {totalSessions}
                    </p>
                  </div>

                  <div
                    className="w-28 h-28 rounded-full p-2 shadow-inner"
                    style={{
                      background: `conic-gradient(#10b981 ${getSessionProgress()}%, #e2e8f0 0)`,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">
                        {getSessionProgress()}%
                      </span>
                      <span className="text-xs text-slate-500">done</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-sky-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${getSessionProgress()}%` }}
                  />
                </div>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleMainTimerButton}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 transition shadow-sm"
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
                  className="bg-slate-700 hover:bg-slate-800 text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 transition shadow-sm"
              >
                <RotateCcw size={18} />
                Reset & Save
              </button>
            </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[620px]">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-indigo-50">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
              <span className="w-10 h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-sm">
                <MessageSquare size={21} />
              </span>
              Ask AI
            </h2>
          </div>

          <div className="flex-1 p-6 flex flex-col">
            {aiResult ? (
              <div className="border border-slate-200 rounded-2xl mb-5 shadow-sm overflow-hidden bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-semibold text-slate-800">AI Result</h3>
                  {aiLoading && (
                    <span className="text-xs font-medium text-sky-600">
                      Thinking...
                    </span>
                  )}
                </div>
                <div className="p-5 overflow-y-auto max-h-[340px]">
                  <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700 font-sans">
                    {aiResult}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-[260px] rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white mb-5 flex items-center justify-center">
                <div className="text-center max-w-sm px-6">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-4">
                    <Sparkles size={26} />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Ready when you are
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Generate study materials first, then ask a question about
                    your content.
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              Learnova uses AI to help you study smarter from your uploaded
              files, pasted notes, or YouTube links.
            </p>

            <div className="mt-auto flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:ring-2 focus-within:ring-sky-200">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !aiLoading) {
                    sendQuestion();
                  }
                }}
                placeholder="Ask anything about your material..."
                className="flex-1 px-3 py-2 outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
              />

              <button
                onClick={sendQuestion}
                disabled={aiLoading}
                className="bg-[#1e3a8a] hover:bg-[#1a3277] disabled:bg-slate-400 text-white w-11 h-11 rounded-xl transition flex items-center justify-center shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

