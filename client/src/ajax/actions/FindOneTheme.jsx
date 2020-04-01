import axios from 'axios'

const FindOneTheme = data => {
  return axios
    .post('/FindThemeOne', { id: data.id })
    .then(res => {
      return { execute: res.data.execute, theme: res.data.theme }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default FindOneTheme
