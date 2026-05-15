import { useEffect, useState } from "react";
import {
  BookOpen,
  Layers,
  ClipboardList,
  Clock,
  CalendarDays,
  FileText,
  Play,
  Plus,
  Check,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000";

const quickLinks = [
  { label: "Latest Exams", icon: ClipboardList, path: "/exams" },
  { label: "Latest Summaries", icon: FileText, path: "/explanations" },
  { label: "Latest Flashcards", icon: Layers, path: "/flashcards" },
  { label: "Start Study Session", icon: Play, path: "/" },
];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("12:00");
  const [showAdd, setShowAdd] = useState(false);

  const [contentsCount, setContentsCount] = useState(0);
  const [flashcardsCount, setFlashcardsCount] = useState(0);
  const [examsCount, setExamsCount] = useState(0);

  const [studyToday, setStudyToday] = useState(0);
  const [studyWeek, setStudyWeek] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, contentsRes, flashcardsRes, examsRes, statsRes] =
          await Promise.all([
            fetch(`${API_URL}/tasks`),
            fetch(`${API_URL}/contents`),
            fetch(`${API_URL}/flashcards`),
            fetch(`${API_URL}/exams`),
            fetch(`${API_URL}/stats`),
          ]);

        const tasksData = await tasksRes.json();
        const contentsData = await contentsRes.json();
        const flashcardsData = await flashcardsRes.json();
        const examsData = await examsRes.json();
        const statsData = await statsRes.json();

        setTasks(Array.isArray(tasksData) ? tasksData : tasksData?.data || []);

        setContentsCount(
          Array.isArray(contentsData)
            ? contentsData.length
            : contentsData?.data?.length || 0
        );

        setFlashcardsCount(
          Array.isArray(flashcardsData)
            ? flashcardsData.length
            : flashcardsData?.data?.length || 0
        );

        setExamsCount(
          Array.isArray(examsData)
            ? examsData.length
            : examsData?.data?.length || 0
        );

        setStudyToday(statsData?.today || 0);
        setStudyWeek(statsData?.week || 0);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchData();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.trim(),
          time: newTime,
          done: false,
        }),
      });

      const saved = await res.json();

      if (!res.ok) {
        console.error(saved);
        return;
      }

      const savedTask = saved?.data || saved;

      setTasks((prev) => [...prev, savedTask]);
      setNewTask("");
      setNewTime("12:00");
      setShowAdd(false);
    } catch (err) {
      console.error("Add task error:", err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !task.done }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    } catch (err) {
      console.error("Toggle task error:", err);
    }
  };

  const removeTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        return;
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  const stats = [
    {
      label: "Summaries",
      value: contentsCount,
      icon: BookOpen,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Flashcards",
      value: flashcardsCount,
      icon: Layers,
      color: "bg-green-500/10 text-green-500",
    },
    {
      label: "Exams",
      value: examsCount,
      icon: ClipboardList,
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      label: "Study Today",
      value: `${studyToday}h`,
      icon: Clock,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      label: "Study Week",
      value: `${studyWeek}h`,
      icon: CalendarDays,
      color: "bg-red-500/10 text-red-500",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <div key={s.label} className="p-4 rounded-xl shadow bg-white">
              <div className={`p-2 rounded w-fit ${s.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white rounded-xl shadow mb-6">
        <h2 className="font-bold mb-3">Quick Access</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((q) => {
            const Icon = q.icon;

            return (
              <Link
                key={q.label}
                to={q.path}
                className="p-3 border rounded flex items-center gap-2 hover:bg-gray-50"
              >
                <Icon size={16} />
                {q.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold">Tasks</h2>

          <button
            onClick={() => setShowAdd((prev) => !prev)}
            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center"
          >
            <Plus size={16} />
          </button>
        </div>

        {showAdd && (
          <div className="flex gap-2 mb-4">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task..."
              className="border p-2 flex-1 rounded"
            />

            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="border p-2 rounded"
            />

            <button
              onClick={addTask}
              className="bg-green-500 text-white px-3 rounded"
            >
              Add
            </button>
          </div>
        )}

        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks yet.</p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="flex justify-between p-2 border-b">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleTask(t.id)}
              >
                <div
                  className={`w-5 h-5 border flex items-center justify-center rounded ${
                    t.done ? "bg-green-500 text-white" : ""
                  }`}
                >
                  {t.done && <Check size={14} />}
                </div>

                <span className={t.done ? "line-through text-gray-400" : ""}>
                  {t.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{t.time}</span>

                <button
                  onClick={() => removeTask(t.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
