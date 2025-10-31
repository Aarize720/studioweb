'use client';

import { useState, useRef, useEffect } from 'react';
import { FiUpload, FiX, FiFile, FiImage, FiFileText, FiPaperclip } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploader = ({
  onChange,
  value = [],
  multiple = false,
  accept = '*/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  disabled = false,
  preview = true,
  previewSize = 'md',
  onError,
  className = '',
  uploadText = 'Glissez-déposez vos fichiers ici ou cliquez pour parcourir',
  uploadSubText = 'Formats acceptés: JPG, PNG, PDF, etc. • Max 5MB par fichier',
  showFileList = true
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // Initialize files from value prop
  useEffect(() => {
    if (value && Array.isArray(value)) {
      setFiles(value);
    }
  }, []);
  
  // Get file icon based on type
  const getFileIcon = (file) => {
    const type = file.type || '';
    
    if (type.startsWith('image/')) {
      return <FiImage className="w-5 h-5" />;
    } else if (type.includes('pdf')) {
      return <FiFileText className="w-5 h-5" />;
    } else if (type.includes('text')) {
      return <FiFileText className="w-5 h-5" />;
    } else {
      return <FiFile className="w-5 h-5" />;
    }
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (disabled) return;
    
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Process files (validation, preview, etc.)
  const processFiles = (selectedFiles) => {
    // Check max files
    if (!multiple && selectedFiles.length > 1) {
      selectedFiles = [selectedFiles[0]];
    }
    
    if (multiple && files.length + selectedFiles.length > maxFiles) {
      if (onError) {
        onError(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers`);
      }
      selectedFiles = selectedFiles.slice(0, maxFiles - files.length);
    }
    
    // Validate files
    const validFiles = selectedFiles.filter(file => {
      // Check file size
      if (file.size > maxSize) {
        if (onError) {
          onError(`Le fichier "${file.name}" dépasse la taille maximale de ${formatFileSize(maxSize)}`);
        }
        return false;
      }
      
      // Check file type if accept is specified
      if (accept !== '*/*') {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        
        // Handle wildcards like image/* or application/*
        const isAccepted = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const category = type.split('/')[0];
            return fileType.startsWith(category + '/');
          }
          return type === fileType;
        });
        
        if (!isAccepted) {
          if (onError) {
            onError(`Le fichier "${file.name}" n'est pas d'un format accepté`);
          }
          return false;
        }
      }
      
      return true;
    });
    
    // Create preview URLs for images
    const filesWithPreview = validFiles.map(file => {
      const isImage = file.type.startsWith('image/');
      
      return {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: isImage && preview ? URL.createObjectURL(file) : null
      };
    });
    
    // Update files state
    const newFiles = multiple ? [...files, ...filesWithPreview] : filesWithPreview;
    setFiles(newFiles);
    
    // Call onChange with file objects
    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0]);
    }
  };
  
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };
  
  // Remove file
  const removeFile = (index) => {
    if (disabled) return;
    
    const newFiles = [...files];
    
    // Revoke object URL to avoid memory leaks
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    // Call onChange with updated files
    if (onChange) {
      onChange(multiple ? newFiles : newFiles[0] || null);
    }
  };
  
  // Get preview size class
  const getPreviewSizeClass = () => {
    switch (previewSize) {
      case 'sm':
        return 'w-16 h-16';
      case 'md':
        return 'w-24 h-24';
      case 'lg':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };
  
  return (
    <div className={className}>
      {/* File Input */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
        />
        
        <FiUpload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-700 mb-1">{uploadText}</p>
        <p className="text-xs text-gray-500 mt-2">{uploadSubText}</p>
      </div>
      
      {/* File Preview */}
      {showFileList && files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">
            Fichiers sélectionnés ({files.length})
          </h4>
          
          <div className="space-y-2">
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {file.preview ? (
                      <div className={`${getPreviewSizeClass()} rounded overflow-hidden bg-gray-200 flex-shrink-0`}>
                        <img 
                          src={file.preview} 
                          alt={file.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`${getPreviewSizeClass()} rounded bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0`}>
                        {getFileIcon(file)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;