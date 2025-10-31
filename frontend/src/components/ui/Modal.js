'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md', 
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEsc = true
}) => {
  const overlayRef = useRef(null);
  
  // Handle click outside
  const handleOverlayClick = (e) => {
    if (closeOnOutsideClick && overlayRef.current === e.target) {
      onClose();
    }
  };
  
  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (closeOnEsc && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Determine modal width based on size prop
  const getModalWidth = () => {
    switch (size) {
      case 'xs':
        return 'max-w-xs';
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case '3xl':
        return 'max-w-3xl';
      case '4xl':
        return 'max-w-4xl';
      case '5xl':
        return 'max-w-5xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-md';
    }
  };
  
  // Only render the modal if we're in the browser
  if (typeof window === 'undefined') {
    return null;
  }
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          />
          
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              className={`w-full ${getModalWidth()} bg-white rounded-lg shadow-xl overflow-hidden`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  {title && (
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  )}
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;