import axios from "axios"
//https://faceliveness-backend.onrender.com/
// https://faceliveness-api.onrender.com
// https://faceliveness-backend.up.railway.app/"
export const api = axios.create({
  baseURL: "https://faceliveness-api.onrender.com"
})