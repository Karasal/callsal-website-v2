import React from 'react';
import { ModuleContentProps } from '../../types/modules';
import { MeetSalman } from '../MeetSalman';

export const MeetSalmanModule: React.FC<ModuleContentProps> = ({
  onClose,
  onConsultation,
}) => {
  return (
    <MeetSalman
      onNext={() => {}}
      onConsultation={() => { onClose(); onConsultation?.(); }}
    />
  );
};

export default MeetSalmanModule;
