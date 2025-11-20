import axios from "axios";
import API_URL from "../env";

const api = axios.create({
  baseURL: API_URL.BACK_END_URL, 
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;