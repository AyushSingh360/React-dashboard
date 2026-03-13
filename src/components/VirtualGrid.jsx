import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

const VirtualGrid = ({ data, onAudit }) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const navigate = useNavigate();

  // Settings
  const rowHeight = 72; // Increased for better spacing
  const buffer = 5;
  const containerHeight = 600;

  const totalHeight = data.length * rowHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const endIndex = Math.min(data.length, Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer);

  const visibleData = useMemo(() => {
    return data.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      absoluteIndex: startIndex + index
    }));
  }, [data, startIndex, endIndex]);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="card-premium overflow-auto relative scroll-smooth"
      style={{ height: `${containerHeight}px` }}
    >
      <div style={{ height: `${totalHeight}px`, width: '100%', position: 'relative' }}>
        {visibleData.map((employee) => (
          <div
            key={employee.id || employee.absoluteIndex}
            onClick={() => navigate(`/details/${employee.id}`)}
            className="absolute left-0 right-0 border-b border-slate-50 flex items-center px-8 hover:bg-slate-50 cursor-pointer group transition-all duration-200"
            style={{ 
              height: `${rowHeight}px`, 
              top: `${employee.absoluteIndex * rowHeight}px` 
            }}
          >
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="truncate">
                <p className="font-semibold text-slate-800 truncate">{employee.name}</p>
                <p className="text-xs text-slate-400 font-medium">ID: {employee.id}</p>
              </div>
            </div>
            
            <div className="flex-1 px-4 hidden sm:block">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {employee.designation}
              </span>
            </div>

            <div className="flex-1 text-slate-500 text-sm font-medium hidden md:block">
              {employee.city}
            </div>

            <div className="w-24 text-right pr-4">
              <p className="font-bold text-slate-800">₹{(parseInt(employee.salary)/1000).toFixed(0)}k</p>
            </div>

            <div className="flex items-center gap-2 pl-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAudit(employee);
                }}
                className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-brand hover:bg-brand/10 transition-all"
                title="Quick Audit"
              >
                <ShieldCheck size={18} />
              </button>
              <div className="text-slate-300 group-hover:text-brand transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualGrid;
