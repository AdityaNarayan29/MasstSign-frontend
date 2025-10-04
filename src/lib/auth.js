import Cookies from "js-cookie";

// Save JWT token
export const setToken = (token) => Cookies.set("token", token);

// Get JWT token
export const getToken = () => Cookies.get("token");

// Remove JWT token (logout)
export const removeToken = () => Cookies.remove("token");
