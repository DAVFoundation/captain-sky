const webpack = require('webpack');
module.exports = options => {
    return {
      entry: './index.js',
      output: {
        filename: 'bundle.js',
      },
      module: {
        rules: [
          {
            test: /.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            CAPTAIN_HOST: JSON.stringify('localhost'),
            CAPTAIN_PORT: JSON.stringify('8887'),
          }
        })
      ],
    }
  }