import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        new URL('https://s3-minsk.cloud.mts.by:443/**')
    ],
  },
  output: "standalone",
  reactCompiler: true,
};

export default nextConfig;