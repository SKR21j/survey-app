import AdminDashboard from '../components/Admin/AdminDashboard';
import Sidebar from '../components/Common/Sidebar';
import SurveyList from '../components/Survey/SurveyList';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 space-y-8 bg-gray-50">
        <AdminDashboard />
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Surveys</h2>
          <SurveyList />
        </div>
      </main>
    </div>
  );
}
