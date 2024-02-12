import axios from 'axios'

const baseUrl = `${import.meta.env.VITE_IMG_API_URL}`;

const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getAllImages() {
    return apiClient.get('/')
  },
  getImage(id) {
    return apiClient.get('/' + id)
  },
  pushImage(image) {
    return apiClient.post('/', image)
  }
}