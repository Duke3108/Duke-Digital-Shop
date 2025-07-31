import axios from '../axios'

export const apiRegister = (data) => axios({
    url: '/user/register',
    method: 'post',
    data,
    withCredentials: true
})

export const apiLogin = (data) => axios({
    url: '/user/login',
    method: 'post',
    data
})

export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'post',
    data,
    withCredentials: true
})

export const apiResetPassword = (data) => axios({
    url: '/user/resetpassword',
    method: 'put',
    data,
    withCredentials: true
})

export const apiGetCurrentUser = () => axios({
    url: '/user/current',
    method: 'get',
})

export const apiGetAllUsers = (params) => axios({
    url: '/user/',
    method: 'get',
    params
})

export const apiUpdateUser = (data, uid) => axios({
    url: `/user/${uid}`,
    method: 'put',
    data
})

export const apiDeleteUser = (uid) => axios({
    url: `/user/${uid}`,
    method: 'delete'
})

export const apiUpdateCurrentUser = (data) => axios({
    url: `/user/current`,
    method: 'put',
    data
})