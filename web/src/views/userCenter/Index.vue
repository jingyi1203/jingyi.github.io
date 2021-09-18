<template>
  <div class="user-con">
    <div class="main-wrap">
      <div class="container">
        <div class="left">
          <el-avatar :size="120" :src="circleUrl" class="avatar">
            <img
              :src="userInfo.avatar || require('../../assets/defaultPhoto.png')"
            />
          </el-avatar>
          <span class="username">{{ userInfo.user_name }}</span>
          <span class="pro">{{ userInfo.position }}</span>
          <div class="info-item">
            <img
              width="16px"
              height="16px"
              :src="require('../../assets/images/userCenter/ic_mail.png')"
            />
            <span class="item-value">{{ userInfo.email || "--" }}</span>
          </div>
          <div class="info-item">
            <img
              width="16px"
              height="16px"
              src="../../assets/images/userCenter/ic_phone.png"
            />
            <span class="item-value">{{ userInfo.mobile || "--" }}</span>
          </div>
          <div class="info-item">
            <img
              width="16px"
              height="16px"
              src="../../assets/images/userCenter/ic_account.png"
            />
            <span class="item-value">{{ userInfo.dept_name || "--" }}</span>
          </div>
        </div>
        <div class="right">
          <div class="tab-con">
            <span class="tab-title">我上传的</span>
            <ul>
              <li
                v-for="(item, index) in tabs"
                :key="index"
                class="tab"
                :class="{ selected: params.category_id === item.index }"
                @click="tabClick(item.index)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div class="info-list-con">
            <div class="info-list-title">
              <span class="list-title">资料列表</span>
              <div class="arrow" @click="arrowClick">
                <span>{{ isCollapse ? "筛选" : "筛选收起" }}</span>
                <i
                  :class="
                    isCollapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
                  "
                ></i>
              </div>
            </div>
            <div class="search-option" v-show="!isCollapse > 0">
              <div class="hot-search">
                <span class="label-title" v-if="adminTags.length">
                  热门搜索:
                </span>
                <ul class="labels">
                  <li
                    class="label"
                    v-for="(tag, index) in adminTags"
                    :key="index"
                    :class="{ selected: params.tag_id === tag.id }"
                    @click="labelClick(tag.id)"
                  >
                    {{ tag.title }}
                  </li>
                </ul>
              </div>
              <div class="upload-date">
                <span class="label-title">上传时间:</span>
                <el-date-picker
                  value-format="YYYY-MM-dd HH:mm:ss"
                  v-model="dateRange"
                  type="daterange"
                  range-separator="-"
                  @change="dateRangeChange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="result-list">
            <template v-if="fileLists.length > 0">
              <div
                class="result-item-year"
                v-for="(item, index) in fileLists"
                :key="index"
              >
                <div class="date-item">{{ item.date }}上传</div>
                <div
                  v-for="(item2, index2) in item.list"
                  @click="$viewFile(item2)"
                  :key="index2"
                  class="wraper-result-item"
                >
                  <div class="result-item">
                    <div class="item-left">
                      <div
                        class="squ-title"
                        :class="typeClass(item2.category_id)"
                      >
                        <div>
                          {{ item2.category_id | typeFilter }}
                        </div>
                      </div>
                      <div class="title-con">
                        <span>{{ item2.title }}</span>
                        <span>{{ item2.tags | tagFilter }}</span>
                      </div>
                      <div class="type-con">
                        <span>{{ item2.aliyun_url | fileType }}</span>
                        <span
                          >更新时间: {{ item2.updated_at | filterDate }}</span
                        >
                      </div>
                    </div>
                    <div class="option" @click.stop="">
                      <span class="edit" @click="downloadFile(item2.aliyun_url)"
                        >下载</span
                      >
                      <span class="edit" @click="edit(item2)">编辑</span>
                      <span @click="del(item2.id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <el-pagination
                v-if="count > params.size"
                :page-size="params.size"
                background
                layout="prev, pager, next,jumper"
                :total="count"
                @current-change="pageChange"
              >
              </el-pagination>
            </template>
            <div v-else class="empty">
              <img
                height="94px"
                width="170px"
                src="../../assets/images/userCenter/image_Illustration_empty@2x.png"
                alt=""
              />
              <span
                >没有您上传的资料，点击<span
                  class="upload-span"
                  @click="$router.push('/uploads')"
                  >上传文史资料</span
                ></span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <edit-file v-if="isEdit" :file="editfileData" ref="editFile" />
    <div class="del-dialog">
      <el-dialog
        :visible.sync="delDia"
        width="354px"
        top="40vh"
        :modal="false"
        :lock-scroll="true"
        :close-on-click-modal="false"
      >
        <div class="del-dia">
          <i class="el-icon-warning-outline"></i>
          <span class="title">要删除该文件吗？</span>
          <div class="btn-con">
            <span @click="delDia = false">取消</span>
            <span @click="ensureDel">确认删除</span>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import editFile from "./editFile";
