import axios from "axios";

const endpoint = "https://kura-backend.herokuapp.com";
// const endpoint = "http://localhost:8081";


const axiosInstance = axios.create({
    baseURL: endpoint
});

axiosInstance.interceptors.request.use(
    (config) => {
        const userToken = localStorage.getItem("access_token");
        if (userToken) {
            config.headers.common["access_token"] = (userToken);
        }
        return config;
    },
    (error) => {
        console.log(error);
    });

export { endpoint };
export default axiosInstance;