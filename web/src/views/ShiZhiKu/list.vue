<template>
  <div class="szk-list-one">
    <el-row :gutter="50" class="row-item" v-for="(element, num) in rowData" :key="num">
      <el-col :span="6" class="item" v-if="Math.floor(index / 4) === num" 
        v-for="(item, index) in listData" :key="index">
        <div @click="handleGoDetails(item.id)">
          <div class="img-wrap">
            <el-image style="width: 100%; height: 240px;" :src="item.pictureUrl" fit="fill"></el-image>
            <span class="tags tags1" v-if="parseInt(item.status) === 1">编著中</span>
            <span class="tags" v-else-if="parseInt(item.status) === 2">已发布</span>
            <span class="tags" v-else></span>
          </div>
          <div class="title dotdotdot">{{ellipsis(item.name)}}</div>
          <div class="desc dotdotdot">{{ellipsis(item.description)}}</div>
        </div>
      </el-col>
      <div class="shadow"></div>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rowData: [], // 几行
      listData: this.data // 数据
    }
  },
  props: {
    ptype: {
      type: String,
      default: function () {
        return ''
      }
    },
    data: {
      type: Array,
      default: function () {
        return ''
      }
    }
  },
  watch: {
    data (newVal) {
      this.listData = newVal
      this.handleRowData()
    }
  },
  methods: {

    // 跳转页面
    handleGoDetails (id) {
      this.$router.push({name: 'ShiZhiKuDetails',query: {
        id: id
      }})
    },

    // 显示省略号
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 33) {
        return value.slice(0,33) + '...'
      }
      return value
    },

    // 处理行数据
    handleRowData () {
      let arr = JSON.parse(JSON.stringify(this.listData))
      let temp = []
      let len = Math.ceil(arr.length / 4) // 看有几行
      for (var i = 0; i < len; i++) {
        temp.push(i)
      }
      this.rowData = JSON.parse(JSON.stringify(temp))
    }
  },
  mounted () {
    this.handleRowData()
  }
};
</script>
<style lang="scss" scoped>
.szk-list-one{
  padding: 0 15px;
  .row-item{
    margin-bottom: 25px;
    position: relative;
  }
  .item{
    margin-top: 15px;
    word-wrap: break-word;
    cursor: pointer;
  }
  .shadow{
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 105px;
    height: 8px;
    border-radius: 5px;
    box-shadow: 0 10px 20px rgba(60,60,60,.25), 0 -30px 60px rgba(250, 250, 250, 1);
  }
  .img-wrap{
    height: 240px;
    max-height: 240px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 15px;
    overflow: hidden;
    position: relative;
    img{
      width: 100%;
    }
  }
  .title{
    text-align: left;
    font-size: 16px;
    font-family: PingFangSC-Semibold,PingFang SC;
    font-weight: 600;
    color:rgba(51,51,51,1);
    line-height: 27px;
  }
  .desc{
    text-align: left;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:24px;
  }
  .dotdotdot{
    line-height: 25px;
    height: 50px;
    overflow: hidden;
  }
  .tags{
    color: #fff;
    font-size: 12px;
    line-height: 20px;
    padding: 1px 8px;
    background: linear-gradient(180deg,rgba(201,183,150,1) 0%,rgba(171,147,109,1) 11%,rgba(179,150,105,1) 100%);
    border-radius: 0px 100px 100px 0px;
    position: absolute;
    left: 0; 
    bottom: 16px;
    &.tags1{
      background: linear-gradient(90deg,rgba(70,86,127,1) 0%,rgba(18,25,46,1) 41%,rgba(47,59,92,1) 100%);
    }
  }
}   
</style>
