import axios from 'axios'

export default {
    collectionMostItems: data => {
        return axios
            .post('/CollectionMostItem', {})
            .then(res => {
                return { execute: res.data.execute, message: res.data.message, data: res.data.data }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    getCollectionsUser: data => {
        return axios
            .post('/GetCollectionUser', {
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
            .post('/DeleteCollection', {
                token: localStorage.getItem('token'),
                id: data.id,
            })
            .then(res => {
                return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    getCollection: data => {
        return axios
            .post('/getCollection', {
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
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    create: data => {
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
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    search: data => {
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
}

