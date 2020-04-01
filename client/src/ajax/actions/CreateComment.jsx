import axios from 'axios'

const CreateComment = data => {
  return axios
    .post('/CreateComment', {
      token: localStorage.getItem('token'),
      text: data.text,
      itemId: data.itemId,
    })
    .then(res => {
      return {
        data: res.data.data,
        status: true,
        execute: res.data.execute,
        message: res.data.message,
      }
    })
    .catch(error => {
      console.log(error)
      return { status: false }
    })
}
export default CreateComment
