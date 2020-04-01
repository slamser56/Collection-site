import axios from 'axios'

const Search = data => {
  return axios
    .post('/search', {
      text: data.text,
    })
    .then(res => {
      return {
        data: res.data,
      }
    })
    .catch(error => {
      console.log(error)
      return { execute: false }
    })
}
export default Search
