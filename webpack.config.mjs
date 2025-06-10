import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('webpack').Configuration}
 */
const webpackConfig = {
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.mjs', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  }
}

export default webpackConfig;