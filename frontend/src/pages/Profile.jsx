import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, loadUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    location: "",
    timezone: "",
    reminderSettings: {
      enabled: true,
      slots: [
        { id: 1, minutesBefore: 60, deliveryMethod: "email", enabled: true },
        { id: 2, minutesBefore: 30, deliveryMethod: "push", enabled: false },
        { id: 3, minutesBefore: 15, deliveryMethod: "push", enabled: false }
      ]
    }
  });

  const [usernameAvailable, setUsernameAvailable] = useState(true);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        username: user.username || "",
        location: user.location || "",
        timezone: user.timezone || "Asia/Kolkata",
        timezone: user.timezone || "Asia/Kolkata",
        reminderSettings: user.reminderSettings || {
          enabled: true,
          slots: [
            { id: 1, minutesBefore: 60, deliveryMethod: "email", enabled: true },
            { id: 2, minutesBefore: 30, deliveryMethod: "push", enabled: false },
            { id: 3, minutesBefore: 15, deliveryMethod: "push", enabled: false }
          ]
        }
      });
    }
  }, [user]);

  const checkUsername = async (val) => {
    if (val === user.username) {
      setUsernameAvailable(true);
      return;
    }
    if (val.length < 5) {
      setUsernameAvailable(false);
      return;
    }
    try {
      const res = await API.post("/users/check-username", { username: val });
      setUsernameAvailable(res.data.available);
    } catch (err) {
      setUsernameAvailable(false);
    }
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value.replace(/\s/g, "").toLowerCase();
    setForm({ ...form, username: val });
    checkUsername(val);
  };

  const updateProfile = async () => {
    if (!usernameAvailable) return toast.error("Username not available");

    setLoading(true);
    try {
      // Construct payload matching User model structure
      const payload = {
        name: form.name,
        username: form.username,
        location: form.location,
        timezone: form.timezone,
        reminderSettings: form.reminderSettings
      };

      await API.post("/users/update", payload);
      toast.success("Profile updated!");
      await loadUser();
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm({ ...form, location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}` });
        // Auto-detect timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setForm(prev => ({ ...prev, timezone: tz }));
        toast.success("Location & Timezone detected!");
      },
      (err) => toast.error("Failed to get location")
    );
  };

  if (!user) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">Profile Settings</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 max-w-3xl">

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800">
          <img
            src={user.picture || "https://ui-avatars.com/api/?name=" + user.name}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-blue-500"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-slate-400">@{user.username || "no-username"}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Full Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
            <input
              disabled={!isEditing}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-50"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email (Read Only) */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              disabled
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg opacity-50 cursor-not-allowed"
              value={user.email}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Username</label>
            <div className="relative">
              <input
                disabled={!isEditing}
                className={`w-full p-3 bg-slate-800 border rounded-lg disabled:opacity-50
                  ${isEditing ? (usernameAvailable ? "border-green-500/50" : "border-red-500/50") : "border-slate-700"}
                `}
                value={form.username}
                onChange={handleUsernameChange}
              />
              {isEditing && (
                <span className="absolute right-3 top-3 text-xs">
                  {usernameAvailable ? "✅" : "❌"}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Location</label>
            <div className="relative">
              <input
                disabled={!isEditing}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-50 pr-10"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              {isEditing && (
                <button
                  onClick={detectLocation}
                  className="absolute right-2 top-2 text-xl hover:scale-110 transition"
                  title="Auto Detect Location & Timezone"
                >
                  📍
                </button>
              )}
            </div>
          </div>

          {/* Timezone */}
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400 mb-1">Timezone</label>
            <select
              disabled={!isEditing}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-50"
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
              {/* Add more common timezones or fetch list */}
            </select>
          </div>

          {/* Global Reminder Settings */}
          <div className="md:col-span-2 mt-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            {/* Master Switch */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700/50">
              <div>
                <h3 className="text-white font-bold text-lg">Global Match Alerts</h3>
                <p className="text-sm text-slate-400">Automatically set reminders for ALL favorite team matches.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!isEditing}
                  className="sr-only peer"
                  className="sr-only peer"
                  checked={form.reminderSettings?.enabled ?? true}
                  onChange={(e) => setForm({
                    ...form,
                    reminderSettings: {
                      ...(form.reminderSettings || { slots: [] }),
                      enabled: e.target.checked
                    }
                  })}
                />
                <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Slots Configuration */}
            <div className={`space-y-4 ${!form.reminderSettings?.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {(form.reminderSettings?.slots || []).map((slot, index) => (
                <div key={slot.id} className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 font-mono text-sm w-8">#{slot.id}</span>

                  {/* Time Selector */}
                  <select
                    disabled={!isEditing}
                    value={slot.minutesBefore}
                    onChange={(e) => {
                      const newSlots = [...form.reminderSettings.slots];
                      newSlots[index].minutesBefore = parseInt(e.target.value);
                      setForm({ ...form, reminderSettings: { ...form.reminderSettings, slots: newSlots } });
                    }}
                    className="bg-slate-800 border border-slate-700 rounded text-sm p-1"
                  >
                    <option value={15}>15 Mins Before</option>
                    <option value={30}>30 Mins Before</option>
                    <option value={60}>1 Hour Before</option>
                    <option value={1440}>24 Hours Before</option>
                  </select>

                  {/* Method Toggle */}
                  <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
                    <button
                      disabled={!isEditing}
                      onClick={() => {
                        const newSlots = [...form.reminderSettings.slots];
                        newSlots[index].deliveryMethod = 'email';
                        setForm({ ...form, reminderSettings: { ...form.reminderSettings, slots: newSlots } });
                      }}
                      className={`px-3 py-1 text-xs rounded transition ${slot.deliveryMethod === 'email' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Email
                    </button>
                    <button
                      disabled={!isEditing}
                      onClick={() => {
                        const newSlots = [...form.reminderSettings.slots];
                        newSlots[index].deliveryMethod = 'push';
                        setForm({ ...form, reminderSettings: { ...form.reminderSettings, slots: newSlots } });
                      }}
                      className={`px-3 py-1 text-xs rounded transition ${slot.deliveryMethod === 'push' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Push
                    </button>
                  </div>

                  {/* Enable/Disable Slot */}
                  <div className="ml-auto">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-slate-500">{slot.enabled ? 'ON' : 'OFF'}</span>
                      <input
                        type="checkbox"
                        checked={slot.enabled}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const newSlots = [...form.reminderSettings.slots];
                          newSlots[index].enabled = e.target.checked;
                          setForm({ ...form, reminderSettings: { ...form.reminderSettings, slots: newSlots } });
                        }}
                        className="accent-green-500"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-8 flex gap-4">
            <button
              onClick={updateProfile}
              disabled={loading || !usernameAvailable}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setForm({ // Reset form
                  name: user.name,
                  username: user.username,
                  location: user.location,
                  timezone: user.timezone,
                });
              }}
              className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
