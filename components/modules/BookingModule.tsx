import React from 'react';
import { Calendar, Video, MapPin, Phone } from 'lucide-react';
import { ModuleContentProps } from '../../types/modules';
import { BookingPage } from '../BookingPage';

interface BookingModuleProps extends ModuleContentProps {
  isPreview?: boolean;
}

export const BookingModule: React.FC<BookingModuleProps> = ({
  isPreview = false,
  onClose,
  onConsultation,
}) => {
  // Preview mode - compact card for 3D space
  if (isPreview) {
    return (
      <div className="w-full h-full bg-black/90 p-3 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-display font-bold text-white uppercase tracking-tight">BOOK MEETING</h3>
          <Calendar size={12} className="text-[#CCFF00]" />
        </div>

        {/* Meeting type icons */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          {[
            { icon: <Video size={10} />, label: 'ZOOM CALL' },
            { icon: <MapPin size={10} />, label: 'IN-PERSON' },
            { icon: <Phone size={10} />, label: 'PHONE CALL' },
          ].map((type) => (
            <div key={type.label} className="flex items-center gap-2 p-1.5 bg-white/5 rounded">
              <div className="text-[#CCFF00]">{type.icon}</div>
              <p className="text-[6px] font-display font-bold text-gray-300 uppercase">{type.label}</p>
            </div>
          ))}
        </div>

        {/* Mini CTA */}
        <div className="mt-2 p-1.5 bg-[#CCFF00] rounded text-center">
          <p className="text-[6px] font-display font-bold text-black uppercase">CLICK TO BOOK</p>
        </div>
      </div>
    );
  }

  // Full interactive mode - renders existing BookingPage content
  return (
    <div className="p-6 lg:p-8">
      <BookingPage />
    </div>
  );
};

export default BookingModule;
