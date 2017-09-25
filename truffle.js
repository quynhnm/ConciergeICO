// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '88.208.245.230',
      port: 8545,
      network_id: '*' // Match any network id
    }
  }
}
