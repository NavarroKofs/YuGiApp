import configAxios from './configAxios'

function getCardsByName (name) {
  const axios = configAxios('public')
  if (!name) {
    return axios.get('')
  }
  return axios.get('', {
    params: {
      fname: name
    }
  })
}

export default getCardsByName
