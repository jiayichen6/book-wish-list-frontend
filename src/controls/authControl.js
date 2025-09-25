import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { booksApiControl } from "../api/api";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      Alpine.store("booksApp").currentPage = "logIn";
    }

    throw error;
  }
);

const authControl = () => {
  return {
    email: "",
    password: "",

    init() {
      this.checkToken();
    },

    async checkToken() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        this.setHeader(token);
        const resp = await booksApiControl.getMe();

        this.toastify(resp.data.message);
        this.goBookLists();
      } catch (err) {
        const message = err?.response?.data?.error ?? "發生錯誤";
        this.toastify(message, "#972929ff");
      }
    },

    setHeader(token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    async register() {
      if (this.isAllowToRegister) {
        const api = `${API_URL}/users/register`;
        const newUser = { account: this.email, password: this.password };

        try {
          const resp = await axios.post(api, newUser);
          this.toastify(resp.data.message);

          this.clearInput();
          this.goLogin();
        } catch (err) {
          const message = err?.response?.data?.error ?? "發生錯誤";
          this.toastify(message, "#972929ff");
        }
      }
    },

    async logIn() {
      if (this.isAllowToLogIn) {
        const api = `${API_URL}/users/login`;
        const user = {
          account: this.email,
          password: this.password,
        };
        try {
          const resp = await axios.post(api, user);
          this.toastify(resp.data.message);
          const token = resp.data.token;
          localStorage.setItem("token", token);
          this.setHeader(token);

          this.clearInput();
          this.goBookLists();
        } catch (err) {
          const message = err?.response?.data?.error ?? "發生錯誤";
          this.toastify(message, "#972929ff");
        }
      }
    },

    logOut() {
      this.clearInput();
      this.$store.booksApp.currentPage = "logIn";

      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },

    goRegister() {
      this.clearInput();
      this.$store.booksApp.currentPage = "register";
    },

    goLogin() {
      this.clearInput();
      this.$store.booksApp.currentPage = "logIn";
    },

    goBookLists() {
      this.$store.booksApp.currentPage = "bookLists";
    },

    get isAllowToRegister() {
      return this.email.trim() != "" && this.password.trim() != "";
    },

    get isAllowToLogIn() {
      return this.email.trim() != "" && this.password.trim() != "";
    },

    clearInput() {
      this.email = "";
      this.password = "";
    },

    toastify(message, color = "#96c93d") {
      return Toastify({
        text: message,
        position: "center",
        duration: 3000,
        close: true,
        gravity: "top",
        style: {
          background: color,
        },
      }).showToast();
    },
  };
};

export { authControl };
