import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, Camera, Save, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import SignatureCanvas from '../components/SignatureCanvas';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const mockEmployee = {
      id,
      name: `Employee ${id}`,
      designation: 'Senior Developer',
      city: 'Bangalore',
      email: `emp${id}@example.com`,
      phone: '+91 98765 43210'
    };
    setEmployee(mockEmployee);
  }, [id]);

  const handleCapture = (photoData) => {
    setPhoto(photoData);
    setStep(2);
  };

  const handleSave = async () => {
    if (!photo || !signatureCanvas) return;
    setIsSaving(true);
    
    const finalCanvas = document.createElement('canvas');
    const photoImg = new Image();
    photoImg.src = photo;
    
    photoImg.onload = () => {
      finalCanvas.width = photoImg.width;
      finalCanvas.height = photoImg.height;
      const ctx = finalCanvas.getContext('2d');
      ctx.drawImage(photoImg, 0, 0);
      ctx.drawImage(signatureCanvas, 0, 0, photoImg.width, photoImg.height);
      const mergedImage = finalCanvas.toDataURL('image/png');
      
      // Save to history
      const newRecord = {
        id: `AUD-${Date.now()}`,
        employeeId: employee.id,
        employeeName: employee.name,
        timestamp: new Date().toISOString(),
        image: mergedImage
      };
      
      const history = JSON.parse(localStorage.getItem('audit_history') || '[]');
      localStorage.setItem('audit_history', JSON.stringify([newRecord, ...history]));
      localStorage.setItem('audit_image', mergedImage); // Keep for backwards compatibility with Analytics
      
      setTimeout(() => {
        setIsSaving(false);
        navigate('/analytics');
      }, 1000);
    };
  };

  if (!employee) return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/list')}
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-brand hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Personnel Verification Audit</h1>
          <p className="text-slate-500 text-sm">Step-by-step identity and authorization check</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card-premium p-8 sticky top-28 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="relative">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-brand mb-6 mx-auto shadow-inner border border-slate-200/50">
                <User size={48} />
              </div>
              <h2 className="text-xl font-bold text-center text-slate-900 mb-1">{employee.name}</h2>
              <p className="text-sm font-semibold text-brand text-center mb-8 uppercase tracking-wider">{employee.designation}</p>
              
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee ID</p>
                    <p className="text-sm font-semibold">{employee.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Location</p>
                    <p className="text-sm font-semibold">{employee.city}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors shadow-lg ${step >= 1 ? 'bg-brand' : 'bg-slate-200'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${step >= 1 ? 'text-brand' : 'text-slate-400'}`}>1. Biometric Photo</span>
                </div>
                <div className="w-px h-6 bg-slate-100 ml-4" />
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors shadow-lg ${step >= 2 ? 'bg-brand' : 'bg-slate-200'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${step >= 2 ? 'text-brand' : 'text-slate-400'}`}>2. Digital Approval</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Area */}
        <div className="lg:col-span-2">
          <div className="card-premium p-8">
            {step === 1 ? (
              <div className="space-y-8 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand/10 p-2.5 rounded-xl text-brand">
                      <Camera size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Visual Verification</h3>
                  </div>
                </div>
                <CameraCapture onCapture={handleCapture} />
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand text-white p-2.5 rounded-xl">
                      <Save size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Final Authorization</h3>
                      <p className="text-slate-500 text-xs">Append your signature to the captured data</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-slate-400 hover:text-brand text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={14} />
                    Reset Capture
                  </button>
                </div>
                
                <SignatureCanvas onUpdate={setSignatureCanvas} photo={photo} />
                
                <button
                  onClick={handleSave}
                  disabled={!signatureCanvas || isSaving}
                  className="btn-primary w-full flex items-center justify-center gap-3 h-16 text-lg"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save size={24} />
                      Authorize & Finalize Sync
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 font-medium px-12">
                  By authorizing, you confirm the biometric data matches the personnel records and consent to encrypted storage on local secure enclave.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
