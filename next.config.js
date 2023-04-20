/** @type {import('next').NextConfig} */
const nodeExternals = require('webpack-node-externals');

const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  reactStrictMode: true, 
  // webpack: (config) => {
  //   config.cache.buildDependencies.mydeps = ['/nonexistent/file/location'];
  //   return config;
  // }
  // webpack: (
  //   config,
  //   { snapshot }
  // ) => {
  //   config.snapshot.managedPaths = [/^(.+?[\\/]node_modules)[\\/]((?!@antv)).*[\\/]*/];
  //   return config
  // },
  webpack: (config, {target, externalsPresets, externals }) =>  {
    config.target = 'node';
    config.externalsPresets = {node: true};
    config.externals = [nodeExternals()];
    return config
  }
}
