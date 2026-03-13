import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, User, Search, Trash2, ExternalLink, ArrowLeft, ImageIcon } from 'lucide-react';
import { DUMMY_AUDITS } from '../utils/mockData';

const AuditHistory = () => {
  const [audits, setAudits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let history = JSON.parse(localStorage.getItem('audit_history') || '[]');
    if (history.length === 0) {
      history = DUMMY_AUDITS;
      localStorage.setItem('audit_history', JSON.stringify(history));
    }
    setAudits(history);
  }, []);

  const deleteAudit = (id) => {
    const updated = audits.filter(a => a.id !== id);
    setAudits(updated);
    localStorage.setItem('audit_history', JSON.stringify(updated));
  };

  const filteredAudits = audits.filter(audit => 
    audit.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.employeeId.includes(searchTerm)
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/analytics')}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-brand hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
              Audit Archive
            </h1>
            <p className="text-slate-500 text-sm mt-1">Immutable record of personnel verification events</p>
          </div>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border border-slate-200 pl-12 pr-6 py-3 rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand outline-none w-full md:w-80 shadow-sm transition-all"
          />
        </div>
      </div>

      {filteredAudits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAudits.map((audit) => (
            <div key={audit.id} className="group card-premium overflow-hidden bg-white border border-slate-100 flex flex-col">
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img 
                  src={audit.image} 
                  alt={`Audit for ${audit.employeeName}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => navigate(`/details/${audit.employeeId}`)}
                        className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <User size={14} /> Profile
                      </button>
                      <button 
                         onClick={() => deleteAudit(audit.id)}
                         className="p-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 rounded-lg hover:bg-red-500/40 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-brand/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Verified
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{audit.employeeName}</h3>
                  <p className="text-xs font-medium text-slate-400 mb-4">Employee ID: {audit.employeeId}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} />
                      <span className="text-xs">{new Date(audit.timestamp).toLocaleDateString()} at {new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <ShieldCheck size={14} className="text-green-500" />
                      <span className="text-xs font-mono">#{audit.id.split('-')[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-premium h-96 flex flex-col items-center justify-center text-slate-400">
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <ImageIcon size={48} className="opacity-20" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No audit records found</h3>
          <p className="text-sm mt-1"> {searchTerm ? 'Try adjusting your search filters' : 'Verified personnel data will appear here'}</p>
        </div>
      )}
    </div>
  );
};

export default AuditHistory;
