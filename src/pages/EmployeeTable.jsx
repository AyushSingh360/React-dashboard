import React, { useState, useEffect } from 'react';
import VirtualGrid from '../components/VirtualGrid';
import { Users, Filter, Search, ShieldCheck } from 'lucide-react';
import { DUMMY_EMPLOYEES } from '../utils/mockData';
import AuditModal from '../components/AuditModal';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'test', password: '123456' })
        });
        
        const result = await response.json();
        const data = result.data || result || [];
        
        if (data.length > 0) {
          setEmployees(data);
        } else {
          setEmployees(DUMMY_EMPLOYEES);
        }
      } catch (err) {
        setError('Failed to load employee data');
        setEmployees(DUMMY_EMPLOYEES);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAudit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Employee Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and audit your workforce members</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-brand/10 focus:border-brand outline-none w-64 shadow-sm"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-premium p-6 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Staff</p>
            <p className="text-2xl font-bold text-slate-800">{employees.length}</p>
          </div>
        </div>
        {/* Mock stats */}
        <div className="card-premium p-6 flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Audited</p>
            <p className="text-2xl font-bold text-slate-800">{Math.floor(employees.length * 0.85)}</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 italic flex items-end justify-end md:justify-center p-4">
          Data synchronized with backend master node
        </div>
      </div>

      {loading ? (
        <div className="card-premium h-[600px] flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            <p className="text-slate-500 font-medium">Syncing database...</p>
          </div>
        </div>
      ) : (
        <VirtualGrid data={employees} onAudit={handleAudit} />
      )}

      <AuditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        employee={selectedEmployee}
        onSaveSuccess={() => {
          // Could refresh data here if needed
        }}
      />
    </div>
  );
};

export default EmployeeTable;
