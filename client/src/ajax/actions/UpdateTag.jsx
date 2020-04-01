import axios from 'axios'

const UpdateTags = data => {
  return axios
    .post('/UpdateTags', {
      token: localStorage.getItem('token'),
      itemId: data.itemId,
      data: data.data,
    })
    .then(res => {
      if (!res.data.status) {
        return { verify: false, execute: res.data.execute, message: res.data.message }
      } else {
        return { verify: true, execute: res.data.execute, message: res.data.message }
      }
    })
    .catch(error => {
      console.log(error)
      return { verify: false }
    })
}
export default UpdateTags
