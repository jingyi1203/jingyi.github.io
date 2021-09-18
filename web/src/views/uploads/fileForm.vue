<template>
  <div class="wraper">
    <div class="model" v-if="file.status === 'uploading'"></div>
    <div class="file-form">
      <!-- <el-progress :percentage="100" :format="format"></el-progress> -->
      <p>请选择要编辑的文件</p>
      <div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-position="left"
          label-width="80px"
          size="mini"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="摘要" prop="desc">
            <el-input
              type="textarea"
              v-model="form.desc"
              placeholder="简述上传内容发生时间、地点、主要人物及事件描述、关键信息等，如：2019年11月19日，张首席欧洲行期间，接受爱尔兰时报记者弗兰克·狄龙采访，首次对外阐述了新全球化的理念，即生态共创的全球化。"
            ></el-input>
          </el-form-item>
          <el-form-item label="资料类型" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择资料类型">
              <el-option label="速记" :value="1"></el-option>
              <el-option label="会议纪要" :value="2"></el-option>
              <el-option label="文章" :value="3"></el-option>
              <el-option label="大事记" :value="4"></el-option>
              <el-option label="批示" :value="5"></el-option>
              <el-option label="其他" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="事件地点" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="史料时间">
            <el-radio-group
              @change="form.point_at_time = ''"
              v-model="form.point_at_type"
            >
              <el-radio label="year">年</el-radio>
              <el-radio label="month">年/月</el-radio>
              <el-radio label="date">年/月/日</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-show="form.point_at_type === 'date'"
            prop="point_at_time"
            label=""
          >
            <el-col :span="11">
              <el-date-picker
                v-model="form.point_at_time"
                type="date"
                placeholder="选择时间"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item
            v-show="form.point_at_type === 'month'"
            prop="point_at_time"
            label=""
          >
            <el-col :span="11">
              <el-date-picker
                v-model="form.point_at_time"
                type="month"
                placeholder="选择时间"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item
            v-show="form.point_at_type === 'year'"
            prop="point_at_time"
            label=""
          >
            <el-col :span="11">
              <el-date-picker
                v-model="form.point_at_time"
                type="year"
                placeholder="选择时间"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="标签">
            <div v-if="!isAddTag" class="add-tags" @click="addTags('')">
              + 自定义标签
            </div>
            <div v-else>
              <el-autocomplete
                v-model="temTags"
                value-key="title"
                class="filter-input"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
              ></el-autocomplete>
              <el-button type="primary" @click.prevent="addTags(temTags)"
                >添加</el-button
              >
            </div>
          </el-form-item>
          <el-form-item label="">
            <div class="tags-show" :class="{ 'ver-tag': vertag }">
              <div
                class="pre-tag"
                v-for="(tag, index) in adminTags"
                :class="{
                  'tag-selected':
                    form.tags && form.tags.some(tagId => tag.id === tagId)
                }"
                @click="clickTag(tag)"
                :key="index"
              >
                {{ tag.title }}
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    file: {
      type: Object,
      default: null
    },
    num: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      form: {
        point_at_type: "date",
        category_id: null,
        title: "",
        address: "",
        point_at_time: "",
        desc: "",
        tags: []
      },
      list: [],
      temTags: "",
      isAddTag: false,
      adminTags: [],
      vertag: false,
      rules: {
        title: [{ required: true, message: "请输入文件名称", trigger: "blur" }],
        category_id: [
          { required: true, message: "请选择资料类型", trigger: "change" }
        ],
        point_at_time: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        desc: [
          { required: true, message: "请输入文件概要", trigger: "change" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "change" }]
      }
    };
  },
  computed: {
    oldForm() {
      return this.file;
    }
  },
  watch: {
    oldForm: {
      handler(newV, oldV) {
        // do something, 可使用this
        this.form = {
          ...this.form,
          ...(newV.response && newV.response.data)
        };
        const lastIndex =
          (newV.response &&
            newV.response.data &&
            newV.response.data.obj_name.lastIndexOf("/")) ||
          0;
        const lastIndex2 =
          (newV.response &&
            newV.response.data &&
            newV.response.data.obj_name.lastIndexOf(".")) ||
          0;
        this.form.title =
          newV.response && newV.response.data && newV.response.data.obj_name;
        this.form.title =
          (this.form.title &&
            this.form.title.slice(lastIndex + 1, lastIndex2)) ||
          "";
        this.form.category_id = null;
      },
      deep: true
    }
  },
  created() {
    this.getAdminTags();
  },
  methods: {
    addTags(tag) {
      if (tag) {
        this.$post("/api/tag", { title: tag }).then(res => {
          var isAdded = this.adminTags.some(item => item.id === res.id);
          if (isAdded) {
            this.$message.warning("已添加过该标签！请选择～");
          } else {
            this.adminTags.unshift(res);
            if (!this.form.tags) {
              this.form.tags = [];
            }
            this.form.tags.push(res.id);
            this.isAddTag = false;
            this.temTags = "";
          }
        });
      } else {
        this.isAddTag = true;
      }
    },
    getAdminTags() {
      this.$get("/api/tag/admin", {}).then(res => {
        this.adminTags = res;
      });
    },
    clickTag(tag) {
      this.isAddTag = false;
      this.temTags = "";
      if (!this.form.tags) {
        this.form.tags = [];
      }
      const Index = this.form.tags.findIndex(tagId => tagId === tag.id);
      if (Index > -1) {
        this.form.tags.splice(Index, 1);
      } else {
        this.form.tags.push(tag.id);
        this.vertag = false;
      }
    },
    querySearchAsync(queryString, cb) {
      const params = {
        title: queryString
      };
      this.$get("/api/tag", params).then(res => {
        cb(res.tags);
      });
    },
    handleSelect(item) {
      var isAdded = this.adminTags.some(tags => tags.id === item.id);
      if (isAdded) {
        this.$message.warning("已添加过该标签！请选择～");
      } else {
        this.adminTags.unshift(item);
        if (!this.form.tags) {
          this.form.tags = [];
        }
        this.form.tags.push(item.id);
      }
      this.isAddTag = false;
      this.temTags = "";
    },
    submit() {
      this.$refs.form.validate(valid => {
        if ((this.form.tags && this.form.tags.length < 1) || !this.form.tags) {
          this.vertag = true;
        } else {
          this.vertag = false;
        }
        if (valid && !this.vertag) {
          this.form.point_at = new Date(this.form.point_at_time).getTime();
          this.$post(`/api/file/${this.form.id}`, this.form).then(res => {
            // console.log(res);
            this.$parent.successNum(this.file.uid);
          });
        } else {
          this.$parent.verList(this.file.uid);
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.filter-input {
  width: 80%;
  margin-right: 20px;
}
.wraper {
  position: relative;
}
.model {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #eee;
  opacity: 0.5;
  cursor: wait;
  z-index: 10;
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
  border: 1px solid #fff;
  &.ver-tag {
    border: 1px solid #f56c6c;
  }
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
    transition: all 0.3s ease-in;
  }
  .tag-selected {
    border: 1px solid rgba(24, 144, 255, 1);
    color: #1890ff;
    transition: all 0.3s ease-in;
  }
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

::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
}
::-webkit-scrollbar-track {
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  border-radius: 0;
  background: rgba(172, 172, 172, 1);
  border-radius: 4px;
  opacity: 0.5;
  transition: all 0.2s;
  border-radius: 0.25rem;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(95, 95, 95, 0.7);
}
</style>
