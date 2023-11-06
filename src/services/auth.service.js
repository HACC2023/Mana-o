import axios from "axios";

const API_URL = "http://localhost:8080/users/";

const register = (firstName, lastName, phone, email, password, company) => {
  return axios.post(API_URL + "signup", {
    firstName,
    lastName,
    phone,
    email,
    password,
    company
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;