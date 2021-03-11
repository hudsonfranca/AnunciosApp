const path = require('path')
const withImages = require('next-images')
const withSass = require('@zeit/next-sass')
const withLess = require('@zeit/next-less')
const withCSS = require('@zeit/next-css')

module.exports = withImages({
  esModule: true
})

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'scss')]
  }
}

module.exports = withCSS(
  withLess(
    withImages(
      withSass({
        env: {
          ANY_ENV_KEY: 'ANY_ENV_VARIABLE'
        }
      })
    )
  )
)
