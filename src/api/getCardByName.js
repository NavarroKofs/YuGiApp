import configAxios from './configAxios'

function getCardsByName (name) {
  const axios = configAxios('public')
  if (!name) {
    return axios.get('')
  }
  return axios.get('', {
    params: {
      fname: name
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  })
}

export default getCardsByName
