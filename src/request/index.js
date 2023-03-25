import axios from 'axios'
import request from "../request.js";
let service = axios.create({
    // baseURL:"https://netease-cloud-music-api-inky-five.vercel.app",
    baseURL:"http://localhost:3000",
    // baseURL:"http://47.98.158.14:3000/",
    timeout:8000,
})

export default service