import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/api";
import toast from "react-hot-toast";

export default function LeagueTeams() {
  const { leagueId } = useParams();
  const [league, setLeague] = useState(null);

  useEffect(() => {
    fetchLeague();
  }, []);

  const fetchLeague = async () => {
    try {
      const res = await API.get(`/leagues/${leagueId}`);
      setLeague(res.data.league);
    } catch (err) {
      console.error("League error", err);
    }
  };

  const addFavorite = async (teamId, type) => {
    try {
      await API.post("/users/favorites/add", { teamId, leagueId, type });
      toast.success(`Added to ${type} favorites!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (!league) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        {league.name} Clubs
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {league.teams.map((team) => (
          <div
            key={team.teamId}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex flex-col items-center text-center"
          >
            <div className="h-24 w-24 mb-4 flex items-center justify-center bg-white/5 rounded-full p-2">
              <img
                src={team.crest}
                alt={team.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => e.target.src = "https://via.placeholder.com/150?text=No+Logo"}
              />
            </div>

            <h2 className="text-xl font-semibold mb-1 text-white">{team.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{team.shortName || team.tla}</p>

            <div className="w-full space-y-2 mt-auto">
              <button
                onClick={() => addFavorite(team.teamId, "public")}
                className="bg-slate-800 border border-green-600/50 text-green-400 hover:bg-green-600 hover:text-white w-full p-2 rounded-lg transition-colors text-sm font-medium"
              >
                + Public Favorite
              </button>

              <button
                onClick={() => addFavorite(team.teamId, "private")}
                className="bg-slate-800 border border-purple-600/50 text-purple-400 hover:bg-purple-600 hover:text-white w-full p-2 rounded-lg transition-colors text-sm font-medium"
              >
                + Private Favorite
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
