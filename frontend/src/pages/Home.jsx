import { useEffect, useState } from "react";
import API from "../api/api";
import CompactMatchCard from "../components/CompactMatchCard";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await API.get("/matches/dashboard");
      setMatches(res.data.matches || []);
    } catch (err) {
      console.error("Match fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Your Match Feed ⚽</h1>

      {loading ? (
        <p>Loading matches...</p>
      ) : matches.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg mb-4">No upcoming matches found for your favorite teams.</p>
          <a
            href="/favorites"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Browse Leagues & Add Favorites
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {matches.map((m) => (
            <CompactMatchCard
              key={m.matchId}
              match={m}
              onReminder={() => alert("Reminder set!")}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
