import { NavLink } from "react-router-dom";
import { FaHome, FaStar, FaUserFriends, FaUserCog, FaRobot } from "react-icons/fa";

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 text-white flex justify-around py-3 z-50">

      <NavLink
        to="/"
        className="flex flex-col items-center text-sm"
      >
        <FaHome size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/favorites/my"
        className="flex flex-col items-center text-sm"
      >
        <FaStar size={22} />
        <span>Fav</span>
      </NavLink>

      <NavLink
        to="/friends"
        className="flex flex-col items-center text-sm"
      >
        <FaUserFriends size={22} />
        <span>Friends</span>
      </NavLink>

      <NavLink
        to="/ai"
        className="flex flex-col items-center text-sm"
      >
        <FaRobot size={22} />
        <span>AI</span>
      </NavLink>

      <NavLink
        to="/profile"
        className="flex flex-col items-center text-sm"
      >
        <FaUserCog size={22} />
        <span>Profile</span>
      </NavLink>

    </div>
  );
}
