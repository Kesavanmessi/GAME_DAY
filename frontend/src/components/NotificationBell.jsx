import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import API from "../api/api";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data.notifications || []);
    const unread = res.data.notifications.filter((n) => !n.isRead).length;
    setCount(unread);
  };

  const markRead = async (id) => {
    await API.post(`/notifications/read/${id}`);
    load();
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-white"
      >
        <FaBell size={24} />

        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-3 z-50">

          {notifications.length === 0 ? (
            <p className="text-gray-400 text-sm">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 mb-2 rounded-lg cursor-pointer ${n.isRead ? "bg-slate-800" : "bg-slate-700"
                  }`}
                onClick={() => markRead(n._id)}
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
          <div className="border-t border-slate-700 pt-2 mt-2 text-center">
            <a href="/notifications" className="text-blue-400 text-sm hover:underline">
              View All Notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
