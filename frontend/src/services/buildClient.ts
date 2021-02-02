import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL: 'http://backend-cluster-ip-service',
      headers: req.headers
    })
  } else {
    // We must be on the browser

    return axios.create({
      baseURL: '/'
    })
  }
}

export default buildClient
