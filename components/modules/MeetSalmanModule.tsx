import React from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { ModuleContentProps } from '../../types/modules';
import { MeetSalman } from '../MeetSalman';

interface MeetSalmanModuleProps extends ModuleContentProps {
  isPreview?: boolean;
}

export const MeetSalmanModule: React.FC<MeetSalmanModuleProps> = ({
  isPreview = false,
  onClose,
  onConsultation,
}) => {
  // Preview mode - compact card for 3D space
  if (isPreview) {
    return (
      <div className="w-full h-full bg-black/90 p-3 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-display font-bold text-white uppercase tracking-tight">MEET SALMAN</h3>
          <User size={12} className="text-[#CCFF00]" />
        </div>

        {/* Photo thumbnail */}
        <div className="flex-1 relative overflow-hidden rounded-lg border border-white/10">
          <img
            src="https://i.ibb.co/m5YMYQR6/Generated-Image-January-12-2026-1-46-PM.jpg"
            className="w-full h-full object-cover opacity-80"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-1.5 left-1.5 right-1.5">
            <p className="text-[8px] font-display font-bold text-[#CCFF00] uppercase tracking-tight">HEY - I'M SALMAN</p>
            <p className="text-[5px] font-body text-gray-400 uppercase mt-0.5">AI OPERATOR & FILMMAKER</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-2 flex gap-1">
          <div className="flex-1 p-1 bg-white/5 rounded text-center">
            <p className="text-[5px] font-body text-gray-500 uppercase">LOCATION</p>
            <p className="text-[6px] font-display font-bold text-white uppercase">CALGARY</p>
          </div>
          <div className="flex-1 p-1 bg-white/5 rounded text-center">
            <p className="text-[5px] font-body text-gray-500 uppercase">FOCUS</p>
            <p className="text-[6px] font-display font-bold text-white uppercase">AI + CINEMA</p>
          </div>
        </div>

        {/* Mini CTA */}
        <div className="mt-2 p-1.5 bg-[#CCFF00] rounded text-center">
          <p className="text-[6px] font-display font-bold text-black uppercase">CLICK TO EXPLORE</p>
        </div>
      </div>
    );
  }

  // Full interactive mode - renders existing MeetSalman content
  return (
    <MeetSalman
      onNext={() => {}}
      onConsultation={() => { onClose(); onConsultation?.(); }}
    />
  );
};

export default MeetSalmanModule;
