import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  webpack(config): Configuration {
    const fileLoaderRule = config.module.rules.find(
      (rule: RuleSetRule): boolean => rule.test instanceof RegExp && rule.test.test('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },

      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  images: {
    remotePatterns: [new URL('https://955a99af-74d7-4b91-a36a-20819b829e85.selstorage.ru/**')],
  },
};

export default nextConfig;
