import { useState, useMemo } from "react";
import { Plus, Trash2, Check, Clock, Flag, LogOut, Search } from "lucide-react";

const PRIORITIES = {
  low: { label: "Low", color: "#6B7280", bg: "#F3F4F6" },
  medium: { label: "Medium", color: "#B45309", bg: "#FEF3C7" },
  high: { label: "High", color: "#B91C1C", bg: "#FEE2E2" },
};

const STATUS_COLS = [
  { key: "todo", label: "To do" },
  { key: "doing", label: "In progress" },
  { key: "done", label: "Done" },
];

function seedTasks() {
  return [
    { id: "t1", title: "Draft Q3 roadmap outline", notes: "Focus on auth + sync milestones", status: "todo", priority: "high", due: "2026-06-24" },
    { id: "t2", title: "Review pull request #88", notes: "", status: "todo", priority: "medium", due: "2026-06-22" },
    { id: "t3", title: "Sync with design on empty states", notes: "", status: "doing", priority: "medium", due: "2026-06-23" },
    { id: "t4", title: "Fix mobile nav overlap", notes: "Reported by two users", status: "doing", priority: "high", due: "2026-06-21" },
    { id: "t5", title: "Write onboarding email copy", notes: "", status: "done", priority: "low", due: "2026-06-18" },
  ];
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-[#1F2A24] flex items-center justify-center">
        <span className="text-[#D8E8C8] text-xs font-bold tracking-tight">L</span>
      </div>
      <span className="font-semibold text-[#1F2A24] tracking-tight">Ledger</span>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter an email and password to continue.");
      return;
    }
    setError("");
    onLogin(email.trim());
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F0E6] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="bg-white border border-[#E4DCC8] rounded-2xl p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h1 className="text-xl font-semibold text-[#1F2A24] mb-1">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-[#6B7464] mb-6">
            {mode === "signin" ? "Sign in to see your tasks." : "Set up an account to start tracking work."}
          </p>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#6B7464] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-[#DCD4BE] px-3 py-2.5 text-sm text-[#1F2A24] outline-none focus:border-[#1F2A24] focus:ring-2 focus:ring-[#1F2A24]/10"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7464] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#DCD4BE] px-3 py-2.5 text-sm text-[#1F2A24] outline-none focus:border-[#1F2A24] focus:ring-2 focus:ring-[#1F2A24]/10"
              />
            </div>
            {error && <p className="text-xs text-[#B91C1C]">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#1F2A24] text-[#F4F0E6] text-sm font-medium py-2.5 mt-2 hover:bg-[#2B3930] transition-colors"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <p className="text-xs text-[#6B7464] mt-5 text-center">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-[#1F2A24] font-medium underline underline-offset-2"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
        <p className="text-[11px] text-[#9C9482] text-center mt-5">
          Demo only — auth is simulated, no data leaves this page.
        </p>
      </div>
    </div>
  );
}

