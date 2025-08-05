import axios from "axios";
import { API } from "../data/constants";

const apiClient = axios.create({
  baseURL: API,
  withCredentials: true, // This is crucial for sending the HttpOnly cookie
});

export default apiClient;
