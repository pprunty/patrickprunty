/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out/",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
    nextImageExportOptimizer_remoteImageCacheTTL: "86400", // Cache for 1 day
  },
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  optimizeFonts: true,
  experimental: {
    swcMinify: true,
    scrollRestoration: true,
  },
};

export default nextConfig;
