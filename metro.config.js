const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Fix: Supabase realtime-js requires tslib - ensure Metro resolves it
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  tslib: path.resolve(__dirname, 'node_modules/tslib'),
};

module.exports = config;
