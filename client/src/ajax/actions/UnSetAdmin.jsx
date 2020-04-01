import axios from 'axios'

const UnSetAdmin = data => {
  return axios
    .post('/UnSetAdmin', {
      token: localStorage.getItem('token'),
      login: data.login,
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
export default UnSetAdmin
