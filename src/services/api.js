import axios from "axios"

export const api = axios.create({
  baseURL: "https://faceliveness-backend.onrender.com/"
})