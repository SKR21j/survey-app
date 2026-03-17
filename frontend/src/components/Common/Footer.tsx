export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 transition-colors">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME ?? 'Survey App'}. All rights
        reserved.
      </div>
    </footer>
  );
}
