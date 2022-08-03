import axios from 'axios'

function configAxios (ambit = 'public', module = 'cards') {
  const headers = {
    'Access-Control-Allow-Origin': true
  }

  if (ambit === 'private') {
    headers.token = localStorage.token ? localStorage.token : ''
  }

  const apiURL = module === 'decklist' ? '/apiKonami' : '/api'

  const axiosInstance = axios.create({
    baseURL: apiURL,
    headers,
    timeout: 1000000
  })

  return {
    apiURL,
    get: axiosInstance.get,
    post: axiosInstance.post,
    put: axiosInstance.put,
    deleteRequest: axiosInstance.delete
  }
}

export default configAxios
