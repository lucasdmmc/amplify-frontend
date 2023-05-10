import axios from "axios"
//https://faceliveness-backend.onrender.com/
// https://faceliveness-api.onrender.com
export const api = axios.create({
  baseURL: "http://localhost:3000"
  // baseURL: "https://faceliveness-api.onrender.com"
})