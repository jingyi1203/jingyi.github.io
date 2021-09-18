<template>
  <div id="app">
    <nav-top class="top" />
    <div class="top-2"></div>
    <router-view class="main" />
    <bottom />
  </div>
</template>
<script>
import navTop from "@/components/layouts/nav";
import bottom from "@/components/layouts/bottom";
export default {
  components: {
    navTop,
    bottom
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  // height: 100vh;
}
.top-2 {
  height: 60px;
}
.top {
}
.main {
  // flex: 1;
  // overflow: auto;
}
</style>
