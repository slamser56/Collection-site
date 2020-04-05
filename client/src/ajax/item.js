import axios from 'axios'

export default {
    lastAddedItems: data => {
        return axios
            .post('/LastAddedItem', {})
            .then(res => {
                return { execute: res.data.execute, message: res.data.message, data: res.data.data }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    getUserItems: data => {
        return axios
            .post('/getUserItems', {
                token: localStorage.getItem('token'),
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
    delete: data => {
        return axios
            .post('/DeleteItem', {
                token: localStorage.getItem('token'),
                id: data.id,
            })
            .then(res => {
                return { execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    getItem: data => {
        return axios
            .post('/getItem', {
                token: localStorage.getItem('token'),
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
            .post('/UpdateItem', {
                token: localStorage.getItem('token'),
                id: data.id,
                name: data.name,
                data: data.data,
            })
            .then(res => {
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    create: data => {
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
}