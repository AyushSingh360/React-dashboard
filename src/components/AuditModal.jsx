import React, { useState } from 'react';
import { X, Camera, Save, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import CameraCapture from './CameraCapture';
import SignatureCanvas from './SignatureCanvas';

const AuditModal = ({ isOpen, onClose, employee, onSaveSuccess }) => {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [signatureCanvas, setSignatureCanvas] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !employee) return null;

  const handleCapture = (photoData) => {
    setPhoto(photoData);
    setStep(2);
  };

  const handleSave = async () => {
    if (!photo || !signatureCanvas) return;
    setIsSaving(true);

    const finalCanvas = document.createElement('canvas');
    const photoImg = new Image();
    photoImg.onload = () => {
      finalCanvas.width = photoImg.width;
      finalCanvas.height = photoImg.height;
      const ctx = finalCanvas.getContext('2d');
      ctx.drawImage(photoImg, 0, 0);
      ctx.drawImage(signatureCanvas, 0, 0, photoImg.width, photoImg.height);
      
      // Use JPEG with quality compression to save space
      const mergedImage = finalCanvas.toDataURL('image/jpeg', 0.8);

      const newRecord = {
        id: `AUD-${Date.now()}`,
        employeeId: employee.id,
        employeeName: employee.name,
        timestamp: new Date().toISOString(),
        image: mergedImage
      };

      try {
        const history = JSON.parse(localStorage.getItem('audit_history') || '[]');
        // Keep only last 10 audits to prevent storage bloat
        const updatedHistory = [newRecord, ...history].slice(0, 10);
        
        localStorage.setItem('audit_history', JSON.stringify(updatedHistory));
        localStorage.setItem('audit_image', mergedImage);

        setTimeout(() => {
          setIsSaving(false);
          onSaveSuccess();
          onClose();
        }, 800);
      } catch (err) {
        console.error('Failed to save audit:', err);
        // Fallback: Clear old history and try one more time
        localStorage.removeItem('audit_history');
        try {
          localStorage.setItem('audit_history', JSON.stringify([newRecord]));
          localStorage.setItem('audit_image', mergedImage);
          setIsSaving(false);
          onSaveSuccess();
          onClose();
        } catch (retryErr) {
          setIsSaving(false);
          alert('Storage full. Please clear your browser cache to save more audits.');
        }
      }
    };
    photoImg.src = photo;

  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-brand/10 p-2 rounded-lg text-brand">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Quick Audit: {employee.name}</h3>
              <p className="text-xs text-slate-500 font-medium">Verify identity for ID #{employee.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex justify-center gap-12 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${step >= 1 ? 'bg-brand shadow-lg shadow-brand/20' : 'bg-slate-200'}`}>
                <Camera size={18} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 1 ? 'text-brand' : 'text-slate-400'}`}>Capture</span>
            </div>
            <div className="w-12 h-px bg-slate-100 self-center -mt-6" />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${step >= 2 ? 'bg-brand shadow-lg shadow-brand/20' : 'bg-slate-200'}`}>
                <CheckCircle2 size={18} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 2 ? 'text-brand' : 'text-slate-400'}`}>Sign</span>
            </div>
          </div>

          {step === 1 ? (
            <CameraCapture onCapture={handleCapture} />
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <SignatureCanvas onUpdate={setSignatureCanvas} photo={photo} />
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Retake Photo
                </button>
                <button
                  onClick={handleSave}
                  disabled={!signatureCanvas || isSaving}
                  className="flex-[2] btn-primary flex items-center justify-center gap-3 h-14"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save size={18} />
                      Complete Audit
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditModal;
