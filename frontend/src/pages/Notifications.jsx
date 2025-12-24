import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/api";
import toast from "react-hot-toast";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const res = await API.get("/notifications");
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (id) => {
        try {
            await API.post(`/notifications/read/${id}`);
            // update local state
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await API.post("/notifications/read-all");
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            toast.success("All marked as read");
        } catch (err) {
            toast.error("Failed");
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-400">Notifications</h1>
                {notifications.length > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : notifications.length === 0 ? (
                <div className="text-center py-10 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-gray-400">No notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div
                            key={n._id}
                            onClick={() => !n.isRead && markRead(n._id)}
                            className={`p-4 rounded-xl border border-slate-800 cursor-pointer transition ${n.isRead ? "bg-slate-900 opacity-70" : "bg-slate-800 border-blue-500/30"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <p className={`${n.isRead ? "text-gray-400" : "text-white font-semibold"}`}>
                                    {n.message}
                                </p>
                                {!n.isRead && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
