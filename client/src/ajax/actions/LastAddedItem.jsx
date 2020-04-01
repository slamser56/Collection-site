import axios from 'axios'

const LastAddedItem = data => {
  return axios
    .post('/LastAddedItem', {})
    .then(res => {
      return { execute: res.data.execute, message: res.data.message, data: res.data.data }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default LastAddedItem
