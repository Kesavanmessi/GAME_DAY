import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import AuthProvider from "./context/AuthProvider";
import Login from "./pages/Login";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import LeagueTeams from "./pages/LeagueTeams";
import MyFavorites from "./pages/MyFavorites";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";
import TeamDetails from "./pages/TeamDetails";
import Profile from "./pages/Profile";
import AiPage from "./pages/Ai";
import Reminders from "./pages/Reminders";
import Notifications from "./pages/Notifications";
import BottomNav from "./components/layout/BottomNav";
import SplashScreen from "./components/SplashScreen";
import AiChatButton from "./components/ai/AiChatButton";

import SetUsername from "./pages/SetUsername";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<RedirectIfAuth><Login /></RedirectIfAuth>}
          />

          {/* Onboarding Route - Requires Auth but not Profile */}
          <Route path="/set-username" element={<RequireAuth><SetUsername /></RequireAuth>} />

          {/* Protected Routes - Require Auth AND Profile */}
          <Route path="/" element={<RequireProfile><Home /></RequireProfile>} />
          <Route path="/favorites" element={<RequireProfile><Favorites /></RequireProfile>} />
          <Route path="/favorites/my" element={<RequireProfile><MyFavorites /></RequireProfile>} />
          <Route path="/favorites/:leagueId" element={<RequireProfile><LeagueTeams /></RequireProfile>} />
          <Route path="/reminders" element={<RequireProfile><Reminders /></RequireProfile>} />
          <Route path="/notifications" element={<RequireProfile><Notifications /></RequireProfile>} />
          <Route path="/ai" element={<RequireProfile><AiPage /></RequireProfile>} />
          <Route path="/friends" element={<RequireProfile><Friends /></RequireProfile>} />
          <Route path="/friends/:friendId" element={<RequireProfile><FriendProfile /></RequireProfile>} />
          <Route path="/team/:teamId" element={<RequireProfile><TeamDetails /></RequireProfile>} />
          <Route path="/profile" element={<RequireProfile><Profile /></RequireProfile>} />
        </Routes>

        <AiChatButton />
        <BottomNav />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

/* Route guards */
function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  return user ? children : null;
}

function RequireProfile({ children }) {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (!user.username) {
        navigate('/set-username', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  return (user && user.username) ? children : null;
}

function RedirectIfAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (!user.username) {
        navigate('/set-username', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  return !user ? children : null;
}
