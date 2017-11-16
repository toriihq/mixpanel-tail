#!/usr/bin/env node
const mixpanelTail = require('../src')
const minimist = require('minimist')
const meow = require('meow')

const options = {
  number: 'interval',
  string: 'apiSecret',
  boolean: 'verbose',
  alias: { 
    i: 'interval',
    a: 'apiSecret',
    v: 'verbose',
  },
  default: {
    interval: 5000,
    verbose: false
  }
}
const argv = minimist(process.argv.slice(2), options)

const cli = meow(`
    Usage
      $ mixpanel-tail -a YOUR_API_SECRET
 
    Options
      -a, --apiSecret  Mixpanel project API secret (required)
      -i, --interval   Interval in milliseconds. default: ${options.default.interval}
      -v, --verbose    Verbose logging
 
    Examples
      $ foo -a 3kh2g3kj5234fgj23423

      $ foo -a 3kh2g3kj5234fgj23423 -i 60000 (every 60 seconds)

      $ foo -a 3kh2g3kj5234fgj23423 -v (more logging)
      \n
`, options)

if (!argv.apiSecret) {
  console.log(cli.showHelp())
  process.exit(-1)
}

mixpanelTail(cli.flags)
