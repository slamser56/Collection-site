import axios from 'axios'

export default {
    getAllTags: data => {
        return axios
            .post('/GetAllTags', {})
            .then(res => {
                return { execute: res.data.execute, message: res.data.message, data: res.data.data }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    getTag: data => {
        return axios
            .post('/FindTags', {
                id: data.id,
            })
            .then(res => {
                return {
                    execute: res.data.execute,
                    data: res.data.data,
                    message: res.data.message,
                }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    update: data => {
        return axios
            .post('/UpdateTags', {
                token: localStorage.getItem('token'),
                itemId: data.itemId,
                data: data.data,
            })
            .then(res => {
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { status: false }
            })
    },
    create: data => {
        return axios
            .post('/CreateTag', {
                token: localStorage.getItem('token'),
                itemId: data.itemId,
                data: data.data,
            })
            .then(res => {
                return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    }
}