const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

const enviroment = dotenv.config().parsed;

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? 'source-map' : 'inline-source-map',
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    }
  },
  entry: {
    ui: './src/ui/ui.tsx',
    main: './src/main.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Permite incluir CSS fazendo "import './file.css'" no seu código TypeScript
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css'],
    plugins: [new TsconfigPathsPlugin({})]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.OPENAI_TOKEN': JSON.stringify(enviroment.OPENAI_TOKEN),
      'process.env.OPENAI_FIGMA_TO_CODE_PROMPT': JSON.stringify(enviroment.OPENAI_FIGMA_TO_CODE_PROMPT),
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/ui/ui.html',
      filename: 'ui.html',
      chunks: ['ui'],
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/ui/]),
  ],
});
