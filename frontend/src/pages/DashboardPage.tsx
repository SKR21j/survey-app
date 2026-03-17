import AdminDashboard from '../components/Admin/AdminDashboard';
import Sidebar from '../components/Common/Sidebar';
import SurveyList from '../components/Survey/SurveyList';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen">
      {isAdmin && <Sidebar />}
      <main className="flex-1 p-6 space-y-8 bg-gray-50 dark:bg-gray-950 transition-colors">
        {isAdmin && <AdminDashboard />}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {isAdmin ? 'All Surveys' : 'Surveys'}
          </h2>
          <SurveyList />
        </div>
      </main>
    </div>
  );
}
