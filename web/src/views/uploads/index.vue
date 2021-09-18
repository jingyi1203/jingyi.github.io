<template>
  <div class="upload-wraper">
    <div
      class="demo-box"
      :class="{ 'no-file': !haveFile, 'have-file': haveFile }"
    >
      <el-upload
        class="upload-demo"
        drag
        action="/api/file/upload"
        multiple
        :headers="{
          Authorization: `Bearer ${token}`
        }"
        :show-file-list="false"
        :limit="10"
        :on-change="onChange"
        :on-exceed="onExceed"
        :on-progress="onProgress"
        :on-success="onSuccess"
        :file-list="fileList"
      >
        <div class="att">
          <div class="upload-icon">
            <img src="../../assets/image_upload_blue@2x.png" alt="" />
          </div>
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
          <div class="el-upload__text upload-att">
            只限文件和图片，文件和图片格式不限
          </div>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!-- 只能上传jpg/png文件，且不超过500kb -->
        </div>
      </el-upload>
      <div class="file-detail" v-if="haveFile">
        <div class="file-list">
          <p>上传文件列表</p>
          <ul>
            <li
              v-for="(file, index) in fileList"
              @click="chooseFile(file, index)"
              :key="file.uid"
              :class="{
                'file-active': index === fileChooseNum,
                'fail-ver': failVerList.some(
                  failListId => file.uid === failListId
                )
              }"
            >
              <div class="file-name">
                <p>{{ file.name }}</p>
                <el-progress
                  :percentage="file.percentage | formatNumber"
                  v-if="file.status === 'uploading'"
                >
                </el-progress>
                <el-progress
                  :percentage="file.percentage"
                  v-else
                  :status="file.status === 'success' ? 'success' : 'exception'"
                >
                </el-progress>
              </div>
              <div class="file-list-del">
                <span @click="delFileList(index)">删除</span>
              </div>
            </li>
          </ul>
        </div>
        <file-form
          v-for="(fileForm, index) in fileList"
          :key="index"
          :num="index"
          @ver-list="verList"
          :file="fileList[index]"
          v-show="index === fileChooseNum"
          :ref="`fileForm${index}`"
        />
      </div>
    </div>
    <div v-if="haveFile" class="pub-part">
      <el-button
        type="primary"
        :disabled="btnDisable"
        @click.prevent="confirmPub"
        >确认发布</el-button
      >
    </div>
  </div>