var moment = require("moment");
export default {
  components: {
    editFile
  },
  data() {
    return {
      count: 0,
      circleUrl: "",
      delDia: false,
      isEdit: false,
      userInfo: "",
      tabs: [
        {
          name: "全部",
          index: 0
        },
        {
          name: "速记",
          index: 1
        },
        {
          name: "会议纪要",
          index: 2
        },
        {
          name: "文章",
          index: 3
        },
        {
          name: "大事记",
          index: 4
        },
        {
          name: "批示",
          index: 5
        },
        {
          name: "其他",
          index: 6
        }
      ],
      isCollapse: false, //是否收起
      tabSelectIndex: 0,
      labelSelectedIndex: 0,
      adminTags: [],
      fileLists: [],
      dateRange: "",
      editfileData: {},
      params: {
        category_id: 0,
        tag_id: "",
        page: 0,
        size: 20
      }
    };
  },
  filters: {
    typeFilter(value) {
      let str = "";
      switch (value) {
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
    },
    fileType(value) {
      const arr = value.split(".");
      return arr.pop().toUpperCase();
    },
    tagFilter(value) {
      return value
        .map(item => {
          return "#" + item.title;
        })
        .join("、");
    },
    filterDate(value) {
      moment.locale("zh-cn");
      return moment(new Date(value).getTime()).format("LL");
    }
  },
  created() {
    this.initData();
    this.getAdminTags();
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
  },
  methods: {
    async ensureDel() {
      try {
        await this.$post(`/api/file/del/${this.fileId}`);
        this.$message.success("删除成功");
        this.delDia = false;
      } catch (error) {
        this.delDia = false;
      }

      this.initData();
    },
    downloadFile(url) {
      window.open(url);
    },
    dateRangeChange(value) {
      if (value && value.length > 0) {
        this.params.start = value[0];
        this.params.end = value[1].split(" ")[0] + " 23:59:59";
      } else {
        this.params.start = "";
        this.params.end = "";
      }
      this.initData();
    },
    async pageChange(page) {
      this.params.page = page - 1;
      const { list } = await this.getList();
      this.filterData(list);
    },
    async initData() {
      this.params.page = 0;
      const { count, list } = await this.getList();
      this.count = count;
      this.filterData(list);
    },
    async editSuccess() {
      const { count, list } = await this.getList();
      this.count = count;
      this.filterData(list);
    },
    arrowClick() {
      this.isCollapse = !this.isCollapse;
      this.params.hot = "";
      this.dateRange = "";
    },
    getAdminTags() {
      this.$get("/api/tag/admin", {}).then(res => {
        this.adminTags = [...res];
      });
    },
    async getList() {
      return await this.$get("/api/auth/files", this.params);
    },
    filterData(arr) {
      const map = {};
      let dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        const date = new Date(arr[i].created_at);
        const year = date.getFullYear();
        const mon = date.getMonth() + 1;
        const day = date.getDate();
        ai = { ...ai, year, mon, day };
        if (!map[`${year}-${mon}-${day}`]) {
          dest.push({
            date: `${year}-${mon}-${day}`,
            list: [ai]
          });
          map[`${year}-${mon}-${day}`] = 1;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.date === `${ai.year}-${ai.mon}-${ai.day}`) {
              dj.list.push({ ...ai, year, mon, day });
              break;
            }
          }
        }
      }
      this.fileLists = dest;
    },
    typeClass(typeClass) {
      let cls = "";
      switch (typeClass) {
        case 4:
          cls = "shiji";
          break;
        case 1:
          cls = "suji";
          break;
        case 2:
          cls = "jiyao";
          break;
        case 3:
          cls = "text";
          break;
        case 5:
          cls = "pishi";
          break;
        case 6:
          cls = "other";
          break;
        default:
          cls = "other";
          break;
      }
      return cls;
    },
    tabClick(index) {
      this.params.category_id = index;
      this.initData();
    },
    labelClick(id) {
      if (this.params.tag_id === id) {
        this.params.tag_id = "";
      } else {
        this.params.tag_id = id;
      }
      this.initData();
    },
    download() {},
    edit(file) {
      this.isEdit = true;
      this.editfileData = {};
      this.$nextTick(() => {
        this.editfileData = file;
        this.$refs.editFile.dialogVisible = true;
      });
    },
    async del(id) {
      //删除的modal
      this.fileId = id;
      this.delDia = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.del-dialog {
  padding: 40px 0 120px;
  background: linear-gradient(
    360deg,
    rgba(241, 241, 241, 0.3) 0%,
    rgba(237, 237, 237, 0.3) 100%
  );
  & ::v-deep {
    .el-dialog__header {
      padding: 0;
      height: 0;
    }
    .el-dialog__body {
      padding: 16px;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 8px;
    }
    .el-dialog {
      background: rgba(0, 0, 0, 0.8);
    }
  }
}
.container {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.left {
  display: inline-block;
  width: 270px;
  flex-direction: column;
  align-items: center;
  display: flex;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  .avatar {
    margin: 24px 0;
  }
  .username {
    font-size: 18px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
  }
  .pro {
    margin-top: 5px;
    margin-bottom: 16px;
    font-size: 13px;
    color: rgba(153, 153, 153, 1);
    line-height: 21px;
  }
  .info-item {
    img {
      vertical-align: middle;
    }
    .item-value {
      vertical-align: middle;
      display: inline-block;
      margin-left: 12px;
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      line-height: 21px;
    }
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 31px;
    }
  }
}
.right {
  display: inline-block;
  width: 870px;
  .tab-con {
    padding-top: 24px;
    padding-left: 24px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    .tab-title {
      font-size: 24px;
      font-weight: 500;
      color: rgba(27, 43, 58, 1);
      line-height: 40px;
      display: inline-block;
      margin-bottom: 24px;
    }
    .tab {
      transition: all 0.2s linear;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      color: rgba(27, 43, 58, 1);
      line-height: 22px;
      display: inline-block;
      margin-right: 40px;
      padding-bottom: 12px;
      border-bottom: 4px solid transparent;
      &.selected {
        border-bottom: 4px solid #c9b796;
      }
    }
  }
  .info-list-con {
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    margin-top: 16px;
    .info-list-title {
      background: rgba(255, 255, 255, 1);
      display: flex;
      padding: 16px 16px 16px 24px;
      align-items: center;
      justify-content: space-between;
      .list-title {
        font-size: 15px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 21px;
      }
      .arrow {
        cursor: pointer;
        font-size: 14px;
        color: rgba(102, 102, 102, 1);
        line-height: 22px;
        height: 22px;
        span {
          display: inline-block;
          margin-right: 8px;
        }
      }
    }
  }
  .search-option {
    background: rgba(251, 251, 251, 1);
    padding: 24px 16px 24px 24px;
    .label-title {
      width: 70px;
      height: 32px;
      font-size: 14px;
      color: rgba(102, 102, 102, 1);
      line-height: 32px;
      display: inline-block;
      margin-right: 6px;
      flex-shrink: 0;
    }
    .hot-search {
      display: flex;
      align-items: flex-start;
      .labels {
        flex-grow: 1;
        display: flex;
        flex-wrap: wrap;
        .label {
          cursor: pointer;
          margin-bottom: 12px;
          margin-right: 8px;
          display: inline-block;
          padding: 0px 16px;
          border-radius: 4px;
          box-sizing: border-box;
          height: 32px;
          border: 1px solid #d9d9d9;
          font-size: 14px;
          color: #5e5e5e;
          line-height: 32px;
          &.selected {
            border: 1px solid #1890ff;
            color: rgba(74, 144, 226, 1);
          }
        }
      }
    }
    .upload-date {
      display: flex;
      align-items: center;
      height: 32px;
      & ::v-deep .el-range-editor.el-input__inner {
        height: 32px;
      }
      & ::v-deep .el-date-editor .el-range__icon {
        height: 32px;
      }
      & ::v-deep .el-date-editor .el-range-separator {
        height: 32px;
      }
      & ::v-deep .el-date-editor .el-range__close-icon {
        height: 32px;
      }
    }
  }
}
.result-list {
  background-color: #fff;
  padding: 0 0px 24px 0px;
  & ::v-deep .el-pagination {
    margin-top: 40px;
    text-align: right;
  }
  & ::v-deep .el-pagination.is-background .el-pager li {
    min-height: 32px;
    min-width: 32px;
    line-height: 32px;
    border-radius: 4px;
    background-color: #fff;
    &.active {
      border: 1px solid #1890ff;
      background-color: #1890ff;
    }
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .result-item-year {
    padding-top: 16px;
    .date-item {
      font-size: 14px;
      color: rgba(153, 153, 153, 1);
      line-height: 24px;
      padding-left: 16px;
    }
  }
  .wraper-result-item {
    padding: 0 24px 0 16px;
    cursor: pointer;
    &:hover {
      background: #f0faff;
      .option {
        display: block;
      }
    }
  }
  .result-item {
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #e9e9e9;

    .item-left {
      display: flex;
      align-items: center;
    }
    .squ-title {
      height: 48px;
      width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      div {
        width: 28px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.97);
        line-height: 17px;
      }
      &.shiji {
        background-image: url("../../assets/images/userCenter/image_dashiji.png");
      }
      &.suji {
        background-image: url("../../assets/images/userCenter/image_word.png");
      }
      &.jiyao {
        background-image: url("../../assets/images/userCenter/image_jpeg.png");
      }
      &.text {
        background-image: url("../../assets/images/userCenter/image_txt.png");
      }
      &.pishi {
        background-image: url("../../assets/images/userCenter/image_pishi.png");
      }
      &.other {
        background-image: url("../../assets/images/userCenter/image_others.png");
      }
    }
    .title-con {
      display: flex;
      flex-direction: column;
      width: 297px;
      margin-left: 24px;
      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:first-child {
          font-size: 14px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 22px;
        }
        &:last-child {
          display: inline-block;
          margin-top: 4px;
          font-size: 14px;
          color: rgba(153, 153, 153, 1);
          line-height: 22px;
        }
      }
    }
    .type-con {
      display: flex;
      flex-direction: column;
      margin-left: 64px;
      font-size: 14px;
      color: rgba(153, 153, 153, 1);
      line-height: 22px;
      span {
        &:first-child {
          font-weight: 600;
          display: inline-block;
          margin-bottom: 4px;
        }
      }
    }
    .option {
      cursor: pointer;
      font-size: 14px;
      color: rgba(24, 144, 255, 1);
      line-height: 14px;
      display: none;
      .edit {
        display: inline-block;
        padding: 0 8px;
        margin: 0 8px;
        border-left: 1px solid rgba(216, 216, 216, 1);
        border-right: 1px solid rgba(216, 216, 216, 1);
      }
    }
  }
}
.empty {
  height: 489px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  span {
    cursor: pointer;
    display: inline-block;
    margin-top: 32px;
    font-size: 14px;
    color: rgba(153, 153, 153, 1);
    line-height: 21px;
    .upload-span {
      cursor: pointer;
      color: #4a90e2;
    }
  }
}
.del-dia {
  display: flex;
  flex-direction: column;
  align-items: center;
  i {
    font-size: 48px;
    color: #fff;
  }
  .title {
    display: inline-block;
    margin-top: 8px;
    margin-bottom: 35px;
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 30px;
  }
  .btn-con {
    text-align: center;
    span {
      cursor: pointer;
      line-height: 32px;
      width: 74px;
      text-align: center;
      height: 32px;
      border-radius: 2px;
      border: 1px solid rgba(255, 255, 255, 1);
      display: inline-block;
      font-size: 14px;
      background-color: transparent;
      color: rgba(255, 255, 255, 1);
      box-sizing: border-box;
      &:last-child {
        margin-left: 16px;
        background-color: #2979ff;
        border: 1px solid #2979ff;
      }
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
