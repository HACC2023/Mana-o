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

const getDetections = () => {
  return axios.get(API_URL + "detections", {headers: authHeader() });
}

function getDetectionById(id){
  return axios.get(API_URL + `detections/${id}`, {headers: authHeader()});
}
const getUnapprovedUsers = () => {
  return axios.get(API_URL + "unapprovedusers", {headers: authHeader()});
}
const updatedApprovedStatus = (approvedUserIds) => {
  return axios.put(API_URL + "approveusers", {approvedUserIds});
}
const getDetectionRemovals = () => {
  return axios.get(API_URL + "detection_removals", { headers: authHeader()});
}


const deleteUser = (userId) => {
  return axios.delete(API_URL + `users/${userId}`, { headers: authHeader() });
};

const updateUser = (userId, userData) => {
  return axios.put(API_URL + `users/${userId}`, userData, { headers: authHeader() });
};

const UserService = {
  getPublicContent,
  getUsersPageData,
  getAdminPageData,
  getDetections,
  getDetectionById,
  getUnapprovedUsers,
  updatedApprovedStatus,
  getDetectionRemovals,
  deleteUser,
  updateUser

};

export default UserService;