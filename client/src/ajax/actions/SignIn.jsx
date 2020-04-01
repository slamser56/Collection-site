import axios from 'axios'

const SignIn = user => {
  return axios
    .post('/SignIn', {
      login: user.login,
      password: user.password,
    })
    .then(res => {
      if (!res.data.status) {
        return { message: res.data.message, status: res.data.status }
      } else {
        localStorage.setItem('token', res.data.token)
        return { status: res.data.status, id: res.data.id }
      }
    })
    .catch(error => {
      console.log(error)
      return { status: false, message: 'Something wrong' }
    })
}

export default SignIn
