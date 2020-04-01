import axios from 'axios'

const GetComment = data => {
  return axios
    .post('/GetComment', {
      token: localStorage.getItem('token'),
      id: data.id,
    })
    .then(res => {
      return { execute: res.data.execute, message: res.data.message, data: res.data.data }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default GetComment
