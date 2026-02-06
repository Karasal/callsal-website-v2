import React from 'react';

// Props passed to module content components
export interface ModuleContentProps {
  onClose: () => void;
  onConsultation?: () => void;
}

// Module metadata for registry
export interface ModuleMetadata {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ComponentType<ModuleContentProps>;
}
