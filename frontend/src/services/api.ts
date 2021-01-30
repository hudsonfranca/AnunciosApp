import axios from 'axios'

const api = axios.create({
  baseURL: process.env.BACKEND_SERVICE
})

export default api
