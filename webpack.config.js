const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const webpack = require('webpack')
const path = require('path');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  entry: './src/main.ts',
  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({/* options: see below */ })]
  },
  plugins: [
    new webpack.DefinePlugin({
      global: {} // Fix missing symbol error when running in developer VM
    }),
  ]
});
