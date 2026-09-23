import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        new URL('https://s3-minsk.cloud.mts.by:443/**')
    ],
  },
  output: "standalone",
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/order',
        destination: '/account/orders',
        permanent: true,
      },
      {
        source: '/purchases',
        destination: '/account/purchases',
        permanent: true,
      },
      {
        source: '/favourites',
        destination: '/account/favourites',
        permanent: true,
      },
      {
        source: '/comparison',
        destination: '/account/comparison',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;