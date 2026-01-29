import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:3000/api" : "https://ezyshopper-production.up.railway.app/api",
    withCredentials: true, //allows us to send cookies on every single request to server
});

export default axiosInstance