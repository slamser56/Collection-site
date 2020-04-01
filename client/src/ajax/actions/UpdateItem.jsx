import axios from 'axios'

const UpdateItem = data => {
  return axios
    .post('/UpdateItem', {
      token: localStorage.getItem('token'),
      id: data.id,
      name: data.name,
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
export default UpdateItem
