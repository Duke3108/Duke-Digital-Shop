import axios from '../axios'


export const apiGetCategories = () => axios({
    url: '/prodcate',
    method: 'get'
})