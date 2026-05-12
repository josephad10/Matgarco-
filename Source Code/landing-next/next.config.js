/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // التصريح الشامل لصور Cloudinary
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // حافظنا على صور Unsplash عشان تصميمك ميبظش
      },
    ],
  },
};

module.exports = nextConfig;
