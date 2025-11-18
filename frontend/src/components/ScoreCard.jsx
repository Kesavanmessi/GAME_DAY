import getResultColor from "../utils/getResultColor";

export default function ScoreCard({ match, teamId }) {
  const isHome = match.homeTeam.id === teamId;

  const home = match.score.fullTime.home;
  const away = match.score.fullTime.away;

  const color = getResultColor(match.status, home, away, isHome);

  const opponent = isHome ? match.awayTeam.name : match.homeTeam.name;

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        
        <span className="font-semibold">{opponent}</span>

        <div className={`px-3 py-1 rounded-lg text-white text-sm ${color}`}>
          {home} - {away}
        </div>
      </div>

      <p className="text-gray-400 mt-1 text-sm">
        {new Date(match.utcDate).toLocaleDateString()}
      </p>
    </div>
  );
}
