import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Users, BarChart3, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) return <>{children}</>;

  const navItems = [
    { name: 'Directory', path: '/list', icon: <Users size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Audits', path: '/audits', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate('/list')}
            >
              <div className="bg-brand p-2 rounded-xl text-white shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
                <Users size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                Employee<span className="text-brand">Insights</span>
              </span>
            </div>

            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
              <UserCircle size={20} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-700">{user?.username}</span>
            </div>
            
            <button 
              onClick={logout}
              className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Sign Out"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2026 Employee Insights Dashboard</p>
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-brand transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand transition-colors">Terms</a>
            <a href="#" className="hover:text-brand transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
