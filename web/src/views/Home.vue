<template>
  <div class="home-wraper">
    <div class="home-banner">
      <div class="search">
        <h5>文史资料搜索</h5>
        <el-input
          :placeholder="`共有${countAll || 0}条文史档案`"
          v-model.trim="input3"
          class="input-with-select"
          v-on:keyup.enter.native="goSearch"
        >
          <el-button
            slot="append"
            class="search-btn"
            icon="el-icon-right"
            @click="goSearch"
          ></el-button>
        </el-input>
        <div class="hot-word" v-if="hotwords.length">
          <p>
            <span>热门搜索：</span>
            <span
              v-for="(item, index) in hotwords"
              :key="index"
              :class="{ hot: index !== hotwords.length - 1 }"
              @click="hotClick(item.title)"
            >
              {{ `${item.title}` }}
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="home-main">
      <h5>大事记</h5>
      <h6>CHRONICLE OF EVENTS</h6>
      <div class="contents">
        <div class="left" :class="{ 'bar-fixed': barFixed }">
          <div
            v-for="(item, index) in yearList"
            :class="{ 'year-active': index === activeYearIndex }"
            @click="scrollYear(index)"
            :key="index"
          >
            <span>{{ item }}年</span>

            <div v-if="index === activeYearIndex" />
          </div>
        </div>
        <div class="center">
          <template v-if="dataList.length">
            <div class="time-img">
              <img src="../assets/ic_reloadtime@2x.png" alt="" />
            </div>
            <div
              v-for="(yearsEvents, index) in dataList"
              :key="index"
              ref="fileItem"
              :id="yearsEvents.year"
            >
              <div class="time-year">
                <div class="dotted" style="margin-top:2px"></div>
                <div class="inner-year">
                  <span></span><span>{{ yearsEvents.year }}年</span>
                </div>
                <div class="dotted"></div>
              </div>
              <div
                v-for="(event, keys) in yearsEvents.data"
                @click="$viewFile(event)"
                :key="keys"
                style="cursor:pointer"
              >
                <div class="time-month" v-if="event.mon">
                  <div>
                    <img src="../assets/image_timepoint@2x.png" alt="" />
                  </div>
                  <div>
                    {{ event.mon }}月{{ event.day ? `${event.day}日` : "" }}
                  </div>
                </div>
                <div
                  class="dotted text-box"
                  :class="{ 'move-top': !event.date }"
                >
                  {{ event.desc }}
                </div>
              </div>
            </div>
          </template>
          <empty v-else tilte="没有大事件记，请去" hint="上传文史资料" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Empty from "@/components/Empty";
