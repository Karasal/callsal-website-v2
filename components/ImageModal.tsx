import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useMobileAnimations } from '../hooks/useMobileAnimations';

interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  const { fadeProps, modalProps } = useMobileAnimations();

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          {...fadeProps}
          onClick={onClose}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-12 bg-black/95 backdrop-blur-3xl cursor-pointer"
        >
          <motion.div
            {...modalProps}
            className="max-w-7xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white/40 hover:text-white transition-colors p-2"
              aria-label="Close full size image"
            >
              <X size={32} />
            </button>
            <img
              src={src}
              className="w-full h-full object-contain rounded-xl border border-white/10"
              alt="Full size view"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
