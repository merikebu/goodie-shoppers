// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This configuration allows Next.js to optimize images from the specified domains.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // For the hero background image (if still in use)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google user profile pictures
        port: '',
        pathname: '/**',
      },
      // --- ADD THIS NEW BLOCK FOR CLOUDINARY ---
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // The hostname for Cloudinary images
        port: '',
        pathname: '/**', // Allows images from any path on this hostname
      },
      // ------------------------------------
    ],
  },
};

module.exports = nextConfig;