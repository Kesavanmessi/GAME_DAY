import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import LeagueTeams from "./pages/LeagueTeams";
import MyFavorites from "./pages/MyFavorites";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/favorites/:leagueId" element={<LeagueTeams />} />
        <Route path="/favorites/my" element={<MyFavorites />} />
        <Route path="/friends" element={<Friends />} />
<Route path="/friends/:friendId" element={<FriendProfile />} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
