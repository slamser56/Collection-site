import axios from 'axios'

const UnSetLike = data => {
  return axios
    .post('/UnSetLike', {
      token: localStorage.getItem('token'),
      itemId: data.itemId,
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
export default UnSetLike
