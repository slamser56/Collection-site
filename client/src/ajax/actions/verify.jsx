import axios from 'axios'

const Verify = user => {
  return axios
    .post('/VerifyToken', {
      token: localStorage.getItem('token'),
    })
    .then(res => {
      if (!res.data.status) {
        localStorage.removeItem('token')
        return { status: res.data.status }
      } else {
        return {
          login: res.data.login,
          id: res.data.id,
          admin: res.data.admin,
          status: res.data.status,
        }
      }
    })
    .catch(error => {
      console.log(error)
      return { status: false }
    })
}
export default Verify
