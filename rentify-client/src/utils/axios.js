import axios from "axios";
export const instance = axios.create({
    baseURL: "https://rentify-gzq9.onrender.com"
})