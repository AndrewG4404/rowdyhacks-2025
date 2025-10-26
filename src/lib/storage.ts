// GoLoanMe - Cloudinary Storage Integration
// Upload images and PDFs to Cloudinary

import { v2 as cloudinary } from 'cloudinary';
import type { CloudinarySignature } from '@/types';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Configure Cloudinary
if (CLOUD_NAME && API_KEY && API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
} else {
  console.warn('⚠️ Cloudinary environment variables not configured');
}

/**
 * Upload PDF buffer to Cloudinary
 */
export async function uploadPDF(
  pdfBuffer: Buffer,
  filename: string
): Promise<string> {
  try {
    const base64Data = pdfBuffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'goloanme/terms',
      resource_type: 'raw',
      public_id: filename,
      overwrite: true,
    });

    console.log(`✅ PDF uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error('PDF upload failed:', error);
    throw new Error('Failed to upload PDF to Cloudinary');
  }
}

/**
 * Upload image buffer to Cloudinary
 */
export async function uploadImage(
  imageBuffer: Buffer,
  filename: string,
  folder: 'posts' | 'avatars' = 'posts'
): Promise<string> {
  try {
    const base64Data = imageBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `goloanme/${folder}`,
      public_id: filename,
      overwrite: true,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    console.log(`✅ Image uploaded: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Generate signed upload parameters for client-side uploads
 */
export function generateUploadSignature(folder: string = 'goloanme/posts'): CloudinarySignature {
  if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
    throw new Error('Cloudinary not configured');
  }

  const timestamp = Math.round(Date.now() / 1000);
  
  const signature = cloudinary.utils.api_sign_request(
    { folder, timestamp },
    API_SECRET
  );

  return {
    timestamp,
    signature,
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
    folder,
  };
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFile(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Deleted: ${publicId}`);
  } catch (error) {
    console.error('File deletion failed:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}

/**
 * Validate image file (use before upload)
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 5MB.',
    };
  }

  return { valid: true };
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/v\d+\/(.+)\.[a-z]+$/);
    return match?.[1] || null;
  } catch {
    return null;
  }
}

