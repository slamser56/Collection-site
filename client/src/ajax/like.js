import axios from 'axios'

export default {
    get: data => {
        return axios
            .post('/GetLike', {
                itemId: data.itemId,
            })
            .then(res => {
                return { data: res.data.data, execute: res.data.execute, message: res.data.message }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    set: data => {
        return axios
            .post('/SetLike', {
                token: localStorage.getItem('token'),
                itemId: data.itemId,
            })
            .then(res => {
                if (!res.data.status) {
                    return { status: false, execute: res.data.execute, message: res.data.message }
                } else {
                    return { status: true, execute: res.data.execute, message: res.data.message }
                }
            })
            .catch(error => {
                console.log(error)
                return { execute: false }
            })
    },
    unset: data => {
        return axios
          .post('/UnSetLike', {
            token: localStorage.getItem('token'),
            itemId: data.itemId,
          })
          .then(res => {
            if (!res.data.status) {
              return { status: false, execute: res.data.execute, message: res.data.message }
            } else {
              return { status: true, execute: res.data.execute, message: res.data.message }
            }
          })
          .catch(error => {
            console.log(error)
            return { execute: false }
          })
      }
}