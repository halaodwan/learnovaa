import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExamPage() {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(0);

  const [duration, setDuration] = useState(15);
  const [examType, setExamType] = useState("MCQ");
  const [difficulty, setDifficulty] = useState("Easy");
  const [questionCount, setQuestionCount] = useState(5);

  // Questions from backend
  const [questions, setQuestions] = useState([]);

  const questionsPerPage = 2;
  const totalPages = Math.ceil(
    questions.length / questionsPerPage
  );

  // Fetch questions from backend
  useEffect(() => {
    fetch("http://localhost:3000/questions")
      .then((res) => res.json())
      .then((data) => {
        const formattedQuestions = data.map((q) => ({
          q: q.question,
          type: q.type,
          difficulty: q.difficulty,
          options: q.Options?.map((o) => o.text) || [],
          correct: q.correctAnswer,
        }));

        setQuestions(formattedQuestions);
      })
      .catch((err) => console.log(err));
  }, []);

  // Timer
  useEffect(() => {
    if (!started || submitted) return;

    const timer = setInterval(() => {
      setTime((t) => (t > 0 ? t - 1 : 0));
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

  const handleAnswer = (qIndex, optionIndex) => {
    if (submitted) return;

    setAnswers({
      ...answers,
      [qIndex]: optionIndex,
    });
  };

  // Filter questions
  const filteredQuestions = questions
    .filter(
      (q) =>
        q.type === examType &&
        q.difficulty === difficulty
    )
    .slice(0, questionCount);

  const currentQuestions = filteredQuestions.slice(
    page * questionsPerPage,
    page * questionsPerPage + questionsPerPage
  );

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
              Exam Settings
            </h2>

            {/* Exam Type */}
            <div>
              <label>Exam Type</label>

              <div className="flex gap-2 mt-2">
                {["MCQ", "TF", "Essay"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setExamType(t)}
                    className={`flex-1 py-2 rounded-xl transition ${
                      examType === t
                        ? "bg-blue-600"
                        : "bg-slate-800 text-white hover:bg-blue-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label>Difficulty Level</label>

              <div className="flex gap-2 mt-2">
                {["Easy", "Medium", "Hard"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 py-2 rounded-xl transition ${
                      difficulty === lvl
                        ? "bg-blue-600"
                        : "bg-slate-800 text-white hover:bg-blue-700"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label>
                Number of Questions
              </label>

              <input
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(+e.target.value)
                }
                className="w-full p-2 mt-1 bg-slate-700 rounded"
              />
            </div>

            {/* Duration */}
            <div>
              <label>Duration (minutes)</label>

              <input
                type="number"
                value={duration}
                onChange={(e) =>
                  setDuration(+e.target.value)
                }
                className="w-full p-2 mt-1 bg-slate-700 rounded"
              />
            </div>

            <button
              onClick={startExam}
              className="w-full bg-blue-600 py-3 rounded-xl mt-4"
            >
              Start Exam
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">
              Exam ({examType})
            </h1>

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
                const qIndex =
                  page * questionsPerPage + i;

                return (
                  <div
                    key={qIndex}
                    className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg backdrop-blur"
                  >
                    <h2 className="font-semibold mb-4 !text-white">
                      {q.q}
                    </h2>

                    <div className="space-y-3">
                      {q.type === "Essay" ? (
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
                      ) : (
                        q.options.map((opt, idx) => {
                          let color =
                            "bg-slate-700";

                          if (submitted) {
                            if (idx === q.correct)
                              color =
                                "bg-green-600";
                            else if (
                              answers[qIndex] === idx
                            )
                              color =
                                "bg-red-600";
                          } else if (
                            answers[qIndex] === idx
                          ) {
                            color =
                              "bg-blue-600";
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() =>
                                handleAnswer(
                                  qIndex,
                                  idx
                                )
                              }
                              className={`block w-full text-left p-3 rounded-xl mb-2 ${color}`}
                            >
                              {opt}
                            </button>
                          );
                        })
                      )}
                    </div>
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

            {page <
            Math.ceil(
              filteredQuestions.length /
                questionsPerPage
            ) -
              1 ? (
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