import React, { useState, useEffect, useCallback } from 'react';
import {
  ViewState,
  ModuleMetadata,
} from '../types/modules';

// Import Room3DEnhanced for canvas-rendered 3D room
import { Room3DEnhanced } from './Room3DEnhanced';
// Import Module3DOverlay for HTML content positioned in 3D space
import { Module3DOverlay } from './Module3DOverlay';
// Import overlays
import { TVOverlay } from './TVOverlay';
import { BookingOverlay } from './BookingOverlay';
// Import module components
import { ArmoryModule } from './modules/ArmoryModule';
import { CinematicsModule } from './modules/CinematicsModule';
import { MeetSalmanModule } from './modules/MeetSalmanModule';
import { TheOfferModule } from './modules/TheOfferModule';
import { BookingModule } from './modules/BookingModule';

// Icons for module selector
const ArmoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
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

export const ModuleManager: React.FC<ModuleManagerProps> = ({
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
  const [viewState, setViewState] = useState<ViewState>('diorama');
  const [selectedModuleId, setSelectedModuleId] = useState('armory');

  // Module registry
  const modules = createModuleRegistry();

  // Determine view state based on scroll progress
  useEffect(() => {
    if (scrollProgress < 0.8) {
      setViewState('diorama');
    } else {
      setViewState('floating');
    }
  }, [scrollProgress]);

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
        viewState={viewState}
        activeModuleId={null}
        zoomProgress={0}
        cinematicsMode={cinematicsMode || bookingMode}
      />

      {/* Module3DOverlay renders content panel + selector in 3D space */}
      <Module3DOverlay
        modules={modules}
        viewState={viewState}
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

export default ModuleManager;
