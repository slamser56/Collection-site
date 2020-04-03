import axios from 'axios'

export default {
    getOneTheme: data => {
        return axios
            .post('/FindThemeOne', { id: data.id })
            .then(res => {
                return { execute: res.data.execute, theme: res.data.theme }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    getAllTheme: data => {
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

}