import React from 'react';

// View states for the module system
export type ViewState = 'diorama' | 'floating' | 'zoomed';

// Page identifiers (maps to nav tabs)
export type PageId = 'overview' | 'about' | 'offer' | 'consultation';

// 3D position in room space
export interface Position3D {
  x: number;
  y: number;
  z: number;
}

// Props passed to module content components
export interface ModuleContentProps {
  onClose: () => void;
  onConsultation?: () => void;
  isPreview?: boolean; // true = scaled-down preview in 3D card, false = full interactive
}

// Module metadata for registry
export interface ModuleMetadata {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ComponentType<ModuleContentProps>;
  page: PageId;
  // Base position in carousel (will be offset by carousel logic)
  basePosition: Position3D;
}

// State managed by ModuleManager
export interface ModuleManagerState {
  viewState: ViewState;
  activeModuleId: string | null;
  zoomProgress: number; // 0 = floating, 1 = fully zoomed
  hoveredModuleId: string | null;
}

// Props for Room3DEnhanced
export interface Room3DEnhancedProps {
  scrollProgress: number;
  smoothMouse: { x: number; y: number };
  modules: ModuleMetadata[];
  viewState: ViewState;
  activeModuleId: string | null;
  hoveredModuleId: string | null;
  zoomProgress: number;
  onModuleClick: (id: string) => void;
  onModuleHover: (id: string | null) => void;
}

// Props for ModuleZoomView
export interface ModuleZoomViewProps {
  module: ModuleMetadata | null;
  zoomProgress: number;
  onClose: () => void;
  onConsultation?: () => void;
}

// Easing functions
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeInOutSine = (t: number): number => (1 - Math.cos(t * Math.PI)) / 2;
