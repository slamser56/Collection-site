import axios from 'axios'

export default {
    create: user => {
        return axios
            .post('/CreateAccount', {
                login: user.login,
                password: user.password,
                repassword: user.repassword,
                fullname: user.fullname,
                mail: user.mail,
            })
            .then(res => {
                if (!res.data.status) {
                    return { message: res.data.message, fields: res.data.fields, status: res.data.status }
                } else {
                    localStorage.setItem('token', res.data.token)
                    return { redirect: true, status: res.data.status }
                }
            })
            .catch(err => {
                console.log(err)
                return { status: false, message: 'Something wrong.' }
            })
    },
    verify: user => {
        return axios
            .post('/VerifyToken', {
                token: localStorage.getItem('token'),
            })
            .then(res => {
                if (!res.data.status) {
                    localStorage.removeItem('token')
                    return { status: res.data.status }
                } else {
                    return {
                        login: res.data.login,
                        id: res.data.id,
                        admin: res.data.admin,
                        status: res.data.status,
                    }
                }
            })
            .catch(error => {
                console.log(error)
                return { status: false }
            })
    },
    signin: user => {
        return axios
            .post('/SignIn', {
                login: user.login,
                password: user.password,
            })
            .then(res => {
                if (!res.data.status) {
                    return { message: res.data.message, status: res.data.status }
                } else {
                    localStorage.setItem('token', res.data.token)
                    return { status: res.data.status, id: res.data.id }
                }
            })
            .catch(error => {
                console.log(error)
                return { status: false, message: 'Something wrong' }
            })
    },
    get: user => {
        return axios
            .post('/getProfile', {
                id: user.id,
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
            .post('/DeleteAccount', {
                token: localStorage.getItem('token'),
                id: data.id,
            })
            .then(res => {
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { status: false }
            })
    },
    getAll: data => {
        return axios
            .post('/GetAllAccount', {
                token: localStorage.getItem('token'),
            })
            .then(res => {
                    return { status: res.data.status, UserMap: res.data.UserMap, admin: res.data.admin }
            })
            .catch(error => {
                console.log(error)
                return { status: false }
            })
    },
    block: data => {
        return axios
            .post('/BlockAccount', {
                token: localStorage.getItem('token'),
                id: data.id,
            })
            .then(res => {
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { status: false }
            })
    },
    unBlock: data => {
        return axios
            .post('/UnBlockAccount', {
                token: localStorage.getItem('token'),
                id: data.id,
            })
            .then(res => {
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { status: false }
            })
    },
    setAdmin: data => {
        return axios
            .post('/SetAdmin', {
                token: localStorage.getItem('token'),
                id: data.id,
            })
            .then(res => {
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { status: false }
            })
    },
    unSetAdmin: data => {
        return axios
            .post('/UnSetAdmin', {
                token: localStorage.getItem('token'),
                id: data.id,
            })
            .then(res => {
                    return { status: res.data.status, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { status: false }
            })
    },
    getComment: data => {
        return axios
            .post('/GetComment', {
                token: localStorage.getItem('token'),
                id: data.id,
            })
            .then(res => {
                return { execute: res.data.execute, message: res.data.message, data: res.data.data }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    }
}
