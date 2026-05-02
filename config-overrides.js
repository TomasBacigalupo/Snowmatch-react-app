const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    process: require.resolve('process/browser'),
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    buffer: require.resolve('buffer'),
    asset: require.resolve('assert'),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  // CRA's source-map-loader runs on node_modules; many packages ship maps that
  // point at missing files or webpack:// URLs, which spams harmless warnings.
  config.module.rules.forEach((rule) => {
    if (
      rule &&
      rule.enforce === 'pre' &&
      rule.loader &&
      String(rule.loader).includes('source-map-loader')
    ) {
      const prev = rule.exclude;
      rule.exclude = [
        ...(Array.isArray(prev) ? prev : prev != null ? [prev] : []),
        /node_modules/,
      ];
    }
  });

  return config;
};
