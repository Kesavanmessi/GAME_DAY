import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function SetUsername() {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [available, setAvailable] = useState(null); // null, true, false
    const navigate = useNavigate();
    const { user, loadUser } = useAuth();

    useEffect(() => {
        if (user?.username) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    const checkAvailability = async (val) => {
        if (val.length < 5) {
            setAvailable(null);
            return;
        }
        try {
            const res = await API.post("/users/check-username", { username: val });
            setAvailable(res.data.available);
        } catch (err) {
            setAvailable(false);
        }
    };

    const handleChange = (e) => {
        const val = e.target.value.replace(/\s/g, "").toLowerCase(); // No spaces, lowercase
        setUsername(val);
        checkAvailability(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!available || username.length < 5) return;

        setLoading(true);
        try {
            await API.post("/users/update", { username });
            toast.success("Username set successfully!");
            await loadUser(); // Refresh user context
            navigate("/", { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to set username");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome to GameDay! ⚽</h1>
                <p className="text-slate-400 mb-6">Choose a unique username to get started.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={handleChange}
                                className={`w-full p-3 bg-slate-800 border rounded-lg text-white focus:outline-none
                  ${available === true ? "border-green-500" : available === false ? "border-red-500" : "border-slate-700"}
                `}
                                placeholder="Enter username"
                                minLength={5}
                            />
                            {available === true && <span className="absolute right-3 top-3 text-green-500">✔</span>}
                            {available === false && <span className="absolute right-3 top-3 text-red-500">✖</span>}
                        </div>
                        {available === false && <p className="text-red-400 text-xs mt-1">Username is already taken.</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={!available || loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Setting up..." : "Get Started"}
                    </button>
                </form>
            </div>
        </div>
    );
}
