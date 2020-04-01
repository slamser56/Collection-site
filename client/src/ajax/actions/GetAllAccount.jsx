import axios from 'axios'

const GetAllAccount = data => {
  return axios
    .post('/GetAllAccount', {
      token: localStorage.getItem('token'),
    })
    .then(res => {
      if (!res.data.status) {
        return { verify: false }
      } else {
        return { verify: res.data.verify, UserMap: res.data.UserMap, admin: res.data.admin }
      }
    })
    .catch(error => {
      console.log(error)
      return { verify: false }
    })
}
export default GetAllAccount
