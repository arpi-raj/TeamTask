import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import { Plus, Users, Clock, Trash2, UserMinus } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const { authorizationToken, user: currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "", dueDate: "" });
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: authorizationToken },
        }),
        fetch(`http://localhost:5000/api/tasks/project/${id}`, {
          headers: { Authorization: authorizationToken },
        }),
      ]);

      if (projRes.ok) {
        const projData = await projRes.json();
        setProject(projData.project);
      }
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id, authorizationToken]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ ...newTask, project: id }),
      });

      if (response.ok) {
        setShowTaskForm(false);
        setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
        fetchProjectData();
      } else {
        const data = await response.json();
        alert(data.msg || "Failed to create task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ email: newMemberEmail, role: "Member" }),
      });

      if (response.ok) {
        setShowMemberForm(false);
        setNewMemberEmail("");
        fetchProjectData();
      } else {
        const data = await response.json();
        alert(data.msg || "Failed to add member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });
      if (response.ok) {
        fetchProjectData();
      } else {
        const data = await response.json();
        alert(data.msg || "Failed to delete task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}/members/${userId}`, {
        method: "DELETE",
        headers: { Authorization: authorizationToken },
      });
      if (response.ok) {
        fetchProjectData();
      } else {
        const data = await response.json();
        alert(data.msg || "Failed to remove member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-white">Loading project details...</div>;
  if (!project) return <div className="text-white">Project not found.</div>;

  const myRole = project.members.find(m => m.user._id === currentUser._id)?.role;
  const isAdmin = myRole === "Admin";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="glass-card p-8 border-t-4 border-t-primary">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
            <p className="text-gray-400 max-w-2xl">{project.description || "No description."}</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium text-white">
              Role: {myRole}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Tasks</h2>
            {isAdmin && (
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="glass-button py-1.5 px-4 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Task
              </button>
            )}
          </div>

          {showTaskForm && isAdmin && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">New Task</h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Title</label>
                  <input
                    type="text" required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="glass-input h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Assign To</label>
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      className="glass-input bg-card appearance-none"
                    >
                      <option value="">Unassigned</option>
                      {project.members.map((m) => (
                        <option key={m.user._id} value={m.user._id}>
                          {m.user.username} ({m.user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="glass-input bg-card"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowTaskForm(false)} className="glass-button-secondary py-1.5">Cancel</button>
                  <button type="submit" className="glass-button py-1.5">Save Task</button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task._id} className="glass-card p-5 flex items-center justify-between border-l-4 border-l-primary hover:bg-white/5">
                <div>
                  <h4 className="font-bold text-white text-lg">{task.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    {task.assignedTo && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {task.assignedTo.username}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    task.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : task.status === "In Progress" ? "bg-accent/10 text-accent border-accent/20"
                    : task.status === "Overdue" ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  }`}>
                    {task.status}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-1 text-gray-500 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
               <div className="text-center py-10 text-gray-400 border border-dashed border-white/10 rounded-xl">
                 No tasks created yet.
               </div>
            )}
          </div>
        </div>

        {}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Team</h2>
            {isAdmin && (
              <button
                onClick={() => setShowMemberForm(!showMemberForm)}
                className="glass-button-secondary py-1 px-3 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            )}
          </div>

          {showMemberForm && isAdmin && (
            <div className="glass-card p-5">
              <form onSubmit={handleAddMember} className="space-y-3">
                <input
                  type="email" required placeholder="User Email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="glass-input text-sm py-1.5"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowMemberForm(false)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" className="glass-button py-1 px-3 text-xs">Add Member</button>
                </div>
              </form>
            </div>
          )}

          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-white/10">
              {project.members.map((member) => (
                <div key={member.user._id} className="p-4 flex items-center justify-between hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {member.user.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{member.user.username}</p>
                      <p className="text-xs text-gray-500">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${member.role === 'Admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-300'}`}>
                      {member.role}
                    </span>
                    {isAdmin && member.user._id !== currentUser._id && (
                      <button
                        onClick={() => handleRemoveMember(member.user._id)}
                        className="p-1 text-gray-500 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                        title="Remove Member"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
