import React, { useState, useEffect, useCallback, Suspense } from 'react';
import {
  ModuleMetadata,
} from '../types/modules';

// Import Room3DEnhanced for canvas-rendered 3D room
import { Room3DEnhanced } from './Room3DEnhanced';
// Import Module3DOverlay for HTML content positioned in 3D space
import { Module3DOverlay } from './Module3DOverlay';
// Import overlays
import { TVOverlay } from './TVOverlay';
import { BookingOverlay } from './BookingOverlay';

// Lazy load module content components (only rendered inside the 3D panel)
const armoryImport = () => import('./modules/ArmoryModule');
const cinematicsImport = () => import('./modules/CinematicsModule');
const meetSalmanImport = () => import('./modules/MeetSalmanModule');
const theOfferImport = () => import('./modules/TheOfferModule');
const bookingImport = () => import('./modules/BookingModule');

const ArmoryModule = React.lazy(armoryImport);
const CinematicsModule = React.lazy(cinematicsImport);
const MeetSalmanModule = React.lazy(meetSalmanImport);
const TheOfferModule = React.lazy(theOfferImport);
const BookingModule = React.lazy(bookingImport);

// Preload all module chunks immediately so they're ready before the panel appears
armoryImport();
cinematicsImport();
meetSalmanImport();
theOfferImport();
bookingImport();

// Icons for module selector
// Brutalist Cyberpunk Knight Emblem - Sword, Shield & Helmet (from v1)
const ArmoryIcon = ({ size = 20, className = "w-5 h-5" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {/* Shield - angular brutalist shape */}
    <path d="M8 8L24 4L40 8V24C40 32 32 40 24 44C16 40 8 32 8 24V8Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="bevel" />
    {/* Shield inner border - tech detail */}
    <path d="M12 11L24 8L36 11V23C36 29 30 35 24 38C18 35 12 29 12 23V11Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" strokeLinejoin="bevel" />
    {/* Helmet visor - angular slit */}
    <path d="M16 16H32L30 20H18L16 16Z" fill="currentColor" fillOpacity="0.3" />
    <path d="M18 17H30" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    {/* Helmet crest - mohawk style */}
    <path d="M24 6V14" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    {/* Sword - central blade */}
    <path d="M24 18V42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    {/* Sword crossguard */}
    <path d="M18 26H30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    {/* Sword grip segments */}
    <path d="M23 30H25M23 33H25M23 36H25" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
    {/* Blade edge highlights */}
    <path d="M24 18L26 22M24 18L22 22" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
    {/* Tech circuit lines on shield */}
    <path d="M14 14L14 20M34 14L34 20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
  </svg>
);

const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Module registry - all 5 modules
const createModuleRegistry = (): ModuleMetadata[] => [
  {
    id: 'armory',
    title: 'THE ARMORY',
    icon: <ArmoryIcon />,
    component: ArmoryModule,
  },
  {
    id: 'video-portfolio',
    title: 'CINEMATICS',
    icon: <VideoIcon />,
    component: CinematicsModule,
  },
  {
    id: 'meet-salman',
    title: 'MEET SALMAN',
    icon: <UserIcon />,
    component: MeetSalmanModule,
  },
  {
    id: 'the-offer',
    title: 'THE OFFER',
    icon: <GiftIcon />,
    component: TheOfferModule,
  },
  {
    id: 'book-meeting',
    title: 'BOOK MEETING',
    icon: <CalendarIcon />,
    component: BookingModule,
  },
];

interface ModuleManagerProps {
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
  onConsultation: () => void;
  cinematicsMode?: boolean;
  onCloseCinematics?: () => void;
  bookingMode?: boolean;
  onCloseBooking?: () => void;
  openModuleId?: string | null;
  onOpenModuleIdConsumed?: () => void;
}

const ModuleManagerInner: React.FC<ModuleManagerProps> = ({
  scrollProgress,
  smoothMouse,
  onConsultation,
  cinematicsMode = false,
  onCloseCinematics,
  bookingMode = false,
  onCloseBooking,
  openModuleId = null,
  onOpenModuleIdConsumed,
}) => {
  // State
  const [selectedModuleId, setSelectedModuleId] = useState('armory');

  // Module registry
  const modules = createModuleRegistry();

  // Handlers
  const handleSelectModule = useCallback((id: string) => {
    setSelectedModuleId(id);
  }, []);

  // Select module when openModuleId is set and we've scrolled to modules
  useEffect(() => {
    if (openModuleId && scrollProgress >= 0.8) {
      setSelectedModuleId(openModuleId);
      onOpenModuleIdConsumed?.();
    }
  }, [openModuleId, scrollProgress, onOpenModuleIdConsumed]);

  return (
    <>
      {/* Room3DEnhanced renders the 3D room + panel frame shadow */}
      <Room3DEnhanced
        scrollProgress={scrollProgress}
        smoothMouse={smoothMouse}
        cinematicsMode={cinematicsMode || bookingMode}
      />

      {/* Module3DOverlay renders content panel + selector in 3D space */}
      <Module3DOverlay
        modules={modules}
        selectedModuleId={selectedModuleId}
        scrollProgress={scrollProgress}
        smoothMouse={smoothMouse}
        onSelectModule={handleSelectModule}
        onConsultation={onConsultation}
      />

      {/* TVOverlay - flip animation from diorama to video player */}
      <TVOverlay
        isActive={cinematicsMode}
        onClose={onCloseCinematics || (() => {})}
        scrollProgress={scrollProgress}
        smoothMouse={smoothMouse}
      />

      {/* BookingOverlay - floating booking panel */}
      <BookingOverlay
        isActive={bookingMode}
        onClose={onCloseBooking || (() => {})}
        scrollProgress={scrollProgress}
        smoothMouse={smoothMouse}
      />
    </>
  );
};

export const ModuleManager = React.memo(ModuleManagerInner);
export default ModuleManager;
