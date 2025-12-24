import { useEffect, useState } from "react";
import API from "../api/api";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Link } from "react-router-dom";

export default function Favorites() {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const res = await API.get("/leagues/all");
      setLeagues(res.data.leagues || []);
    } catch (err) {
      console.error("League fetch error", err);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Select Your Favorite Teams</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {leagues.map((lg) => (
          <Link
            key={lg.leagueId || lg.id} // Handle both id formats if necessary
            to={`/favorites/${lg.id}`}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800 transition shadow-lg flex flex-col items-center text-center group"
          >
            <div className="h-32 w-32 mb-4 flex items-center justify-center bg-white/5 rounded-full p-4 group-hover:scale-110 transition-transform">
              <img
                src={lg.logo}
                alt={lg.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{lg.name}</h2>
            <p className="text-gray-400 text-sm">{lg.country}</p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
