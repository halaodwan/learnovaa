import { useState } from "react";
import {
  BookOpen, Layers, ClipboardList, Clock, CalendarDays,
  FileText, Play, Plus, Check, Trash2
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Summaries / Explanations", value: 14, icon: BookOpen, color: "bg-edu-info/10 text-edu-info" },
  { label: "Flashcards", value: 48, icon: Layers, color: "bg-edu-success/10 text-edu-success" },
  { label: "Exams Taken", value: 7, icon: ClipboardList, color: "bg-edu-warning/10 text-edu-warning" },
  { label: "Study Hours Today", value: "2.5h", icon: Clock, color: "bg-primary/10 text-primary" },
  { label: "Study Hours This Week", value: "12h", icon: CalendarDays, color: "bg-destructive/10 text-destructive" },
];

const quickLinks = [
  { label: "Latest Exams", icon: ClipboardList, path: "/exams" },
  { label: "Latest Summaries", icon: FileText, path: "/explanations" },
  { label: "Latest Flashcards", icon: Layers, path: "/flashcards" },
  { label: "Start Study Session", icon: Play, path: "/" },
];

const initialTasks = [
  { id: 1, title: "Review Biology Ch. 5", time: "10:00 AM", done: false },
  { id: 2, title: "Complete Physics Flashcards", time: "12:00 PM", done: true },
  { id: 3, title: "Take History Practice Exam", time: "3:00 PM", done: false },
  { id: 4, title: "Read Chemistry Notes", time: "5:00 PM", done: false },
];

const Dashboard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("12:00");
  const [showAdd, setShowAdd] = useState(false);

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), title: newTask, time: newTime, done: false },
    ]);
    setNewTask("");
    setShowAdd(false);
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="animate-fade-in p-4">
      <h1 className="text-2xl mb-6">📊 Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mx-auto mb-2`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <h3 className="text-lg mb-3">⚡ Quick Access</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(({ label, icon: Icon, path }) => (
            <Link
              key={label}
              to={path}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-secondary transition-colors text-sm font-medium text-foreground"
            >
              <Icon className="w-4 h-4 text-primary" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">✅ Task List</h3>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {showAdd && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task title..."
              className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={addTask}
              className="px-4 py-2 rounded-lg bg-edu-success text-edu-success-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                task.done ? "bg-edu-success/5" : "bg-muted/50 hover:bg-muted"
              }`}
            >
              <button onClick={() => toggleTask(task.id)}>
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    task.done
                      ? "bg-edu-success border-edu-success"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {task.done && <Check className="w-3 h-3 text-edu-success-foreground" />}
                </div>
              </button>

              <div className="flex-1">
                <p className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {task.title}
                </p>
              </div>

              <span className="text-xs text-muted-foreground">{task.time}</span>

              <button
                onClick={() => removeTask(task.id)}
                className="p-1 rounded hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;