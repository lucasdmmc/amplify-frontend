import axios from "axios"
//https://faceliveness-backend.onrender.com/
// https://faceliveness-api.onrender.com
export const api = axios.create({
  baseURL: "https://faceliveness-api.herokuapp.com/"
})