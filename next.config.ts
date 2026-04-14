import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    proxyClientMaxBodySize: '20mb',
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  cacheComponents: true,
  cacheLife: {
    admin: {
      stale: 60 * 60 * 24 * 10,
      revalidate: 60 * 60 * 24 * 15,
      expire: 60 * 60 * 24 * 30,
    },
  },
  reactCompiler: true,

  webpack(config: Configuration): Configuration {
    const fileLoaderRule = config.module!.rules!.find((rule): boolean => {
      if (typeof rule !== 'object' || rule === null || !('test' in rule)) {
        return false;
      }

      const { test } = rule as RuleSetRule;

      return test instanceof RegExp && test.test('.svg');
    }) as RuleSetRule;

    if (!fileLoaderRule) {
      return config;
    }

    config.module!.rules!.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        ...(fileLoaderRule.issuer ? { issuer: fileLoaderRule.issuer } : {}),
        resourceQuery: {
          not: [...((fileLoaderRule.resourceQuery as { not?: (string | RegExp)[] })?.not || []), /url/],
        },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              icon: true,
              dimensions: false,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: { removeViewBox: false },
                    },
                  },
                  'removeXMLNS',
                  {
                    name: 'convertColors',
                    params: { currentColor: true },
                  },
                ],
              },
              svgProps: {
                'aria-hidden': 'true',
                focusable: 'false',
              },
            },
          },
        ],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  devIndicators: false,
  images: {
    remotePatterns: [
      new URL('https://s3.regru.cloud/bushido/**'),
      new URL('https://955a99af-74d7-4b91-a36a-20819b829e85.selstorage.ru/**'),
      new URL('https://www.example.com/**'),
    ],
  },
};

export default nextConfig;
