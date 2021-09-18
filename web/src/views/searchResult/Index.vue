<template>
  <div class="container">
    <header class="hear">
      <div class="main-wrap content">
        <div class="header-con">
          <h5>文史库</h5>
          <div class="input-con">
            <el-input
              v-model.trim="params.title"
              placeholder="请输入关键字、事件地点搜索"
              v-on:keyup.enter.native="goSearch"
            ></el-input>
            <div class="search-btn" @click="goSearch">
              <i class="el-icon-search"></i>
            </div>
          </div>
        </div>
        <ul class="type-con">
          <li
            v-for="(item, index) in types"
            :key="index"
            @click="typeClick(index)"
            :class="{ selected: params.category_id == index }"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </header>
    <div>
      <div class="result-count" v-if="allCount">
        <div class="order-con">
          <span>{{ allCount }}条搜索结果</span>
          <span @click="goOrder">{{
            params.desc === "DESC" ? "升序" : "降序"
          }}</span>
        </div>
      </div>
      <div class="contents">
        <template v-if="count">
          <div class="left" :class="{ 'bar-fixed': barFixed }">
            <div
              v-for="(item, index) in yearList"
              :class="{ 'year-active': item === params.year }"
              @click="yearClick(item, index)"
              :key="index"
            >
              <span>{{ item }}年</span>
              <div v-if="item === params.year" />
            </div>
          </div>
          <div class="center">
            <div class="con-list">
              <div class="time-year">
                <div class="inner-year">
                  <img
                    src="../../assets/images/search/image_foot_y@2x.png"
                    alt=""
                  /><span>{{ params.year }}</span>
                </div>
                <div class="dotted"></div>
              </div>
              <div
                v-for="(event, keys) in dataList"
                @click="$viewFile(event)"
                :key="keys"
                class="mon-con"
              >
                <div class="time-month">
                  <img
                    height="22px"
                    width="22px"
                    src="../../assets/images/search/image_foot_m@2x.png"
                    alt=""
                  />
                  <span class="hor-line"></span>
                  <span class="ver-line"></span>
                  <div
                    class="label"
                    :class="{
                      blue: event.category_id === 1,
                      green: event.category_id === 2,
                      qblue: event.category_id === 3,
                      popu: event.category_id === 4,
                      red: event.category_id === 5,
                      gray: event.category_id === 6
                    }"
                  >
                    {{ event.category_id | typeFilter }}
                  </div>
                  <div class="title">{{ event.title }}</div>
                </div>
                <div
                  class="dotted text-box"
                  :class="{ 'move-top': !event.title }"
                >
                  <div>
                    {{ event.desc }}
                  </div>
                  <div class="auth-info">
                    <span
                      >{{ event | formatTime }}，{{
                        event.user.user_name
                      }}
                      上传</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="load-more" v-if="isMore">
              <span v-if="loadmore">加载中...</span>
              <el-button type="primary" v-else @click="loadMore"
                >加载更多</el-button
              >
            </div> -->
          </div>
        </template>
        <empty v-else tilte="没有查到资料，请去" hint="上传文史资料" />
        <!-- v-show="dataList.length" -->
        <div
          class="about-label"
          :class="{ nodata: tagCount === 0 }"
          v-show="tagCount > 1"
        >
          相关标签推荐
          <div id="aboutLabel" style="width: 260px;height:300px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Empty from "@/components/Empty";
