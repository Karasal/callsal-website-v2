import React from 'react';
import { ModuleContentProps } from '../../types/modules';
import { TheOffer } from '../TheOffer';

export const TheOfferModule: React.FC<ModuleContentProps> = ({
  onClose,
  onConsultation,
}) => {
  return (
    <div className="pb-8">
      <TheOffer
        onConsultation={() => { onClose(); onConsultation?.(); }}
      />
    </div>
  );
};

export default TheOfferModule;
