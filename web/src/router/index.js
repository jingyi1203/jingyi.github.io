import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/userCenter",
    name: "UserCenter",
    component: () =>
      import(
        /* webpackChunkName: "UserCenter" */ "../views/userCenter/Index.vue"
      )
  },
  {
    path: "/shiZhiKu",
    name: "ShiZhiKu",
    component: () =>
      import(/* webpackChunkName: "ShiZhiKu" */ "../views/ShiZhiKu/Index.vue")
  },
  {
    path: "/shiZhiKu/details",
    name: "ShiZhiKuDetails",
    component: () =>
      import(/* webpackChunkName: "ShiZhiKu" */ "../views/ShiZhiKu/details.vue")
  },
  {
    path: "/uploads",
    name: "Uploads",
    component: () =>
      import(/* webpackChunkName: "Uploads" */ "../views/uploads")
  },
  {
    path: "/searchResult",
    name: "SearchResult",
    component: () =>
      import(
        /* webpackChunkName: "Uploads" */ "../views/searchResult/Index.vue"
      )
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
