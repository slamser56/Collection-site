import axios from 'axios'

const CollectionMostItem = data => {
  return axios
    .post('/CollectionMostItem', {})
    .then(res => {
      return { execute: res.data.execute, message: res.data.message, data: res.data.data }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default CollectionMostItem
