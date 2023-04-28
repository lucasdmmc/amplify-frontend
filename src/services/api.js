import axios from "axios"
//https://faceliveness-backend.onrender.com/
export const api = axios.create({
  baseURL: "https://faceliveness-backend.onrender.com/"
})