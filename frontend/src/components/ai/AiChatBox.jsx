import { useState, useRef, useEffect } from "react";
import API from "../../api/api";
import toast from "react-hot-toast";

export default function AiChatBox({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hey! I'm your GameDay Assistant 🤖⚽\nAsk me anything about your teams, matches, schedules, or where to watch!" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const msg = input;
    setMessages([...messages, { from: "user", text: msg }]);
    setInput("");
    setTyping(true);

    try {
      const res = await API.post("/ai/ask", { question: msg });
      
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: res.data.answer }
      ]);
    } catch (err) {
      setTyping(false);
      toast.error("AI failed. Try again.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-slate-900 border border-slate-700 
      rounded-2xl shadow-2xl z-50 flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-slate-800 rounded-t-2xl">
        <h2 className="text-xl font-semibold text-blue-400">GameDay AI</h2>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white text-xl"
        >
          ✖
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-xl 
                ${msg.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-gray-200 border border-slate-700"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="text-gray-400 text-sm italic">AI is typing...</div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          placeholder="Ask something..."
          className="flex-1 p-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
