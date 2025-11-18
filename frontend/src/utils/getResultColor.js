export default function getResultColor(status, homeScore, awayScore, isHomeTeam) {
  if (status !== "FINISHED" && status !== "FINISHED_AFTER_PENALTIES" && status !== "FINISHED_AFTER_EXTRA_TIME")
    return "bg-slate-600";

  const home = homeScore;
  const away = awayScore;

  let win = isHomeTeam ? home > away : away > home;
  let loss = isHomeTeam ? home < away : away < home;
  let draw = home === away;

  if (win) return "bg-green-600";
  if (loss) return "bg-red-600";
  if (draw) return "bg-yellow-500";

  return "bg-gray-600";
}
