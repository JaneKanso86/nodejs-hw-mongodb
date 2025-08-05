import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

export const uploadToCloudinary = multer({ storage });
