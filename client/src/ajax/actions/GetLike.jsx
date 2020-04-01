import axios from 'axios'

const GetLike = data => {
  return axios
    .post('/GetLike', {
      itemId: data.itemId,
    })
    .then(res => {
      return { data: res.data.data, execute: res.data.execute, message: res.data.message }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default GetLike
