import axios from "axios";
import Vue from "vue";
import { Message } from "element-ui";
import router from "../router";
import store from "../store";
// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem("token");
    config.params = {
      // _t: Date.parse(new Date()) / 1000,
      ...config.params
    };
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
axios.interceptors.response.use(
  response => {
    const data = response.data;
    if (new Set([10001, 11000]).has(data.code)) {
      // Vue.ls.clear();
      store.commit("isLogin", false);
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      router.push("/");
      Message.error({
        message: "请登陆"
      });
      return Promise.reject(new Error("请登陆"));
    }
    if (data instanceof Blob) {
      return response;
    }
    if (data.code !== 0) {
      Message.error({
        message: data.message
      });
      return Promise.reject(data.message);
    }
    return data.data;
  }
  // error => {
  //   // notification.error({
  //   //   message: err.response.status,
  //   //   description: err.message
  //   // })
  // }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
  // console.log('请求进来:');
  return axios.get(url, {
    params: { ...params },
    cancelToken: new axios.CancelToken(c => {
      Vue.prototype.cancleRequest = c;
    })
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return axios.post(url, {
    ...data
  });
}
