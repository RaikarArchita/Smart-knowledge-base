import axios from "axios";

const axiosInstance = axios.create({
    headers:{
        'Content-Type':"application/json"
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 403 || error.response?.status === 401){
            localStorage.removeItem('accessToken')
            window.location.hash = '/sign-in'
        }

        return Promise.reject(error)
    }
)

export default axiosInstance