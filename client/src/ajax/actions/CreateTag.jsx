import axios from 'axios'

const CreateTag = data => {
  return axios
    .post('/CreateTag', {
      token: localStorage.getItem('token'),
      itemId: data.itemId,
      data: data.data,
    })
    .then(res => {
      return { execute: res.data.execute, message: res.data.message }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default CreateTag