function TaskCard({ task, onDelete, onCycleStatus, onPriorityChange }) {
  const p = PRIORITIES[task.priority];
  const overdue = task.status !== "done" && new Date(task.due) < new Date("2026-06-21");
  return (
    <div className="group bg-white border border-[#E4DCC8] rounded-xl p-3.5 hover:border-[#C9BE9F] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => onCycleStatus(task.id)}
          className={`mt-0.5 w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
            task.status === "done"
              ? "bg-[#1F2A24] border-[#1F2A24]"
              : "border-[#C9BE9F] hover:border-[#1F2A24]"
          }`}
          aria-label="Cycle status"
        >
          {task.status === "done" && <Check size={10} className="text-[#F4F0E6]" strokeWidth={3} />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-[#1F2A24] leading-snug ${task.status === "done" ? "line-through opacity-50" : ""}`}>
            {task.title}
          </p>
          {task.notes && <p className="text-xs text-[#6B7464] mt-0.5">{task.notes}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <select
              value={task.priority}
              onChange={(e) => onPriorityChange(task.id, e.target.value)}
              style={{ color: p.color, backgroundColor: p.bg }}
              className="text-[11px] font-medium rounded-md px-1.5 py-0.5 border-none outline-none cursor-pointer"
            >
              {Object.entries(PRIORITIES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <span className={`text-[11px] flex items-center gap-1 ${overdue ? "text-[#B91C1C]" : "text-[#9C9482]"}`}>
              <Clock size={11} /> {task.due}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-[#9C9482] hover:text-[#B91C1C] transition-opacity p-1"
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function NewTaskBar({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("2026-06-25");

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, due, status: "todo", notes: "" });
    setTitle("");
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 bg-white border border-[#E4DCC8] rounded-xl p-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task… e.g. Update API docs"
        className="flex-1 text-sm outline-none px-1 py-1.5 text-[#1F2A24] placeholder:text-[#9C9482]"
      />
      <div className="flex gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="text-xs rounded-lg border border-[#DCD4BE] px-2 py-1.5 text-[#1F2A24] outline-none"
        >
          {Object.entries(PRIORITIES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <input
          type="date"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="text-xs rounded-lg border border-[#DCD4BE] px-2 py-1.5 text-[#1F2A24] outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#1F2A24] text-[#F4F0E6] px-3 py-1.5 text-xs font-medium flex items-center gap-1 hover:bg-[#2B3930] transition-colors"
        >
          <Plus size={14} /> Add
        </button>
      </div>
    </form>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(seedTasks);
  const [query, setQuery] = useState("");
  const [nextId, setNextId] = useState(6);

  const filtered = useMemo(
    () => tasks.filter((t) => t.title.toLowerCase().includes(query.toLowerCase())),
    [tasks, query]
  );

  function addTask(t) {
    setTasks((prev) => [...prev, { ...t, id: "t" + nextId }]);
    setNextId((n) => n + 1);
  }
  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }
  function cycleStatus(id) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const order = ["todo", "doing", "done"];
        const next = order[(order.indexOf(t.status) + 1) % order.length];
        return { ...t, status: next };
      })
    );
  }
  function setPriority(id, priority) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)));
  }

  if (!user) return <LoginScreen onLogin={setUser} />;

  const counts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6]">
      <header className="border-b border-[#E4DCC8] bg-[#F4F0E6]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-[#E4DCC8] rounded-lg px-2.5 py-1.5">
              <Search size={13} className="text-[#9C9482]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks"
                className="text-xs outline-none w-32 text-[#1F2A24] placeholder:text-[#9C9482]"
              />
            </div>
            <span className="text-xs text-[#6B7464] hidden sm:inline">{user}</span>
            <button
              onClick={() => setUser(null)}
              className="text-[#6B7464] hover:text-[#1F2A24] p-1.5 rounded-lg hover:bg-white transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div>
          <h1 className="text-lg font-semibold text-[#1F2A24]">Your tasks</h1>
          <p className="text-xs text-[#6B7464] mt-0.5">
            {counts.todo} to do · {counts.doing} in progress · {counts.done} done
          </p>
        </div>

        <NewTaskBar onAdd={addTask} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATUS_COLS.map((col) => (
            <div key={col.key} className="space-y-2.5">
              <div className="flex items-center gap-2 px-0.5">
                <Flag size={12} className="text-[#9C9482]" />
                <h2 className="text-xs font-semibold text-[#6B7464] uppercase tracking-wide">
                  {col.label}
                </h2>
                <span className="text-[11px] text-[#9C9482]">{counts[col.key]}</span>
              </div>
              <div className="space-y-2.5 min-h-[60px]">
                {filtered
                  .filter((t) => t.status === col.key)
                  .map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onDelete={deleteTask}
                      onCycleStatus={cycleStatus}
                      onPriorityChange={setPriority}
                    />
                  ))}
                {filtered.filter((t) => t.status === col.key).length === 0 && (
                  <p className="text-xs text-[#9C9482] italic px-1">Nothing here yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