</template>
<script>
import fileForm from "./fileForm";
export default {
  components: {
    fileForm
  },
  filters: {
    formatNumber(number) {
      return Math.ceil(number);
    }
  },
  data() {
    return {
      haveFile: false,
      fileChooseNum: 0,
      form: {
        dateType: "date",
        fileType: "",
        title: "",
        address: "",
        date: "",
        desc: ""
      },
      temTags: "",
      fileList: [],
      failVerList: [],
      isAddTag: false,
      btnDisable: true,
      token: ""
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    if (!this.token) {
      this.$message.warning("请先登录");
      this.$router.push("/");
    }
  },
  methods: {
    addTags(tag) {
      if (tag) {
        this.tagList.push({
          name: tag,
          id: this.tagList[this.tagList.length - 1].id + 1
        });
        this.isAddTag = false;
        this.temTags = "";
      } else {
        this.isAddTag = true;
      }
    },
    chooseFile(file, num) {
      this.fileChooseNum = num;
    },
    confirmPub() {
      this.failVerList = [];
      this.fileList.forEach((item, index) => {
        this.$refs[`fileForm${index}`][0].submit();
      });
      if (this.failVerList.length > 0) {
        this.$message.warning("文件信息填写不完整");
      }
    },
    onChange(file, fileList) {
      this.fileList = fileList;
      this.btnDisable = true;
      const isUploading = fileList.some(list => list.percentage < 100);
      console.log(isUploading);
      if (isUploading) {
        this.btnDisable = true;
      } else {
        this.btnDisable = false;
      }
      if (fileList.length > 0) {
        this.haveFile = true;
      }
      // console.log(fileList);
    },
    delFileList(index) {
      this.fileList.splice(index, 1);
      if (this.fileList.length < 1) {
        this.haveFile = false;
      }
    },
    onSuccess(response, file, fileList) {
      this.fileList = fileList;
    },
    onProgress(event, file, fileList) {
      // console.log(event, file, fileList);
      this.fileList = fileList;
    },
    onExceed() {
      this.$message({
        message: "最多上传10个文件，上传文件个数超出限制",
        type: "warning"
      });
    },
    successNum(uid) {
      this.$message.success("文件上传成功");
      const uidIndex = this.fileList.findIndex(file => uid === file.uid);
      this.fileList.splice(uidIndex, 1);
      if (this.fileList.length < 1) {
        this.haveFile = false;
      }
    },
    verList(uid) {
      this.failVerList.push(uid);
    },
    onSubmit() {}
  }
};
</script>
<style lang="scss" scoped>
.pub-part {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 11;
  height: 96px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tem-tags {
  width: 358px;
  margin-right: 20px;
  & ::v-deep .el-input__inner {
    width: 358px;
  }
}
.tags-show {
  width: 436px;
  height: 144px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  div {
    margin-right: 8px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    padding: 0 15px;
    color: #999;
    border: 1px solid #eee;
    border-radius: 2px;
    cursor: pointer;
    margin-bottom: 8px;
  }
}
.demo-box {
  // border: 1px solid darkblue;
  width: 1170px;
  margin: auto;
  position: relative;
}
.add-tags {
  width: 436px;
  height: 30px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.upload-demo {
  & ::v-deep .el-upload-list {
    position: absolute;
    width: 522px;
    left: 24px;
    top: 280px;
    height: 616px;
    overflow: auto;
    padding: 0 5px;
    // padding-right: 16px;
    box-sizing: border-box;
    & > li {
      height: 60px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      border: 1px solid rgba(224, 224, 224, 1);
      .el-upload-list__item-status-label {
        top: 18px;
      }
      .el-icon-close {
        top: 22px;
      }
      .el-icon-close-tip {
        top: 20px;
      }
      .el-progress {
        width: 90%;
        margin-top: 20px;
      }
      .el-upload-list__item-name {
        cursor: pointer;
        width: 450px;
        text-align: left;
        height: 50px;
        line-height: 50px;
      }
    }
  }
}
.file-detail {
  width: 1170px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  text-align: left;
}
.file-list {
  height: 697px;
  width: 570px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 24px;
  box-sizing: border-box;
  p {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 24px;
    text-align: left;
  }
  ul {
    margin-top: 16px;
    height: 594px;
    overflow-y: auto;
    li {
      // height: 60px;
      &:hover {
        background: #f0faff;
        border: 1px solid rgba(255, 255, 255, 1);
      }
      &.file-active {
        background: #f0faff;
        border: 1px solid rgba(255, 255, 255, 1);
      }
      &.fail-ver {
        border: 1px solid #f56c6c;
      }
      border-radius: 4px;
      border: 1px solid rgba(233, 233, 233, 1);
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      cursor: pointer;
      margin-bottom: 8px;
      .file-name {
        width: 70%;
      }
      .file-list-del {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(24, 144, 255, 1);
          line-height: 22px;
          &:hover {
            color: #f5222d;
          }
        }
      }
      & ::v-deep .el-progress {
        margin-top: 4px;
      }
      & ::v-deep .el-progress-bar__outer {
        height: 4px !important;
      }
      & ::v-deep .el-progress__text {
        font-size: 12px !important;
      }
    }
  }
}
.file-form {
  width: 570px;
  // height: 629px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 24px;
  box-sizing: border-box;
  p {
    text-align: left;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
    margin-bottom: 24px;
  }
  & ::v-deep .el-textarea {
    height: 100px;
    .el-textarea__inner {
      height: 100%;
    }
  }
  & ::v-deep .el-select {
    width: 100%;
  }
  & ::v-deep .el-col {
    width: 100%;
    .el-date-editor {
      width: 100%;
    }
  }
}
.upload-icon {
  margin-bottom: 16px;
  img {
    width: 56px;
    height: 56px;
  }
}
.el-upload__text {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 24px;
  margin-bottom: 4px;
}
.upload-att {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 22px;
}
.upload-demo {
  margin: auto;
  width: 1170px;
  & ::v-deep .el-upload-dragger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1170px;
    height: 684px;
    transition: height 0.5s linear;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
}
.have-file {
  margin-bottom: 40px;
  text-align: center;
  .upload-demo {
    margin: auto;
    margin-bottom: 30px;
    & ::v-deep .el-upload-dragger {
      height: 195px;
      transition: height 0.5s linear;
    }
  }
}
.upload-wraper {
  padding-top: 40px;
  background: linear-gradient(
    360deg,
    rgba(241, 241, 241, 0.3) 0%,
    rgba(237, 237, 237, 0.3) 100%
  );
}
.no-file {
  text-align: center;
  margin-bottom: 120px;
}
::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
  background-image: linear-gradient(
    135deg,
    #1de9b6 0%,
    rgba(8, 196, 219, 0.5) 72%,
    rgba(0, 182, 234, 0.3) 100%
  );
}
::-webkit-scrollbar-track {
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  border-radius: 0;
  background-image: linear-gradient(
    135deg,
    #1de9b6 0%,
    #08c4db 72%,
    #057494 100%
  );
  transition: all 0.2s;
  border-radius: 0.25rem;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(95, 95, 95, 0.7);
}
</style>
