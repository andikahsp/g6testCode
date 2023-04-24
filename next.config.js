/** @type {import('next').NextConfig} */
const nodeExternals = require('webpack-node-externals');

const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  reactStrictMode: true, 
  // webpack: (config) => {
  //   config.cache.buildDependencies.mydeps = ['/path/to/lockfile'];
  //   return config;
  // }
  webpack: (
    config,
  ) => {
    config.snapshot.managedPaths = [/^(.+?[\\/]node_modules)[\\/]((antv)).*[\\/]*/];
    return config;
  },

}
