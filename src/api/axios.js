import axios from "axios";
import { BASE_URL } from "../config/config";
export default axios.create(
  {
    baseURL: BASE_URL,
  },
  {
    withCredentials: true,
  }
);

export const CancelToken = axios.CancelToken;
