import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { Plus, Users, ArrowRight, Trash2 } from "lucide-react";

const Projects = () => {
  const { authorizationToken, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        headers: {
          Authorization: authorizationToken,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [authorizationToken]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        setShowCreate(false);
        setNewProject({ name: "", description: "" });
        fetchProjects(); 
      } else {
        alert("Failed to create project");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? All tasks will be lost.")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        fetchProjects();
      } else {
        const data = await response.json();
        alert(data.msg || "Failed to delete project");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-white">Loading projects...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your team's projects and workspaces.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="glass-button flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </header>

      {showCreate && (
        <div className="glass-card p-6 border-t-4 border-t-primary">
          <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="glass-input"
                placeholder="e.g., Website Redesign"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="glass-input min-h-[100px]"
                placeholder="What is this project about?"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="glass-button-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="glass-button">
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isAdmin = project.members.find(m => m.user._id === user._id)?.role === "Admin";
          return (
            <div key={project._id} className="glass-card p-6 flex flex-col hover:border-primary/50 transition-colors relative group">
              {isAdmin && (
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Project"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description || "No description provided."}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{project.members.length} member(s)</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <Link
                  to={`/projects/${project._id}`}
                  className="flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-medium"
                >
                  View Project <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && !showCreate && (
          <div className="col-span-full text-center py-12 text-gray-400 border border-dashed border-white/20 rounded-2xl">
            You don't have any projects yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
