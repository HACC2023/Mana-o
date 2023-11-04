import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
    return axios.get(API_URL + "all");
};

const getContractorPageData = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getAdminPageData = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const UserService = {
  getPublicContent,
  getContractorPageData,
  getAdminPageData,
};

export default UserService;