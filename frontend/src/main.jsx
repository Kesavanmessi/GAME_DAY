import { useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";

export default function MatchCard({ match }) {
  const [open, setOpen] = useState(false);

  const reminderOptions = [
    { label: "5 Hours Before", minutes: 5 * 60 },
    { label: "3 Hours Before", minutes: 3 * 60 },
    { label: "1 Hour Before", minutes: 60 },
    { label: "30 Minutes Before", minutes: 30 },
  ];

  const setReminder = async (minutesBefore) => {
    try {
      const matchStart = new Date(match.utcDate);
      const reminderTime = new Date(matchStart - minutesBefore * 60 * 1000);

      const res = await API.post("/reminders/add", {
        matchId: match.matchId,
        reminderTime: reminderTime.toISOString(),
      });

      toast.success(res.data.message || "Reminder Set!");
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set reminder");
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-2xl mb-4 shadow-lg border border-slate-800">

      {/* TEAMS */}
      <div className="flex justify-between text-lg font-semibold">
        <span>{match.homeTeam.name}</span>
        <span className="text-blue-400">VS</span>
        <span>{match.awayTeam.name}</span>
      </div>

      {/* TIME */}
      <div className="text-gray-400 mt-2">
        {new Date(match.utcDate).toLocaleString()}
      </div>

      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-full p-2 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
      >
        Set Reminder
      </button>

      {/* POPUP MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-slate-800 p-5 rounded-xl w-80 border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Choose Reminder Time</h2>

            {reminderOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setReminder(opt.minutes)}
                className="w-full p-2 mb-2 rounded-lg bg-blue-500 hover:bg-blue-600"
              >
                {opt.label}
              </button>
            ))}

            <button
              onClick={() => setOpen(false)}
              className="w-full p-2 mt-3 rounded-lg bg-slate-600 hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
