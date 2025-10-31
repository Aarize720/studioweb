'use client';

import { FiAlertTriangle, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning', // 'warning', 'info', 'success', 'error'
  confirmButtonType = 'primary', // 'primary', 'danger', 'success', 'warning', 'info'
  isLoading = false
}) => {
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <FiAlertTriangle className="w-10 h-10 text-yellow-500" />;
      case 'info':
        return <FiInfo className="w-10 h-10 text-blue-500" />;
      case 'success':
        return <FiCheckCircle className="w-10 h-10 text-green-500" />;
      case 'error':
        return <FiXCircle className="w-10 h-10 text-red-500" />;
      default:
        return <FiAlertTriangle className="w-10 h-10 text-yellow-500" />;
    }
  };
  
  // Get button color based on type
  const getButtonClass = () => {
    switch (confirmButtonType) {
      case 'primary':
        return 'bg-primary hover:bg-primary-dark text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-primary hover:bg-primary-dark text-white';
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg ${getButtonClass()} transition-colors`}
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;