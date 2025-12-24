import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NotificationBell from "../NotificationBell";
import Header from '../Header';
import { FaBars, FaTimes } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Add Favorites", path: "/favorites" },
    { name: "Friends", path: "/friends" },
    { name: "Reminders", path: "/reminders" },
    { name: "Ask AI", path: "/ai" },
    { name: "My Favorite Teams", path: "/favorites/my" },
    { name: "Profile Settings", path: "/profile" },
  ];

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex overflow-hidden">

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-5 
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 flex flex-col
        `}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-400">GameDay ⚽</h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                block p-3 rounded-lg transition-colors
                ${location.pathname === link.path
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"}
              `}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* HEADER AREA */}
        <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <FaBars size={24} />
            </button>
            <div className="md:hidden">
              <span className="font-bold text-lg">GameDay</span>
            </div>
            <div className="hidden md:block">
              <Header title="GameDay Dashboard" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
