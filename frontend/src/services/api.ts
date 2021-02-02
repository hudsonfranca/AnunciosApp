import axios from 'axios'

const api = axios.create({
  baseURL: 'http://backend-cluster-ip-service:3000'
})

export default api
