import React from 'react';
import { Gift, Film } from 'lucide-react';
import { ModuleContentProps } from '../../types/modules';
import { TheOffer } from '../TheOffer';

interface TheOfferModuleProps extends ModuleContentProps {
  isPreview?: boolean;
}

export const TheOfferModule: React.FC<TheOfferModuleProps> = ({
  isPreview = false,
  onClose,
  onConsultation,
}) => {
  // Preview mode - compact card for 3D space
  if (isPreview) {
    return (
      <div className="w-full h-full bg-black/90 p-3 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-display font-bold text-white uppercase tracking-tight">THE OFFER</h3>
          <Gift size={12} className="text-[#CCFF00]" />
        </div>

        {/* Video thumbnail */}
        <div className="flex-1 relative overflow-hidden rounded-lg border border-white/10">
          <img
            src="https://img.youtube.com/vi/RLwo8clXyZM/mqdefault.jpg"
            className="w-full h-full object-cover opacity-80"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-1.5 left-1.5 right-1.5">
            <p className="text-[8px] font-display font-bold text-[#CCFF00] uppercase tracking-tight">FREE VIDEO. ZERO CATCH.</p>
            <p className="text-[5px] font-body text-gray-400 uppercase mt-0.5">NETFLIX-QUALITY CINEMATIC</p>
          </div>
        </div>

        {/* Mini CTA */}
        <div className="mt-2 p-1.5 bg-[#CCFF00] rounded text-center">
          <p className="text-[6px] font-display font-bold text-black uppercase">CLICK TO EXPLORE</p>
        </div>
      </div>
    );
  }

  // Full interactive mode - renders existing TheOffer content
  return (
    <TheOffer
      onConsultation={() => { onClose(); onConsultation?.(); }}
    />
  );
};

export default TheOfferModule;
