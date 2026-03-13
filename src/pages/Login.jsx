import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/list');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-brand/5 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md px-6 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex bg-brand p-3 rounded-2xl text-white shadow-xl shadow-brand/20 mb-4 items-center justify-center">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Employee Insights</h1>
          <p className="text-slate-500 mt-2">Secure access to workforce analytics</p>
        </div>

        <div className="card-premium p-8 sm:p-10">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3 animate-in shake duration-500">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-11"
                  placeholder="testuser"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2">
              Sign In
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] items-center justify-center flex text-center font-bold text-slate-400 uppercase tracking-widest mb-2">Default Credentials</p>
              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>User: <span className="text-slate-800">testuser</span></span>
                <span>Pass: <span className="text-slate-800">Test123</span></span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-400">
          Powered by Advanced Analytics Engine
        </p>
      </div>
    </div>
  );
};

export default Login;
