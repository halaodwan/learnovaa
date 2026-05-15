import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExamPage() {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(0);

  const [duration, setDuration] = useState(15);
  const [questionCount, setQuestionCount] = useState(5);

  const [questions, setQuestions] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const questionsPerPage = 2;

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const questionsRes = await fetch("http://localhost:3000/questions");
        const answersRes = await fetch("http://localhost:3000/answers");

        if (!questionsRes.ok) {
          throw new Error("Failed to fetch questions");
        }

        const questionsData = await questionsRes.json();
        const answersData = answersRes.ok ? await answersRes.json() : [];

        const formattedQuestions = questionsData.map((q) => {
          const relatedAnswer = answersData.find(
            (a) => a.question_id === q.id
          );

          return {
            id: q.id,
            exam_id: q.exam_id,
            q: q.question_text || "No question text",
            answer: relatedAnswer?.answer_text || q.answer || "",
            type: q.type || "Essay",
          };
        });

        setQuestions(formattedQuestions);

        if (formattedQuestions.length > 0) {
          setSelectedExamId(
            formattedQuestions[formattedQuestions.length - 1].exam_id
          );
        }
      } catch (err) {
        console.error("Exam data fetch failed:", err);
      }
    };

    fetchExamData();
  }, []);

  const examIds = [
    ...new Set(
      questions
        .map((q) => q.exam_id)
        .filter((id) => id !== null && id !== undefined)
    ),
  ].reverse();

  const selectedQuestions = selectedExamId
    ? questions.filter((q) => q.exam_id === selectedExamId)
    : questions;

  const filteredQuestions = selectedQuestions.slice(0, questionCount);

  const currentQuestions = filteredQuestions.slice(
    page * questionsPerPage,
    page * questionsPerPage + questionsPerPage
  );

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  useEffect(() => {
    if (!started || submitted) return;

    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setSubmitted(true);
          return 0;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, submitted]);

  const startExam = () => {
    setTime(duration * 60);
    setStarted(true);
    setSubmitted(false);
    setAnswers({});
    setPage(0);
  };

  const restartExam = () => {
    setStarted(false);
    setSubmitted(false);
    setAnswers({});
    setPage(0);
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleExamChange = (examId) => {
    setSelectedExamId(Number(examId));
    setStarted(false);
    setSubmitted(false);
    setAnswers({});
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {!started ? (
        <div className="flex justify-center items-center h-[80vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 text-white p-8 rounded-3xl w-full max-w-md space-y-4"
          >
            <h2 className="text-2xl font-bold text-center !text-white">
              AI Exam Settings
            </h2>

            {examIds.length > 0 && (
              <div>
                <label>Select Exam</label>

                <select
                  value={selectedExamId || ""}
                  onChange={(e) => handleExamChange(e.target.value)}
                  className="w-full p-2 mt-1 bg-slate-700 rounded"
                >
                  {examIds.map((id) => (
                    <option key={id} value={id}>
                      Exam {id}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label>Number of Questions</label>

              <input
                type="number"
                min="1"
                max={selectedQuestions.length || 5}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full p-2 mt-1 bg-slate-700 rounded"
              />
            </div>

            <div>
              <label>Duration (minutes)</label>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2 mt-1 bg-slate-700 rounded"
              />
            </div>

            {selectedQuestions.length === 0 && (
              <p className="text-sm text-yellow-300">
                No AI exam questions yet. Go to Home and click Generate Study
                Materials first.
              </p>
            )}

            <button
              onClick={startExam}
              disabled={selectedQuestions.length === 0}
              className="w-full bg-blue-600 disabled:bg-slate-500 py-3 rounded-xl mt-4"
            >
              Start Exam
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">AI Exam</h1>

            <div className="bg-yellow-200 px-4 py-2 rounded">
              ⏱ {formatTime(time)}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {currentQuestions.map((q, i) => {
                const qIndex = page * questionsPerPage + i;

                return (
                  <div
                    key={q.id || qIndex}
                    className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg backdrop-blur"
                  >
                    <h2 className="font-semibold mb-4 !text-white">
                      {qIndex + 1}. {q.q}
                    </h2>

                    <textarea
                      className="w-full p-3 rounded-xl bg-slate-700 text-white"
                      placeholder="Type your answer here"
                      disabled={submitted}
                      value={answers[qIndex] || ""}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          [qIndex]: e.target.value,
                        })
                      }
                    />

                    {submitted && (
                      <div className="mt-4 bg-green-700/40 p-3 rounded-xl">
                        <p className="font-semibold">Suggested Answer:</p>
                        <p className="text-sm mt-1">
                          {q.answer || "No suggested answer saved."}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6 gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </button>

            {page < totalPages - 1 ? (
              <button
                onClick={() => setPage(page + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Next
              </button>
            ) : !submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={restartExam}
                className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700"
              >
                New Exam
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
