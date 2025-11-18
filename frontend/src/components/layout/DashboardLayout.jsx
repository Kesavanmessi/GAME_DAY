import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex pb-20 md:pb-0">

      {/* LEFT SIDEBAR */}
      <aside className="w-60 bg-slate-900 border-r border-slate-800 p-5 hidden md:block">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">GameDay ⚽</h1>

        <nav className="space-y-3">
          <Link className="block p-2 hover:bg-slate-800 rounded-lg" to="/">Dashboard</Link>
          <Link className="block p-2 hover:bg-slate-800 rounded-lg" to="/favorites">Favorites</Link>
          <Link className="block p-2 hover:bg-slate-800 rounded-lg" to="/friends">Friends</Link>
          <Link className="block p-2 hover:bg-slate-800 rounded-lg" to="/reminders">Reminders</Link>
          <Link className="block p-2 hover:bg-slate-800 rounded-lg" to="/ai">Ask AI</Link>
          <Link className="block p-2 hover:bg-slate-800 rounded-lg" to="/favorites/my">
  My Favorite Teams
</Link>
<Link className="block p-2 hover:bg-slate-800 rounded-lg" to="/friends">
  Friends
</Link>
<Link className="block p-2 hover:bg-slate-800 rounded-lg" to="/profile">
  Profile Settings
</Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>

    </div>
  );
}
