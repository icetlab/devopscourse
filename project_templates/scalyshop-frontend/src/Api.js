import axios from 'axios'
import https from 'https'

// note that environment variables that should be available in the browser
// need to start with VUE_APP_*
// (see https://cli.vuejs.org/guide/mode-and-env.html#environment-variables)
var backend = process.env.VUE_APP_BACKEND_HOST || 'localhost'
var port = process.env.VUE_APP_BACKEND_PORT || '5045'
var protocol = process.env.VUE_APP_BACKEND_PROTOCOL || 'http'

// format: http://localhost:5000/api
var backendApiEndpoint = protocol + '://' + backend + ':' + port + '/api'
console.log('Using backend endpoint: ' + backendApiEndpoint)

export const Api = axios.create({
  baseURL: backendApiEndpoint,
  // necessary since we don't have valid https certificates for our backend / frontend
  // VERY BAD IDEA IN A REAL APP
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})
