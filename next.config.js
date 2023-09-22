/** @type {import('next').NextConfig} */
const nodeExternals = require('webpack-node-externals');

const nextConfig = {
  reactStrictMode: false,
}

module.exports = {
  reactStrictMode: false, 
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
