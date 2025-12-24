import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [email, setEmail] = useState("");
  const [accessReq, setAccessReq] = useState([]);

  useEffect(() => {
    loadFriends();
    loadRequests();
  }, []);

  const loadFriends = async () => {
    try {
      const res = await API.get("/friends/list");
      // Backend returns an array directly
      setFriends(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setFriends([]);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await API.get("/friends/requests");
      // Backend returns an array directly
      setPending(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setPending([]);
    }
  };

  const sendRequest = async () => {
    if (!email.trim()) return toast.error("Email required");
    try {
      await API.post("/friends/send-request", { email });
      toast.success("Friend request sent!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleDecision = async (requestId, action) => {
    try {
      await API.post("/friends/handle-request", {
        requestId,
        action, // "accept" or "reject"
      });
      toast.success(`Request ${action}ed`);
      loadRequests();
      loadFriends();
    } catch (err) {
      toast.error("Failed");
    }
  };

  const loadAccessRequests = async () => {
    try {
      const res = await API.get("/access/my-requests");
      // Backend returns an array directly
      setAccessReq(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setAccessReq([]);
    }
  };

  const handleAccess = async (requestId, action) => {
    await API.post("/access/handle", { requestId, action });
    toast.success(`Request ${action}ed`);
    loadAccessRequests();
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Friends</h1>

      {/* Add Friend / Search */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 mb-8">
        <h2 className="text-xl font-semibold mb-3">Search for Friends</h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            <input
              type="email"
              placeholder="Search by email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <button
            onClick={sendRequest}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-blue-900/20"
          >
            Send Request
          </button>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Pending Requests</h2>

        {!pending || pending.length === 0 ? (
          <p className="text-gray-500">No pending requests</p>
        ) : (
          <div className="space-y-4">
            {pending
              .filter(req => req && req.fromUser) // Filter out malformed requests
              .map((req) => (
                <div
                  key={req._id}
                  className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between"
                >
                  <p className="font-semibold">{req.fromUser?.name || "Unknown User"}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(req._id, "accept")}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleDecision(req._id, "reject")}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* PRIVATE ACCESS REQUESTS */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-pink-400 mb-4">Private Access Requests</h2>

        <button
          onClick={loadAccessRequests}
          className="bg-slate-700 px-4 py-2 rounded-md mb-3"
        >
          Refresh
        </button>

        {!accessReq || accessReq.length === 0 ? (
          <p className="text-gray-500">No private access requests.</p>
        ) : (
          <div className="space-y-4">
            {accessReq.map((req) => (
              <div key={req._id} className="bg-slate-900 p-4 border border-slate-800 rounded-xl flex justify-between">
                <p>{req.requesterId.name}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccess(req._id, "approve")}
                    className="px-3 py-1 bg-green-600 rounded-lg"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleAccess(req._id, "reject")}
                    className="px-3 py-1 bg-red-600 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Friends List */}
      <h2 className="text-2xl font-bold text-green-400 mb-4">Your Friends</h2>

      {!friends || friends.length === 0 ? (
        <p className="text-gray-500">No friends yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {friends.map((fr) => (
            <Link
              to={`/friends/${fr._id}`}
              key={fr._id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg hover:bg-slate-800 transition"
            >
              <p className="text-xl font-semibold">{fr.name}</p>
              <p className="text-gray-400 text-sm">{fr.email}</p>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
