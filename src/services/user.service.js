import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/";

const getPublicContent = () => {
    return axios.get(API_URL + "all");
};

const getUsersPageData = () => {
  return axios.get(API_URL + "users", { headers: authHeader() });
};

const getAdminPageData = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const UserService = {
  getPublicContent,
  getUsersPageData,
  getAdminPageData,
};

export default UserService;