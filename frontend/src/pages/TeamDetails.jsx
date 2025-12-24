import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/api";
import ScoreCard from "../components/ScoreCard";
import WatchProviders from "../components/WatchProviders";

export default function TeamDetails() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadTeam();
    loadMatches();
  }, []);

  const loadTeam = async () => {
    try {
      const res = await API.get(`/leagues/team/${teamId}`);
      setTeam(res.data.team);
    } catch (err) {
      console.error("Team fetch error:", err);
    }
  };

  const loadMatches = async () => {
    try {
      const res = await API.get(`/matches/last5/${teamId}`);
      setMatches(res.data.matches || []);
    } catch (err) {
      console.error("Match fetch error:", err);
    }
  };

  if (!team)
    return <DashboardLayout>Loading team...</DashboardLayout>;

  return (
    <DashboardLayout>
      {/* TEAM NAME */}
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        {team.name}
      </h1>

      {/* LAST 5 MATCHES */}
      <h2 className="text-2xl font-semibold text-gray-300 mb-4">
        Last 5 Matches
      </h2>

      {matches.length === 0 ? (
        <p className="text-gray-500">No recent matches found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {matches.map((m) => (
            <div key={m.matchId} className="space-y-2">
              {/* ScoreCard */}
              <ScoreCard match={m} teamId={parseInt(teamId)} />

              {/* Where to Watch */}
              <WatchProviders matchId={m.matchId} />
            </div>
          ))}

        </div>
      )}
    </DashboardLayout>
  );
}
