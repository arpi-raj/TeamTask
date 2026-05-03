import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store/auth";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import Tasks from "./components/Tasks";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";function App() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-background">
        {isLoggedIn && <Sidebar />}
        <main className={`flex-1 transition-all ${isLoggedIn ? "ml-64" : ""}`}>
          <div className="p-8 h-full">
            <Routes>
              {isLoggedIn ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/register" />} />
                </>
              )}
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
