import axios from "../axios";

export const apiGetUserOrders = (params) => axios({
    url: `/order/`,
    method: 'get',
    params
})

export const apiGetAdminOrders = (params) => axios({
    url: `/order/admin`,
    method: 'get',
    params
})