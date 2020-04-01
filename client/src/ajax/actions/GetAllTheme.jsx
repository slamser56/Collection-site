import axios from 'axios'

const GetAllTheme = data => {
  return axios
    .post('/FindTheme', {})
    .then(res => {
      return { execute: true, theme: res.data.theme }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default GetAllTheme
