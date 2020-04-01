import axios from 'axios'

const CreateItem = data => {
  return axios
    .post('/CreateItem', {
      token: localStorage.getItem('token'),
      collectionId: data.id,
      data: data.data,
      name: data.name,
    })
    .then(res => {
      return { execute: res.data.execute, message: res.data.message, itemId: res.data.itemId }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default CreateItem
