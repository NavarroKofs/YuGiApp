import configAxios from './configAxios'

function getCardsById (ids = []) {
  let idsList = ''
  ids = ids.filter((item, index) => {
    return ids.indexOf(item) === index
  })
  ids.map(id => {
    if (idsList === '') {
      idsList = id
    } else {
      idsList = idsList + ',' + id
    }
  })
  const axios = configAxios('public')
  return axios.get('', {
    params: {
      id: idsList
    },
    crossDomain: true
  })
}

export default getCardsById
