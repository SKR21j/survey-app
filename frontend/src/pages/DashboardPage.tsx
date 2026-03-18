import AdminDashboard from '../components/Admin/AdminDashboard';
import Sidebar from '../components/Common/Sidebar';
import SurveyList from '../components/Survey/SurveyList';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen">
      {isAdmin && <Sidebar />}
      <main className="flex-1 p-6 space-y-8 bg-gray-50 dark:bg-gray-800 transition-colors">
        {isAdmin && <AdminDashboard />}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {isAdmin ? t('allSurveys') : t('surveys')}
          </h2>
          <SurveyList />
        </div>
      </main>
    </div>
  );
}
