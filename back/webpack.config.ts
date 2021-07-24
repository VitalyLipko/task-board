import { resolve } from 'path';
import { Configuration } from 'webpack';
// import nodeExternals from 'webpack-node-externals';

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
    clean: true,
    filename: 'app.js',
    path: resolve(__dirname, '../dist/back'),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  /* externals: [nodeExternals() as any],
  externalsPresets: { node: true },*/
};

export default config;
