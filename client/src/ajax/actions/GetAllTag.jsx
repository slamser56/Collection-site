import axios from 'axios'

const GetAllTags = data => {
  return axios
    .post('/GetAllTags', {})
    .then(res => {
      return { execute: res.data.execute, message: res.data.message, data: res.data.data }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default GetAllTags
