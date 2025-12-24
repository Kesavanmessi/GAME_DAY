import React, { useState } from "react";
import WatchProviders from "./WatchProviders";
import API from "../api/api";
import toast from "react-hot-toast";

export default function CompactMatchCard({ match, onReminder }) {
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [reminderLoading, setReminderLoading] = useState(false);

    const dateObj = new Date(match.utcDate);

    // Format Date: "Sat, 27 Dec"
    const dateStr = dateObj.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    // Format Time: "8:30 pm"
    const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).toLowerCase();

    const handleSetReminder = async (minutesBefore) => {
        setReminderLoading(true);
        try {
            const matchTime = new Date(match.utcDate).getTime();
            const reminderTime = new Date(matchTime - minutesBefore * 60000);

            await API.post("/reminders/add", {
                matchId: match.matchId,
                reminderTime: reminderTime.toISOString()
            });

            toast.success(`Reminder set for ${minutesBefore} mins before!`);
            setShowReminderModal(false);
            if (onReminder) onReminder();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to set reminder");
        } finally {
            setReminderLoading(false);
        }
    };


    return (
        <>
            <div className="bg-[#202124] rounded-lg overflow-hidden border border-[#3c4043] hover:bg-[#303134] transition flex group relative">
                {/* Set Reminder Button (Hover) */}
                {/* Set Reminder Pill (Unique Design) */}
                <button
                    onClick={() => setShowReminderModal(true)}
                    className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 
                      bg-black/40 backdrop-blur-md border border-white/10 rounded-full 
                      text-xs font-semibold text-white/80 opacity-0 group-hover:opacity-100 
                      hover:bg-blue-600/90 hover:border-blue-500 hover:text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] 
                      transition-all duration-300 z-10 translate-y-[-5px] group-hover:translate-y-0"
                    title="Get Notified"
                >
                    <span className="text-sm">⚡</span>
                    <span>Notify Me</span>
                </button>

                {/* Left Column: Teams */}
                <div className="flex-1 p-4 flex flex-col justify-center gap-4">
                    {/* Home Team */}
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-300">
                            {match.homeTeam.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-200 truncate">{match.homeTeam.name}</span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-300">
                            {match.awayTeam.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-200 truncate">{match.awayTeam.name}</span>
                    </div>
                </div>

                {/* Right Column: Date/Time (Border Left) */}
                <div className="w-32 border-l border-[#3c4043] flex flex-col items-center justify-center p-2 text-center bg-[#292a2d]">
                    <div className="text-xs text-gray-400 mb-1">{dateStr}</div>
                    <div className="text-sm font-bold text-white">{timeStr}</div>
                </div>
            </div>

            {/* Reminder Modal */}
            {showReminderModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-xl p-6 w-full max-w-sm border border-slate-700 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">Set Reminder 🔔</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Receive a Web Push notification before the match starts.
                            <br />
                            <span className="text-xs text-slate-500">(Max 2 per match, within 24h of kickoff)</span>
                        </p>

                        <div className="space-y-3">
                            {[15, 30, 60].map(mins => (
                                <button
                                    key={mins}
                                    disabled={reminderLoading}
                                    onClick={() => handleSetReminder(mins)}
                                    className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left text-sm flex justify-between items-center transition border border-slate-700"
                                >
                                    <span>{mins} minutes before</span>
                                    <span className="text-slate-500">Push</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowReminderModal(false)}
                            className="mt-6 w-full py-2 text-slate-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
