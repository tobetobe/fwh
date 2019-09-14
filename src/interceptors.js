import axios from "axios";
// axios拦截器
// 拦截请求，给所有的请求都带上token
axios.interceptors.request.use(request => {
  const userToken = window.localStorage.getItem("userToken");
  if (userToken) {
    // 此处有坑，下方记录
    request.headers["Authorization"] = userToken;
  }
  return request;
});

// 拦截响应，遇到token不合法则报错
axios.interceptors.response.use(
  response => {
    if (response.data.token) {
      console.log("token:", response.data.token);
      window.localStorage.setItem("userToken", response.data.token);
    }
    return response;
  },
  error => {
    const errRes = error.response;
    console.log(errRes);
    /*if (errRes.status === 401) {
      window.localStorage.removeItem("userToken");
      console.log(
        "Auth Error!",
        `${errRes.data.error.message}, please login!`,
        "error"
      )
    }*/
    return Promise.reject(error.message); // 返回接口返回的错误信息
  }
);

/*
 * config 開發環境和生產環境IP配置
 */
export const ip = `144.34.219.189:3000`;
