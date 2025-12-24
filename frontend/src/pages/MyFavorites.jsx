import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/api";
import toast from "react-hot-toast";
import ReminderSettingsForm from "../components/ReminderSettingsForm";

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamSettings, setTeamSettings] = useState(null);
  const [settingLoading, setSettingLoading] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await API.get("/users/my-favorites");
      // Combine all lists into one
      const allFavs = [
        ...res.data.public,
        ...res.data.private
      ];
      setFavorites(allFavs);
    } catch (err) {
      console.error("Favorite fetch error", err);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (teamId, type) => {
    if (!window.confirm("Are you sure you want to remove this team?")) return;
    try {
      await API.post("/users/favorites/remove", { teamId, type });
      toast.success("Removed from favorites");
      loadFavorites();
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const toggleType = async (team, currentType) => {
    const newType = currentType === "public" ? "private" : "public";
    try {
      // We can use addFavorite to switch types because the backend logic 
      // removes from all lists before adding to the new one.
      await API.post("/users/favorites/add", {
        teamId: team.teamId,
        leagueId: team.leagueId,
        type: newType
      });
      toast.success(`Moved to ${newType} favorites`);
      loadFavorites();
    } catch (err) {
      toast.error("Failed to change type");
    }
  };

  const openSettings = (team) => {
    setSelectedTeam(team);
    // Use existing team settings OR default structure
    setTeamSettings(team.reminderSettings || {
      enabled: true, // If null, we default to enabled=true for UI, but backend handles inherit logic? 
      // Actually backend defaults enabled: null. If user opens this, they are effectively "Setting" it.
      // So we should check if slots exist.
      slots: [
        { id: 1, minutesBefore: 60, deliveryMethod: "email", enabled: true },
        { id: 2, minutesBefore: 30, deliveryMethod: "push", enabled: false },
        { id: 3, minutesBefore: 15, deliveryMethod: "push", enabled: false }
      ]
    });
  };

  const saveTeamSettings = async () => {
    if (!selectedTeam) return;
    setSettingLoading(true);
    try {
      await API.post("/reminders/team-settings", {
        teamId: selectedTeam.teamId,
        reminderSettings: teamSettings
      });
      toast.success(`Settings saved for ${selectedTeam.name}`);
      setSelectedTeam(null);
      loadFavorites(); // Reload to get updated settings
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSettingLoading(false);
    }
  };

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No favorite teams yet.</p>
          <a href="/favorites" className="text-blue-400 hover:underline mt-2 inline-block">Browse Leagues to add some!</a>
        </div>
      ) : (
        <div className="grid gap-4">
          {favorites.map((fav) => (
            <div
              key={`${fav.teamId}-${fav.type}`}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:border-slate-700 transition"
            >
              {/* Team Info */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center p-2 flex-shrink-0">
                  <img
                    src={fav.crest}
                    alt={fav.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => e.target.src = "https://via.placeholder.com/150?text=No+Logo"}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{fav.name}</h3>
                  <p className="text-gray-400 text-sm">{fav.leagueName}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${fav.type === "public"
                    ? "bg-green-900/30 text-green-400 border border-green-800"
                    : "bg-purple-900/30 text-purple-400 border border-purple-800"
                    }`}
                >
                  {fav.type}
                </span>

                <button
                  onClick={() => toggleType(fav, fav.type)}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition"
                >
                  Make {fav.type === "public" ? "Private" : "Public"}
                </button>

                <button
                  onClick={() => openSettings(fav)}
                  className="text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition flex items-center gap-2"
                >
                  🔔 Settings
                </button>

                <button
                  onClick={() => removeFavorite(fav.teamId, fav.type)}
                  className="text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reminder Settings Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-700 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <img src={selectedTeam.crest} className="w-8 h-8 object-contain" alt="" />
                {selectedTeam.name} Alerts
              </h2>
              <button
                onClick={() => setSelectedTeam(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <ReminderSettingsForm
              settings={teamSettings}
              onChange={setTeamSettings}
              disabled={settingLoading}
              title="Team Specific Rules"
              description="These settings override your Global Defaults for this team."
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-4 py-2 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveTeamSettings}
                disabled={settingLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {settingLoading ? "Saving..." : "Save Rules"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
