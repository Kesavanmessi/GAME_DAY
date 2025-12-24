import AiChatBox from "../components/ai/AiChatBox";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function AiPage() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">Ask AI</h1>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex-1">
          <AiChatBox />
        </div>
      </div>
    </DashboardLayout>
  );
}
