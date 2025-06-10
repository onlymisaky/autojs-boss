/**
 * @type {import('@babel/core').TransformOptions}
 */

console.log(123)

const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '16'
        }
      }
    ]
  ]
}

export default babelConfig;