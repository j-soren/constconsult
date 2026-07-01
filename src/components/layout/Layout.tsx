import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 1023px)');

    const syncSidebarForViewport = () => {
      if (!mobileQuery.matches) {
        setSidebarOpen(false);
        document.body.style.overflow = '';
        return;
      }
      if (sidebarOpen) {
        document.body.style.overflow = 'hidden';
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    syncSidebarForViewport();
    mobileQuery.addEventListener('change', syncSidebarForViewport);
    document.addEventListener('keydown', handleEscape);

    if (sidebarOpen && mobileQuery.matches) {
      document.body.style.overflow = 'hidden';
    } else if (!sidebarOpen) {
      document.body.style.overflow = '';
    }

    return () => {
      mobileQuery.removeEventListener('change', syncSidebarForViewport);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 text-sm font-semibold text-slate-900">ConstConsult</span>
        </header>

        <main id="main-content" className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}