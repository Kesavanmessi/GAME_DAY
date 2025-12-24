import { useState } from "react";
import AiChatBox from "./AiChatBox";

export default function AiChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700
        text-white w-16 h-16 rounded-full shadow-xl
        flex items-center justify-center text-3xl
        animate-pulse-glow cursor-pointer z-50"
      >
        🤖
      </button>

      {/* Chat Box */}
      {open && <AiChatBox onClose={() => setOpen(false)} />}
    </>
  );
}
