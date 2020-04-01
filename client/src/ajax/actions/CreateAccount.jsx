import axios from 'axios'

const CreateAccount = user => {
  return axios
    .post('/CreateAccount', {
      login: user.login,
      password: user.password,
      repassword: user.repassword,
      fullname: user.fullname,
      mail: user.mail,
    })
    .then(res => {
      if (!res.data.status) {
        return { message: res.data.message, fields: res.data.fields, status: res.data.status }
      } else {
        localStorage.setItem('token', res.data.token)
        return { redirect: true, status: res.data.status }
      }
    })
    .catch(err => {
      console.log(err)
      return { status: false, message: 'Something wrong.' }
    })
}

export default CreateAccount
