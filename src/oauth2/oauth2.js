if (process.env.NODE_ENV === 'production') {
  module.exports = require('./oauth2.prod.js');
} else {
  module.exports = require('./oauth2.dev.js');
}