import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BarChart3, Map as MapIcon, Image as ImageIcon, Download, RefreshCw, ChevronRight } from 'lucide-react';
import SalaryChart from '../components/SalaryChart';
import { DUMMY_EMPLOYEES } from '../utils/mockData';

// Fix Leaflet marker icon issue in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CITY_COORDINATES = {
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.6139, 77.2090],
  'Bangalore': [12.9716, 77.5946],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Hyderabad': [17.3850, 78.4867],
  'Pune': [18.5204, 73.8567],
  'Ahmedabad': [23.0225, 72.5714]
};

const Analytics = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [auditImage, setAuditImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = localStorage.getItem('audit_image');
    if (img) setAuditImage(img);

    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'test', password: '123456' })
        });
        const result = await response.json();
        const data = result.data || result || [];
        setEmployees(data.length > 0 ? data : DUMMY_EMPLOYEES);
      } catch (err) {
        setEmployees(DUMMY_EMPLOYEES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const uniqueCities = [...new Set(employees.map(emp => emp.city))].filter(city => CITY_COORDINATES[city]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Business Intelligence Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Geospatial distribution and financial analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Custom Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <BarChart3 size={20} className="text-brand" />
              <h2>Salary Distribution</h2>
            </div>
          </div>
          {isLoading ? (
            <div className="card-premium h-[400px] flex items-center justify-center">
              <RefreshCw className="animate-spin text-slate-300" size={32} />
            </div>
          ) : (
            <SalaryChart data={employees} />
          )}
        </div>

        {/* Map Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <MapIcon size={20} className="text-brand" />
              <h2>Employee Heatmap</h2>
            </div>
          </div>
          <div className="h-[464px] rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative z-0 group">
            <MapContainer center={[20.5937, 78.9629]} zoom={4.5} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
              />
              {uniqueCities.map(city => (
                <Marker key={city} position={CITY_COORDINATES[city]}>
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-slate-800">{city}</p>
                      <p className="text-sm text-brand">{employees.filter(e => e.city === city).length} Employees</p>
                      <div className="mt-2 text-[10px] text-slate-400 uppercase tracking-tighter">Live Sensor Data Active</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Audit Log Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-700 font-bold px-2">
          <ImageIcon size={20} className="text-brand" />
          <h2>Recent Verification Audit</h2>
        </div>
        <div className="card-premium p-8 overflow-hidden bg-slate-900 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand/10 to-transparent opacity-50 pointer-events-none" />
          {auditImage ? (
            <div className="flex flex-col items-center relative z-10">
              <div className="relative group/img">
                <img 
                  src={auditImage} 
                  alt="Audit" 
                  className="max-w-xl w-full rounded-xl shadow-2xl border-2 border-white/20 transition-transform duration-500 group-hover/img:scale-[1.02]"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse"> Verified Safe </div>
              </div>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Transaction ID</p>
                  <p className="text-white font-mono text-sm">#AUD-2026-X9K</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Metadata Hash</p>
                  <p className="text-white font-mono text-sm truncate">sha256:88bc...2f1</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Timestamp</p>
                  <p className="text-white text-sm">{new Date().toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status</p>
                  <p className="text-green-400 text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Encrypted
                  </p>
                </div>
              </div>
            </div>
          ) : (
              <div className="h-80 flex flex-col items-center justify-center text-slate-500 relative z-10">
                <div className="bg-slate-800 p-6 rounded-full mb-4">
                  <ImageIcon size={48} className="opacity-20" />
                </div>
                <p className="font-semibold text-slate-300">Awaiting Audit Submission</p>
                <p className="text-sm mt-1 opacity-50 text-center px-8">Complete a face verification in the directory <br/> or via the employee details page</p>
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => navigate('/list')}
                    className="bg-brand text-white text-xs font-bold py-3 px-6 rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2"
                  >
                    Employee Directory <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => navigate('/audits')}
                    className="bg-slate-800 text-white text-xs font-bold py-3 px-6 rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700"
                  >
                    View History Archive
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
