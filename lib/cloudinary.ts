// lib/cloudinary.ts
import 'server-only';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

// The Cloudinary SDK will automatically configure itself using the
// CLOUDINARY_URL environment variable if it's present.
// We no longer need the explicit cloudinary.config() call.

export const uploadToCloudinary = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    // Specify a folder in Cloudinary to keep your project's images organized.
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'goodie_products' },
      (error, result) => {
        if (error) {
          // If there's an error, reject the promise.
          return reject(error);
        }
        if (result) {
          // If the upload is successful, resolve the promise with the result.
          resolve(result);
        } else {
          // A safeguard for unexpected cases where there is no result and no error.
          reject(new Error('Cloudinary upload resulted in an undefined result.'));
        }
      }
    );

    // Pipe the file buffer into the Cloudinary upload stream.
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};