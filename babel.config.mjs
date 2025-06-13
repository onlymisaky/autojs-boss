/**
 * @type {import('@babel/core').TransformOptions}
 */
const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '16',
        },
      },
    ],
  ],
};

export default babelConfig;
