/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, 'local.livamp.test', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at local.livamp.test:' + config.port);
  console.log('Opening your system browser...');
  open('http://local.livamp.test:' + config.port + '/webpack-dev-server/');
});
