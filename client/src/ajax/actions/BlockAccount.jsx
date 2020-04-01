import axios from 'axios'

const BlockAccount = data => {
  return axios
    .post('/BlockAccount', {
      token: localStorage.getItem('token'),
      login: data.login,
    })
    .then(res => {
      if (!res.data.status) {
        return { status: false, execute: res.data.execute, message: res.data.message }
      } else {
        return { status: true, execute: res.data.execute, message: res.data.message }
      }
    })
    .catch(error => {
      console.log(error)
      return { status: false }
    })
}
export default BlockAccount
