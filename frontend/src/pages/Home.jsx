import DashboardLayout from "../components/layout/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4 text-blue-400">Today's Matches</h1>

      <p className="text-gray-400">
        Soon you will see live match cards, reminders, watch info, and AI insights here.
      </p>

      <div className="mt-6 text-gray-500">
        (We will populate this with real match data in the next steps.)
      </div>
    </DashboardLayout>
  );
}