var Highcharts = require("highcharts");
var moment = require("moment");
// 在 Highcharts 加载之后加载功能模块
// require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/networkgraph.js")(Highcharts);
export default {
  components: { Empty },
  computed: {
    isMore() {
      return this.count > this.params.size * (this.params.page + 1);
    }
  },
  filters: {
    formatTime(event) {
      moment.locale("zh-cn");
      if (event.point_at_type === "year") {
        return moment(new Date(event.point_at).getTime()).format("YYYY年");
      } else if (event.point_at_type === "month") {
        return moment(new Date(event.point_at).getTime()).format("YYYY年MM月");
      } else {
        return moment(new Date(event.point_at).getTime()).format("ll");
      }
    },
    typeFilter(value) {
      let str = "";
      switch (value) {
        case 0:
          str = "全部";
          break;
        case 1:
          str = "速记";
          break;
        case 2:
          str = "会议纪要";
          break;
        case 3:
          str = "文章";
          break;
        case 4:
          str = "大事记";
          break;
        case 5:
          str = "批示";
          break;
        default:
          str = "其他";
          break;
      }
      return str;
    }
  },
  data() {
    return {
      params: {
        title: "",
        year: "",
        category_id: 0,
        page: 0,
        size: -1,
        order: "point_at",
        desc: "DESC"
      },
      allCount: "",
      count: 0,
      chart: "",
      activityYearIndex: 0,
      barFixed: false,
      yearList: [],
      aboutTag: [],
      loadmore: false,
      dataList: [],
      tagCount: 0,
      types: ["全部", "速记", "会议纪要", "文章", "大事记", "批示", "其他"],
      selectedType: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.params.title = this.$route.query.keyword;
    // this.initFile();
    this.getTags();
    this.getYears();
  },
  methods: {
    async goOrder() {
      this.params.desc === "DESC"
        ? (this.params.desc = "ASC")
        : (this.params.desc = "DESC");
      const { count, list } = await this.getFile();
      this.count = count;
      //转换数据
      const filterData = this.filterFile(list);
      this.dataList = filterData;
    },
    goSearch() {
      if (this.params.title === "") {
        return this.$router.replace("/");
      }
      this.getTags();
      this.getYears();
    },
    async getYears() {
      const data = await this.$get("/api/file/years", this.params);
      this.yearList = data;
      if (data && data.length > 0) {
        this.params.year = data[0];
        this.initFile();
      } else {
        this.dataList = [];
        this.count = 0;
        this.allCount = 0;
      }
    },
    async initFile() {
      this.dataList = [];
      this.params.page = 0;
      const { count, list } = await this.getFile();
      this.count = count;
      //转换数据
      const filterData = this.filterFile(list);
      this.dataList = filterData;
    },
    async getFile() {
      this.getFileCount();
      return await this.$get("/api/file", this.params);
    },
    async getFileCount() {
      const res = await this.$get("/api/file", {
        title: this.params.title,
        category_id: this.params.category_id,
        size: 10
      });
      this.allCount = res.count;
    },
    async getTags() {
      // if (this.params.title) {
      let { tags, count } = await this.$get("/api/tag", {
        title: this.params.title,
        page: 0,
        size: 8
      });
      this.tagCount = count;
      //处理数据
      if (tags.length > 8) {
        //去前5个
        tags = tags.slice(0, 8);
      }
      let arr = tags.map((item, index) => {
        return item.title || index + "";
      });
      arr.unshift(this.params.title);
      //去设置hcharts的数据
      let tmpArr = [];
      arr.forEach(element => {
        tmpArr.push([arr[0], element]);
      });
      this.aboutTag = tmpArr;
      this.$nextTick(() => {
        this.loadChart(tmpArr);
      });
    },
    filterFile(arr) {
      return arr.map(item => {
        const date = new Date(item.point_at);
        const year = date.getFullYear();
        const mon = date.getMonth() + 1;
        const day = date.getDate();
        return { ...item, year, mon, day };
      });
    },
    loadChart(data) {
      let that = this;
      let firstColor = "#ACACAC";
      this.chart = Highcharts.chart("aboutLabel", {
        chart: {
          type: "networkgraph",
          height: "100%"
        },
        title: {
          text: ""
        },
        subtitle: {
          text: ""
        },
        plotOptions: {
          networkgraph: {
            keys: ["from", "to"],
            layoutAlgorithm: {
              enableSimulation: true,
              linkLength: 30
            }
          }
        },
        series: [
          {
            events: {
              click(value) {
                that.params.title = value.point.id;
                that.getYears();
              }
            },
            marker: {
              radius: 4,
              fillColor: firstColor
            },

            dataLabels: {
              enabled: true,
              linkFormat: "",
              allowOverlap: true
            },

            data: data,
            nodes: [
              {
                id: data[0][0],
                marker: {
                  radius: 6
                }
              }
            ]
          }
        ]
      });
    },
    yearClick(item, index) {
      this.params.year = item;
      this.activityYearIndex = index;
      this.initFile();
    },
    async loadMore() {
      this.loadmore = true;
      this.params.page++;
      const { list } = await this.getFile();
      const da = this.filterFile(list);
      // 加数据
      this.dataList.push(...da);
      this.loadmore = false;
    },
    handleScroll() {
      let scrollY = document.documentElement.scrollTop;
      if (scrollY > 160) {
        this.barFixed = true;
      } else {
        this.barFixed = false;
      }
    },
    typeClick(index) {
      this.params.category_id = index;
      this.getYears();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 120px;
}
.hear {
  overflow: hidden;
  height: 161px;
  background-color: #ab936d;
  .content {
    position: relative;
    height: 100%;
  }
}
.header-con {
  padding-top: 45px;
  display: flex;
  align-items: center;
  h5 {
    font-size: 32px;
    color: rgba(255, 255, 255, 1);
    line-height: 38px;
  }
  .input-con {
    height: 48px;
    position: relative;
    width: 570px;
    margin-left: 24px;
    display: flex;
    & ::v-deep .el-input__inner {
      border-radius: 32px;
      height: 100%;
      outline: none;
      &:focus {
        border: none;
      }
    }
    .search-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      position: absolute;
      right: 4px;
      top: 2px;
      background: linear-gradient(90deg, #b39669, #c9b796);
      text-align: center;
      line-height: 44px;
      &:active {
        opacity: 0.8;
      }
    }
  }
}
.type-con {
  position: absolute;
  bottom: 0;
  left: 0;
  li {
    cursor: pointer;
    margin-right: 47px;
    font-size: 15px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.5);
    line-height: 21px;
    display: inline-block;
    padding-bottom: 12px;
    &.selected {
      position: relative;
      color: rgba(255, 255, 255, 1);
      &::after {
        content: "";
        height: 6px;
        width: 6px;
        background-color: white;
        position: absolute;
        left: 50%;
        bottom: -3px;
        margin-left: -3px;
        transform: rotate(45deg);
      }
    }
  }
}
.contents {
  min-height: 500px;
  width: 1170px;
  margin: auto;
  display: flex;
  position: relative;
  .left {
    position: absolute;
    // left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    width: 80px;
    z-index: 1000;
    & > div {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      margin: 5px 0;
      font-size: 14px;
      font-weight: normal;
      color: rgba(153, 153, 153, 1);
      line-height: 24px;
      width: 72px;
      cursor: pointer;
      div {
        width: 4px;
        height: 12px;
        background: rgba(171, 147, 109, 1);
        margin-left: 16px;
      }
    }
    .year-active {
      font-size: 16px;
      font-weight: normal;
      color: rgba(171, 147, 109, 1);
    }
    &.bar-fixed {
      position: fixed;
      top: 148px;
      // transform: translateX(-50%);
    }
  }
  .center {
    width: 672px;
    margin-left: 115px;
    .time-img {
      font-size: 0px;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
.order-con {
  display: flex;
  justify-content: space-between;
  width: 788px;
  cursor: pointer;
}
.inner-year {
  display: flex;
  align-items: center;
  img {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 14px;
    background: #ab936d;
  }
  span {
    font-size: 24px;
    font-family: FZCSJW--GB1-0, FZCSJW--GB1;
    font-weight: normal;
    color: rgba(171, 147, 109, 1);
    margin-left: 16px;
  }
}
.time-month {
  img {
    flex-shrink: 0;
  }
  display: flex;
  align-items: center;
  .hor-line {
    flex-shrink: 0;
    width: 18px;
    height: 1px;
    background-color: #999;
  }
  .ver-line {
    flex-shrink: 0;
    background-color: #999;
    width: 1px;
    height: 12px;
  }
  .label {
    flex-shrink: 0;
    margin: 0 8px;
    padding: 0 4px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.97);
    &.blue {
      background-color: #40c4ff;
    }
    &.green {
      background-color: #81c784;
    }
    &.qblue {
      background-color: #4dd0e1;
    }
    &.popu {
      background-color: #ce93d8;
    }
    &.red {
      background-color: #e57373;
    }
    &.gray {
      background-color: #b0bec5;
    }
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 27px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex-grow: 1;
  }
}
.dotted {
  min-height: 28px;
  border-left: 4px dotted #999;
  margin-left: 11px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 24px;
  padding-left: 40px;
  &.text-box {
    margin-top: 2px;
    padding-bottom: 32px;
  }
}
.result-count {
  width: 1170px;
  font-size: 14px;
  color: rgba(153, 153, 153, 1);
  line-height: 24px;
  margin: 32px auto;
}
.mon-con {
  cursor: pointer;
  &:last-child {
    .text-box {
      padding-bottom: 47px;
    }
  }
}
.mon-con {
  &:last-child {
    .text-box {
      padding-bottom: 0;
    }
  }
}
.auth-info {
  margin-top: 4px;
  font-size: 14px;
  color: rgba(153, 153, 153, 1);
  line-height: 24px;
}
.load-more {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: rgba(172, 172, 172, 1);
  line-height: 24px;
  height: 24px;
  & ::v-deep .el-button {
    background-color: #ab936d;
    border: none;
    &:hover {
      opacity: 0.8;
    }
  }
}

.about-label {
  text-align: center;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 15px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  line-height: 21px;
  &.nodata {
    margin-top: 32px;
  }
}
</style>
<style>
.highcharts-credits {
  display: none;
}
</style>
