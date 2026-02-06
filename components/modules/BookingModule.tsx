import React from 'react';
import { ModuleContentProps } from '../../types/modules';
import { BookingPage } from '../BookingPage';

export const BookingModule: React.FC<ModuleContentProps> = () => {
  return (
    <div className="px-6 pt-6 pb-2 lg:px-8 lg:pt-8 lg:pb-2">
      <BookingPage />
    </div>
  );
};

export default BookingModule;
