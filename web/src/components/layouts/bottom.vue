<template>
  <div class="bottom-wraper">
    <div>
      <p>
        文史库
      </p>
      <p>Copyright © 海尔文化产业</p>
      <p>ALL Rights Reserved 鲁ICP备14023362号-4</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.bottom-wraper {
  background: #1f1f1f;
  text-align: center;
  height: 176px;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    &:nth-child(1) {
      font-size: 20px;
      font-family: FZCSJW--GB1-0, FZCSJW--GB1;
      font-weight: normal;
      color: rgba(255, 255, 255, 1);
      line-height: 20px;
      margin-bottom: 24px;
    }
    &:nth-child(n + 2) {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 18px;
    }
  }
}
</style>