export default {
  name: "Home",
  components: { Empty },
  data() {
    return {
      input3: "",
      hotwords: ["张首席", "生态品牌", "物联网", "链群合约"],
      yearList: [],
      activeYearIndex: 0,
      dataList: [],
      barFixed: false,
      scrollHeight: "",
      countAll: 0,
      justClickYear: false
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.getTags();
    this.getFile({ category_id: 4, page: 0, size: -1 });
    this.getAllCount();
  },
  methods: {
    tmpData() {
      // //处理数据
      this.$nextTick(() => {
        let domHeight = [];
        this.$refs.fileItem.forEach(dom => {
          domHeight.push(dom.offsetHeight);
        });
        //处理数据算出滚动的距离
        let scrollHeight = [];
        let sum = 0;
        domHeight.forEach(item => {
          sum += item;
          scrollHeight.push(sum);
        });
        this.scrollHeight = scrollHeight;
      });
    },
    goSearch() {
      if (!this.input3) {
        return;
      }
      this.$router.push({
        path: "/SearchResult",
        query: {
          keyword: this.input3
        }
      });
    },
    async getTags() {
      const { tags } = await this.$get("/api/tag", { hot: 1 });
      this.hotwords = tags;
    },
    async getFile(params) {
      const { list } = await this.$get("/api/file", params);
      if (list.length === 0) {
        return;
      }
      this.filterFile(list);
    },
    getAllCount() {
      this.$get("/api/file").then(res => {
        this.countAll = res.count;
      });
    },
    hotClick(hotClick) {
      //跳到搜索结果页面
      this.$router.push({
        path: "/SearchResult",
        query: {
          keyword: hotClick
        }
      });
    },
    scrollYear(index) {
      this.activeYearIndex = index;
      console.log(index, this.scrollHeight[index - 1]);
      if (index === 0) {
        document.documentElement.scrollTop = 760;
      } else {
        document.documentElement.scrollTop = this.scrollHeight[index - 1] + 760;
      }
      this.justClickYear = true;
      const timer = setTimeout(() => {
        this.justClickYear = false;
        clearTimeout(timer);
      }, 300);
    },
    handleScroll() {
      let scrollY = document.documentElement.scrollTop;
      if (scrollY > 652) {
        this.barFixed = true;
      } else {
        this.barFixed = false;
      }
      if (!this.scrollHeight) {
        return;
      }
      //滑动判断
      const heightIndex = this.scrollHeight.findIndex(
        height => scrollY < height + 100
      );
      if (this.justClickYear) {
        // console.log("gg");
      } else {
        if (heightIndex < 0) {
          this.activeYearIndex = this.yearList.length - 1;
        } else {
          this.activeYearIndex = heightIndex;
        }
      }
    },
    filterFile(arr) {
      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        let date = new Date(arr[i].point_at);
        let year = 0;
        let mon = 0;
        let day = 0;
        if (ai.point_at_type === "year") {
          year = date.getFullYear();
        } else if (ai.point_at_type === "month") {
          year = date.getFullYear();
          mon = date.getMonth() + 1;
        } else {
          year = date.getFullYear();
          mon = date.getMonth() + 1;
          day = date.getDate();
        }
        ai = { ...ai, year, mon, day };
        if (!map[year]) {
          dest.push({
            year,
            data: [ai]
          });
          map[year] = 1;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.year == ai.year) {
              dj.data.push({ ...ai, year, mon, day });
              break;
            }
          }
        }
      }
      this.yearList = Object.keys(map).sort(function(a, b) {
        return a < b ? 1 : -1;
      });
      //从大到小排序;
      this.dataList = dest;
      this.tmpData();
    }
  }
};
</script>
<style lang="scss" scoped>
// .move-top {
//   margin-top: -24px;
// }
.time-month {
  display: flex;
  align-items: center;
  margin-left: 5px;
  div {
    &:nth-child(1) {
      font-size: 0;
      margin-right: 6px;
      img {
        width: 35px;
        height: 15px;
      }
    }
    &:nth-child(2) {
      font-size: 16px;
      font-family: FZCSJW--GB1-0, FZCSJW--GB1;
      font-weight: normal;
      color: rgba(51, 51, 51, 1);
      line-height: 27px;
      cursor: pointer;
    }
  }
}
.dotted {
  min-height: 32px;
  border-left: 2px dotted #999;
  margin-left: 10px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 24px;
  padding-left: 32px;
}
.text-box {
  padding-top: 4px;
  padding-bottom: 32px;
}
.inner-year {
  display: flex;
  align-items: center;
  span {
    &:nth-child(1) {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 14px;
      background: #ab936d;
      margin-left: 5px;
    }
    &:nth-child(2) {
      font-size: 24px;
      font-family: FZCSJW--GB1-0, FZCSJW--GB1;
      font-weight: normal;
      color: rgba(171, 147, 109, 1);
      margin-left: 16px;
    }
  }
}
.contents {
  width: 1170px;
  margin: auto;
  margin-top: 32px;
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
    }
    .year-active {
      font-size: 16px;
      font-weight: normal;
      color: rgba(171, 147, 109, 1);
      transition: all 0.3s ease-in;
      div {
        width: 4px;
        height: 12px;
        background: rgba(171, 147, 109, 1);
        margin-left: 16px;
        transition: all 0.3s ease-in;
      }
    }
    &.bar-fixed {
      position: fixed;
      top: 100px;
      // left: calc(50% + 585px);
      // transform: translateX(-50%);
    }
  }
  .center {
    width: 770px;
    margin: auto;
    .time-img {
      font-size: 0px;
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
.search {
  text-align: center;
  margin-top: 206px;
  h5 {
    font-size: 32px;
    font-family: FZCSJW--GB1-0, FZCSJW--GB1;
    font-weight: normal;
    color: rgba(255, 255, 255, 1);
    line-height: 38px;
    text-shadow: 0px 2px 24px rgba(0, 0, 0, 0.2);
    text-align: center;
    margin-bottom: 32px;
  }
  .hot-word {
    margin-top: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 24px;
    p {
      span {
        &:nth-child(n + 2) {
          cursor: pointer;
          &.hot {
            margin-right: 14px;
            display: inline-block;
          }
        }
      }
    }
  }
  & .input-with-select {
    position: relative;
    width: 570px;
    height: 52px;
    & ::v-deep .el-input-group__append,
    .el-input-group__prepend {
      border: none;
      padding: 0;
      width: 0;
    }
    & ::v-deep .el-input-group__append {
      position: absolute;
      top: 12px;
      right: 26px;
    }
  }
  & .input-with-select {
    & ::v-deep .el-input__inner {
      height: 48px;
      border-radius: 48px;
      border: none;
    }
  }
  .search-btn {
    width: 44px;
    height: 44px;
    padding: 0;
    border-radius: 44px;
    background: linear-gradient(to right, #b39669, #c9b796);
    & ::v-deep .el-icon-right:before {
      font-size: 24px;
      color: #fff;
    }
    ::v-deep &.el-button {
      &:active {
        opacity: 0.8;
      }
    }
  }
}
.home-banner {
  height: 560px;
  background-image: url("../assets/image_home_banner@2x.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  overflow: hidden;
}
.home-main {
  // height: 1000px;
  padding-bottom: 100px;
  margin-top: 60px;
  h5 {
    font-size: 24px;
    font-family: FZCSJW--GB1-0, FZCSJW--GB1;
    font-weight: normal;
    color: rgba(51, 51, 51, 1);
    line-height: 29px;
    text-align: center;
    margin-top: 56px;
  }
  h6 {
    font-size: 14px;
    font-family: FZCSJW--GB1-0, FZCSJW--GB1;
    font-weight: normal;
    color: rgba(153, 153, 153, 1);
    line-height: 17px;
    text-align: center;
    margin-top: 8px;
  }
}
</style>
