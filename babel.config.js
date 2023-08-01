module.exports = function(api) {
  api.cache(() => process.env.NODE_ENV);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: ['react-native-reanimated/plugin', 'macros']
  };
};