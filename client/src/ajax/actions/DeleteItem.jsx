import axios from 'axios'

const DeleteItem = data => {
  return axios
    .post('/DeleteItem', {
      token: localStorage.getItem('token'),
      id: data.id,
    })
    .then(res => {
      return { execute: res.data.execute, message: res.data.message }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default DeleteItem
