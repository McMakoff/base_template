const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const fileName = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
  const configObj = {
    splitChunks: {
      chunks: 'all'
    }
  };

  if (!isDev) {
    configObj.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin()
    ];
  }

  return configObj;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    filename: `./js/${fileName('js')}`,
    path: path.resolve(__dirname, 'app'),
    clean: true,
    publicPath: '',
    assetModuleFilename: pathData => {
      const filepath = path.dirname(pathData.filename).split('/').slice(1).join('/');
      return `/img${filepath}/[name][ext]`;
    }
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'app'),
    },
    open: true,
    compress: true,
    hot: true,
    port: 3000,
  },
  optimization: optimization(),
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: !isDev,
      }
    }),
    new MiniCssExtractPlugin({
      filename: `./style/${fileName('css')}`
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, 'src'),
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'app/assets')
        }
      ]
    }),
  ],
  devtool: isDev ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(?:|woff2|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: './fonts/[name].[ext]'
        }
      },
    ],
  }
};