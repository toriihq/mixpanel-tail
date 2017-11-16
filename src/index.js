const axios = require('axios')

const getLiveEvents = async ({ startTime = Date.now(), apiSecret }) => {
  try {
    return await axios.get('https://mixpanel.com/api/2.0/live', {
      auth: {
        username: apiSecret,
        password: null
      },    
      params: {
        start_time: startTime,
        client_version: 3
      } 
    })
  } catch (e) {
    return {
      error: e.message
    }
  }
}

const mixpanelTail = (options) => {
  const { 
    apiSecret,
    handler = console.log,
    interval = 5000,
    verbose = false
  } = options
  let {
    startTime = Date.now()
  } = options

  if (!apiSecret) {
    console.error('Error: Missing "apiSecret" for the Mixpanel project', '\n')
    return
  }

  const poll = async () => {
    verbose && console.log(`Request startTime: ${startTime}`)

    const response = await getLiveEvents({ startTime, apiSecret })
    if (response.error) {
      console.error('ERROR', response.error)
      return
    }

    const { data: { event_list } } = response
    verbose && console.log(`Response startTime: ${startTime} with event_list:`, event_list)

    if (!event_list || !event_list.length) {
      return
    }

    const lastEvent = event_list[event_list.length - 1]
    startTime = lastEvent['$ts'] + 1
    
    handler(event_list)
  }
  setInterval(poll, interval)
  poll()
}

module.exports = mixpanelTail
