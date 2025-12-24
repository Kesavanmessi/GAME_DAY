import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/api";
import toast from "react-hot-toast";

export default function FriendProfile() {
  const { friendId } = useParams();
  const [friend, setFriend] = useState(null);
  const [accessStatus, setAccessStatus] = useState("loading");

  useEffect(() => {
    loadFriend();
    checkAccess();
  }, []);

  const loadFriend = async () => {
    try {
      const res = await API.get(`/friends/profile/${friendId}`);
      setFriend(res.data);
    } catch (err) {
      console.error("Friend fetch error:", err);
    }
  };

  const checkAccess = async () => {
    try {
      const res = await API.get(`/access/status/${friendId}`);
      setAccessStatus(res.data.status);
    } catch (err) {
      console.error("Access check error:", err);
    }
  };

  const sendAccessRequest = async () => {
    try {
      const res = await API.post("/access/request", { friendId });
      toast.success("Request sent!");
      setAccessStatus("pending");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (!friend)
    return <DashboardLayout>Loading friend profile...</DashboardLayout>;

  return (
    <DashboardLayout>
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        {friend.user.name}'s Favorites
      </h1>

      {/* PUBLIC FAVORITES */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-green-400 mb-3">
          Public Favorites
        </h2>

        {friend.publicFavorites.length === 0 ? (
          <p className="text-gray-500">No public favorites.</p>
        ) : (
          <ul className="grid md:grid-cols-3 gap-4">
            {friend.publicFavorites.map((t) => (
              <li
                key={t.teamId}
                className="bg-slate-900 p-4 rounded-xl border border-slate-800"
              >
                {t.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* PRIVATE FAVORITES */}
      <section>
        <h2 className="text-2xl font-bold text-purple-400 mb-3">
          Private Favorites
        </h2>

        {accessStatus === "approved" ? (
          <>
            <p className="text-gray-400 mb-3">You have access ✔</p>
            <ul className="grid md:grid-cols-3 gap-4">
              {friend.privateFavorites.map((t) => (
                <li
                  key={t.teamId}
                  className="bg-slate-900 p-4 rounded-xl border border-slate-800"
                >
                  {t.name}
                </li>
              ))}
            </ul>
          </>
        ) : accessStatus === "pending" ? (
          <p className="text-yellow-500">Request Pending...</p>
        ) : accessStatus === "rejected" ? (
          <>
            <p className="text-red-500 mb-2">Your request was rejected.</p>
            <button
              onClick={sendAccessRequest}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg"
            >
              Request Again
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-3">
              You need permission to view private favorites.
            </p>
            <button
              onClick={sendAccessRequest}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg"
            >
              Request Access
            </button>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
