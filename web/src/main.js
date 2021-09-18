import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { get, post } from "@/request/http";
import "@/style/resets.scss";
import "@/style/main.css";
import "element-ui/lib/theme-chalk/index.css";
import viewFile from "./view";
Vue.prototype.$viewFile = viewFile;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.config.productionTip = false;
Vue.use(ElementUI);
// router.beforeEach((to, from, next) => {
//   store.commit("pathEdit", to.path);
//   if (to.meta.requireAuth) {
//     // 判断该路由是否需要登录权限
//     if (store.state.isLogin || localStorage.token) {
//       // 通过vuex state获取当前的token是否存在
//       next();
//     } else {
//       next({
//         path: "/login",
//         query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       });
//     }
//   } else {
//     next();
//   }
// });
router.afterEach(() => {
  window.scrollTo(0, 0);
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
