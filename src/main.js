import { createApp } from 'vue'
import App from './App.vue'
import router from './components/router'
import axios from 'axios'
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
// import axios from './services/services'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import * as constants from '../constants'



axios.defaults.baseURL = constants.API_URL;




axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
      config.headers.authorization = `Bearer ${token}`;  // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/auth/login" && err.response) {
      // Access Token was expired
      if (err.response.status === 403 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await axios.post("/auth/token", {
            refreshToken: localStorage.getItem("refreshToken"),
          });
          const { accessToken } = rs.data;
          localStorage.setItem("accessToken", accessToken);
          return axios(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
      if (err.response.status === 401 && !originalConfig._retry) {
        router.replace("/login").then(() => { });
        localStorage.clear();
      }
    }
    return Promise.reject(err);
  }
);






const app = createApp(App)
const options = {
    // You can set your default options here
  };
app.use(Toast, options);
app.use(router)
app.use(VueLoading)
app.mount('#app')
