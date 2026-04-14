import axios from "axios";

export const apiRefresh = axios.create({
    baseURL: "/api/v1",
    withCredentials: true
});