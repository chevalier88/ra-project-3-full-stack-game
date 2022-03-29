const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: {
    // app: './src/index.js',
    entry: ['@babel/polyfill', './src/index.js'],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    fallback: {
      fs: false,
    },
  },
  output: {
    filename: '[name]-[contenthash].bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          'sass-loader',
        ],
      },
    ],
  },
};
