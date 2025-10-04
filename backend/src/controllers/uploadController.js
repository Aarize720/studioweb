const cloudinary = require('cloudinary').v2;
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload single image to Cloudinary
 */
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    throw new AppError('Aucun fichier fourni', 400);
  }
  
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'studioweb',
      resource_type: 'auto',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });
    
    logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);
    
    res.json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      }
    });
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    throw new AppError('Erreur lors de l\'upload de l\'image', 500);
  }
};

/**
 * Upload multiple images to Cloudinary
 */
exports.uploadMultipleImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError('Aucun fichier fourni', 400);
  }
  
  try {
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'studioweb',
        resource_type: 'auto',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      })
    );
    
    const results = await Promise.all(uploadPromises);
    
    const uploadedFiles = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: result.bytes
    }));
    
    logger.info(`${uploadedFiles.length} images uploaded to Cloudinary`);
    
    res.json({
      success: true,
      data: uploadedFiles
    });
  } catch (error) {
    logger.error('Cloudinary multiple upload error:', error);
    throw new AppError('Erreur lors de l\'upload des images', 500);
  }
};

/**
 * Delete image from Cloudinary
 */
exports.deleteImage = async (req, res) => {
  const { public_id } = req.body;
  
  if (!public_id) {
    throw new AppError('Public ID requis', 400);
  }
  
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result !== 'ok') {
      throw new AppError('Erreur lors de la suppression de l\'image', 500);
    }
    
    logger.info(`Image deleted from Cloudinary: ${public_id}`);
    
    res.json({
      success: true,
      message: 'Image supprimée avec succès'
    });
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw new AppError('Erreur lors de la suppression de l\'image', 500);
  }
};

/**
 * Get upload signature for client-side uploads
 */
exports.getUploadSignature = async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'studioweb';
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: folder
    },
    process.env.CLOUDINARY_API_SECRET
  );
  
  res.json({
    success: true,
    data: {
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder
    }
  });
};