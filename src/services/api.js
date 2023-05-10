import axios from "axios"
//https://faceliveness-backend.onrender.com/
export const api = axios.create({
  baseURL: "http://localhost:3000"
  // baseURL: "https://faceliveness-backend.onrender.com/"
})