import axios from 'axios'

const CreateCollection = data => {
  return axios
    .post('/CreateCollection', {
      token: localStorage.getItem('token'),
      link_image: data.link_image,
      name: data.name,
      text: data.text,
      themeId: data.themeId,
      data: data.data,
      id: data.id,
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
export default CreateCollection
