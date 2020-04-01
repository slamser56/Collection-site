import axios from 'axios'

const DeleteCollection = data => {
  return axios
    .post('/DeleteCollection', {
      token: localStorage.getItem('token'),
      id: data.id,
    })
    .then(res => {
      return { status: res.data.status, execute: res.data.execute, message: res.data.message }
    })
    .catch(error => {
      console.log(error)
      return { verify: false }
    })
}
export default DeleteCollection
