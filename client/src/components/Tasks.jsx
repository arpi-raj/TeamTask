import { useState, useEffect } from "react";
import { useAuth } from "../store/auth";

const Tasks = () => {
  const { authorizationToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [authorizationToken]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-white">Loading your tasks...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
        <p className="text-gray-400">View and update the status of your assigned tasks.</p>
      </header>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="glass-card p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{task.title}</h3>
              <p className="text-gray-400 text-sm">{task.description}</p>
              <div className="text-xs text-primary mt-2">
                Project: {task.project?.name}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
                className={`glass-input !py-1 text-sm font-medium border
                  ${task.status === "Completed" ? "text-green-400 border-green-500/30" : ""}
                  ${task.status === "In Progress" ? "text-accent border-accent/30" : ""}
                `}
              >
                <option value="Pending" className="text-black">Pending</option>
                <option value="In Progress" className="text-black">In Progress</option>
                <option value="Completed" className="text-black">Completed</option>
                <option value="Overdue" className="text-black">Overdue</option>
              </select>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-16 glass-card">
            <p className="text-gray-400">You have no assigned tasks. Take a break!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
