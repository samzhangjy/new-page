const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  fallbacks: {
    document: '/', // if you want to fallback to a custom page other than /_offline
  },
});

module.exports = withPWA(
  withBundleAnalyzer({
    reactStrictMode: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
  })
);
