import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await API.get("/reminders");
      setReminders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await API.post("/reminders/remove", { reminderId: id });
      toast.success("Reminder removed");
      setReminders(reminders.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Failed to remove reminder");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">My Reminders</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : reminders.length === 0 ? (
        <div className="text-center py-10 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-gray-400 text-lg">No reminders set.</p>
          <p className="text-sm text-gray-500 mt-2">
            Go to a match to set a reminder!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map((rem) => (
            <div
              key={rem._id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg relative group"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => deleteReminder(rem._id)}
                  className="text-red-500 hover:text-red-400 bg-slate-800 p-2 rounded-full"
                  title="Remove Reminder"
                >
                  🗑️
                </button>
              </div>

              <div className="mb-3">
                <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded uppercase font-bold">
                  Match Reminder
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-1">
                Reminder set for:
              </p>
              <p className="text-xl font-bold text-white mb-4">
                {format(new Date(rem.reminderTime), "PP p")}
              </p>

              <div className="border-t border-slate-800 pt-3 mt-3">
                <p className="text-sm text-gray-500">Match ID: {rem.matchId}</p>
                {/* ideally we would populate match details here, but for now we show ID or basic info */}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
