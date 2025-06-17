module.exports = {
  presets: ['babel-preset-expo'], // o 'module:metro-react-native-babel-preset' si no usas Expo
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        allowUndefined: true,
      },
    ],
  ],
};
