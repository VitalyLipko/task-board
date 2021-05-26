import { resolve } from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const config: Configuration = {
  mode: 'production',
  entry: './back/app.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'app.js',
    path: resolve(__dirname, '../dist/back'),
  },
  externals: [nodeExternals() as any],
  externalsPresets: { node: true },
  plugins: [new CleanWebpackPlugin()],
};

export default config;
