import axios from 'axios'

const FindItem = data => {
  return axios
    .post('/FindItem', {
      token: localStorage.getItem('token'),
      id: data.id,
    })
    .then(res => {
      return {
        execute: res.data.execute,
        data: res.data.data,
        message: res.data.message,
      }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default FindItem
