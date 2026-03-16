import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/surveys/create', label: '➕ Create Survey' },
  { to: '/dashboard?tab=analytics', label: '📈 Analytics' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Admin Menu
        </p>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
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
