import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { authorizationToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/my-tasks", {
          headers: {
            Authorization: authorizationToken,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [authorizationToken]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    pending: tasks.filter((t) => t.status === "Pending" || t.status === "In Progress").length,
    overdue: tasks.filter((t) => t.status === "Overdue").length,
  };

  if (loading) {
    return <div className="text-white">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's an overview of your tasks.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-300">Total Tasks</h3>
          </div>
          <p className="text-4xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-accent">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-300">In Progress</h3>
            <Clock className="text-accent w-6 h-6" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.pending}</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-300">Completed</h3>
            <CheckCircle2 className="text-green-500 w-6 h-6" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.completed}</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-destructive">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-300">Overdue</h3>
            <AlertCircle className="text-destructive w-6 h-6" />
          </div>
          <p className="text-4xl font-bold text-white">{stats.overdue}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Tasks</h2>
        <div className="glass-card overflow-hidden">
          {tasks.length > 0 ? (
            <div className="divide-y divide-white/10">
              {tasks.slice(0, 5).map((task) => (
                <div key={task._id} className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-white">{task.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">Project: {task.project?.name || "Unknown"}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        task.status === "Completed"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : task.status === "In Progress"
                          ? "bg-accent/10 text-accent border-accent/20"
                          : task.status === "Overdue"
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No tasks assigned yet. Enjoy your free time!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
