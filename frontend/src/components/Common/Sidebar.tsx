import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

export default function Sidebar() {
  const { t } = useLanguage();
  const links = [
    { to: '/dashboard', label: `📊 ${t('dashboard')}` },
    { to: '/surveys/create', label: `➕ ${t('createSurvey').replace('+ ', '')}` },
    { to: '/dashboard?tab=analytics', label: `📈 ${t('analytics')}` },
  ];

  return (
    <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen transition-colors">
      <nav className="p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          {t('adminMenu')}
        </p>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
