import axios from 'axios'

const buildClient = ({ req }) => {
  return axios.create({
    baseURL: 'http://backend-cluster-ip-service',
    headers: req.headers
  })
}

export default buildClient
