const path = require('path');

module.exports = {
  // other configurations...

  module: {
    rules: [
      // Other loaders...

      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset', // Use 'asset' instead of 'file-loader' for newer Webpack versions
        generator: {
          filename: 'screenshots/[name][ext]', // Output path within the build directory
        },
        // No need for 'context' and 'publicPath' here
      },
    ],
  },

  resolve: {
    alias: {
      images: path.resolve(__dirname, 'screenshots'), // Alias to the root 'screenshots' directory
    },
  },

  // other configurations...
};
