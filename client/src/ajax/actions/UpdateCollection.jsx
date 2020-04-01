import axios from 'axios'

const UpdateCollection = data => {
  return axios
    .post('/UpdateCollection', {
      token: localStorage.getItem('token'),
      id: data.id,
      link_image: data.link_image,
      name: data.name,
      text: data.text,
      themeId: data.themeId,
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
export default UpdateCollection
