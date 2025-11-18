import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setTimeout(() => setFade(true), 1200);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-1000 z-50 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <h1 className="text-4xl font-bold text-blue-400 mb-4">GameDay ⚽🔥</h1>

      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      <p className="text-gray-400 mt-4">Loading...</p>
    </div>
  );
}
