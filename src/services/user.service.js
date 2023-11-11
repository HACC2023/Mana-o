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

const getUnapprovedUsers = () => {
  return axios.get(API_URL + "unapprovedusers", {headers: authHeader()});
}
const updateApprovedStatus = (approvedUserIds) => {
  return axios.put(API_URL + "approveusers", {approvedUserIds});
}

const UserService = {
  getPublicContent,
  getUsersPageData,
  getAdminPageData,
  getUnapprovedUsers,
  updateApprovedStatus
};

export default UserService;