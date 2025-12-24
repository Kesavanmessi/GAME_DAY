import { useEffect, useState } from "react";
import API from "../api/api";

export default function WatchProviders({ matchId }) {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const res = await API.get(`/watch/${matchId}`);
      setProviders(res.data.providers || []);
    } catch (err) {
      console.error("Watch fetch error", err);
    }
  };

  if (providers.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {providers.map((p) => (
        <span
          key={p}
          className="px-3 py-1 rounded-full bg-blue-700 text-xs text-white"
        >
          {p}
        </span>
      ))}
    </div>
  );
}
