import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: "📊", 
      admin: false 
    },
    { 
      path: "/members", 
      label: "Members", 
      icon: "👥", 
      admin: false 
    },
    { 
      path: "/members/add", 
      label: "Add Member", 
      icon: "➕", 
      admin: false 
    },
    { 
      path: "/users", 
      label: "Users", 
      icon: "👤", 
      admin: true 
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🏋️</span>
              <h1 className="text-xl font-bold">Gym Manager</h1>
            </div>
          )}
          {!sidebarOpen && (
            <span className="text-2xl mx-auto">🏋️</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-gray-300 transition ml-auto"
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            // Hide admin-only items from non-admin users
            if (item.admin && !isAdmin) return null;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                  isActive(item.path)
                    ? "bg-blue-600 shadow-lg"
                    : "hover:bg-gray-700"
                }`}
                title={!sidebarOpen ? item.label : ""}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Profile Link */}
        <div className="p-4 border-t border-gray-700">
          <Link
            to="/profile"
            className={`flex items-center space-x-3 p-3 rounded-lg transition ${
              isActive("/profile")
                ? "bg-blue-600 shadow-lg"
                : "hover:bg-gray-700"
            }`}
            title={!sidebarOpen ? "Profile" : ""}
          >
            <span className="text-xl">⚙️</span>
            {sidebarOpen && <span className="font-medium">Profile</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Page Title */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {menuItems.find((item) => item.path === location.pathname)?.label ||
                  "Gym Management System"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {user?.name}!
              </p>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    ⚙️ Profile Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 Gym Manager. All rights reserved.</p>
            <p>Version 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;