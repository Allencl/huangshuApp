module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  "plugins": [
    ["import", { libraryName: "@ant-design/react-native" }],
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@wis_component/origin': './wis_component/http/origin',
          '@wis_component/http': './wis_component/http/index',
          '@wis_component/form': './wis_component/form/index',
          '@wis_component/ul': './wis_component/ul/index',
        },
      },
    ],
  ]
};
