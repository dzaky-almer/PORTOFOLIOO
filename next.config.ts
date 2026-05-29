import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.glb": {
        type: "asset",
      },
    },
  },
};

export default nextConfig;
