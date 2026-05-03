import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../store/auth";

const Sidebar = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) return null;

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "My Tasks", path: "/tasks", icon: CheckSquare },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-card rounded-none border-y-0 border-l-0 flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          TaskMaster
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <NavLink
          to="/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
