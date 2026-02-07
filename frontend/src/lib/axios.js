import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // by adding this field browser will sent the cookies to server automaticlly, on every single req
})

export default axiosInstance;