import { FaUserCircle } from 'react-icons/fa';

export default function Header({ title = 'GameDay' }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold text-blue-400">{title}</h2>
        <p className="text-sm text-gray-400">Your sports companion</p>
      </div>

      <div className="flex items-center space-x-3">
        <button className="text-gray-300 hover:text-white">Help</button>
        <FaUserCircle size={28} className="text-white/90" />
      </div>
    </div>
  );
}
