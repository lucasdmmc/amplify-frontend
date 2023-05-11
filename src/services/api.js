import axios from "axios"
//https://faceliveness-backend.onrender.com/
// https://faceliveness-api.onrender.com
// https://faceliveness-backend.up.railway.app/"
export const api = axios.create({
  //baseURL: "http://localhost:3000"
  baseURL: "https://quiet-forest-81679.herokuapp.com/"
})