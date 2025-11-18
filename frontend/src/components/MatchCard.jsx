import WatchProviders from "./WatchProviders";

export default function MatchCard({ match, onReminder }) {
  return (
    <div className="bg-slate-900 p-4 rounded-2xl mb-4 shadow-lg border border-slate-800 text-sm md:text-base">

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
        {/* WATCH PROVIDERS */}
        <WatchProviders matchId={match.matchId} />

      {/* ACTIONS */}
      <button
        onClick={onReminder}
        className="mt-3 w-full p-2 bg-blue-600 rounded-xl hover:bg-blue-700"
      >
        Set Reminder
      </button>
    </div>
  );
}
