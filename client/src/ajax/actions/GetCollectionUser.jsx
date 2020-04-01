import axios from 'axios'

const GetCollectionUser = data => {
  return axios
    .post('/GetCollectionUser', {
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
      return { verify: false }
    })
}
export default GetCollectionUser
