import axios from 'axios'

const FindTags = data => {
  return axios
    .post('/FindTags', {
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
export default FindTags
