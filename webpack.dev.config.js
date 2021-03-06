const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "[name].css"
});

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'client', 'js', 'app.js')
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'public')
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss|\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // If you are having trouble with urls not resolving add this setting.
                // See https://github.com/webpack-contrib/css-loader#url
                url: false,
                minimize: true,
                sourceMap: true
              }
            }, 
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  path.resolve(__dirname, 'node_modules'),
                  path.resolve(__dirname, 'client', 'css')
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.svg$/,
        loader: 'svg-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'img-loader'
        ]
      },
      {
        test: /\.js$/,
        // Sticky Bits didn't transpile :/
        // exclude: /(node_modules|bower_components)/,
        exclude: /node_modules\/hls.js/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    extractSass
  ]
};
