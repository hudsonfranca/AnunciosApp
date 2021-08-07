const path = require('path')


module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'scss')]
  },
  env: {
    BACKEND_URL: 'http://localhost:4000'
  }
}
