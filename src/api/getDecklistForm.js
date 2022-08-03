import configAxios from './configAxios'

function getDecklistForm () {
  const axios = configAxios('public', 'decklist')
  return axios.get('', {
    responseType: 'arraybuffer'
  })
}

export default getDecklistForm
