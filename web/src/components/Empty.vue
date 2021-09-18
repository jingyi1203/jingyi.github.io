<template>
  <div class="no-result">
    <img
      src="../assets/images/search/image_kong@2x.png"
      width="140px"
      height="122px"
      alt=""
    />
    <span
      >{{ tilte
      }}<span class="upload-span" @click="$router.push('/uploads')">{{
        hint
      }}</span></span
    >
  </div>
</template>
<script>
export default {
  props: {
    tilte: {
      type: String,
      default: ""
    },
    hint: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.no-result {
  width: 787px;
  height: 442px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #d0d0d0;
  span {
    margin-top: 24px;
    font-size: 14px;
  }
}
.upload-span {
  cursor: pointer;
  color: #4a90e2;
}
</style>
