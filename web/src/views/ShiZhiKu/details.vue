<template>
  <div class="szk-details" >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'ShiZhiKu' }">史志库</el-breadcrumb-item>
      <el-breadcrumb-item>项目详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card-top" v-if="detailsData && detailsData.id" v-loading="loading">
      <div class="img-wrap">
        <el-image style="width: 240px; height: 240px;" :src="detailsData.pictureUrl" fit="fill"></el-image>
        <span class="tags tags1" v-if="parseInt(detailsData.status) === 1">编著中</span>
        <span class="tags" v-else-if="parseInt(detailsData.status) === 2">已发布</span>
        <span class="tags" v-else></span>
      </div>
      <div>
        <h5 class="title">{{detailsData.name}}</h5>
        <div class="desc">
          <div>
            <span v-if="detailsData.description.length > 110">
              <span v-if="isOpen"> {{detailsData.description}} </span>
              <span v-else>
                <span> {{detailsData.description.slice(0, 110) + '...'}} </span>
              </span>
              <el-button type="text" @click="toggleOpenDesc">{{ isOpen ? "收起" : "全部"}}</el-button>
            </span>
            <span v-else> {{detailsData.description}} </span>
          </div>
        </div>
        <div class="gray mt15">关键词：<span>{{detailsData.keyWord}}</span></div>
        <div class="gray">创建日期：<span>{{handleDate(detailsData.createTime)}}</span></div>
      </div>
    </el-card>
    <el-row :gutter="30">
      <el-col :span="16" class="box-card-left">
        <el-card>
          <div slot="header" class="clearfix">
            <span>章节目录</span>
          </div>
          <div class="chapter-content"  v-loading="chapterLoading">
            <el-collapse v-model="activeNames"  @scroll="onScroll">
              <el-collapse-item :name="`c-${index}`" class="first-item section step-jump scroll-item" 
              v-if="chapterData && chapterData.length > 0" v-for="(item, index) in chapterData" :key="`c-${index}`">
                <div slot="title" style="width: 100%;">
                  <span class="name">{{item.dutyEditorUserName}}</span>
                  <el-divider content-position="left">
                    <span class="">{{item.orderNum === 0 ? `序` : `第${SectionToChinese(item.orderNum)}章`}}</span>
                    {{item.title}}
                  </el-divider>
                </div>
                <div class="desc">
                  <!-- 编著中 -->
                  <div v-if="parseInt(detailsData.status) === 1">
                    <div v-if="item.description.length > 100">
                      {{item.isOpen ? item.description : item.description.slice(0, 100) + '......'}}
                      <el-button type="text" @click="toggleDescAll('outline', index)">
                        {{ item.isOpen ? '收起' : '全部'}}
                      </el-button>
                    </div>
                    <div v-else>{{ item.description }}</div>
                  </div>
                  <!-- 已发布 -->
                  <div v-else-if="parseInt(detailsData.status) === 2">
                    {{item.description.length > 100 ? item.description.slice(0,100) + '.....' : item.description}}
                    <el-button v-if="item.pdfUrl" type="text" class="btn" @click="lookSeeAllToPDF(item.pdfUrl)">查看全部</el-button>
                    <el-button v-else disabled type="text" >查看全部</el-button>
                  </div>
                </div>

                <el-collapse class="section-collapse" v-if="item.szkSubdirListVo && item.szkSubdirListVo.length > 0" 
                  v-model="activeSectionNames">
                  <el-collapse-item :name="`c-${index}-s-${n}`" class="first-item"
                  v-for="(ele, n) in item.szkSubdirListVo" :key="`c-${index}-s-${n}`">
                    <div slot="title" style="width: 100%;">
                      <span class="name">{{ele.dutyEditorUserName}}</span>
                      <el-divider content-position="left">
                        <span class="">{{`第${ele.orderNum}节`}}</span>
                        {{ele.title}}
                      </el-divider>
                    </div>
                    <div class="desc">
                      <!-- 编著中 -->
                      <div v-if="parseInt(detailsData.status) === 1">
                        <div v-if="ele.introduction.length > 100">
                          {{ ele.isOpen ? ele.introduction : ele.introduction.slice(0, 100) + '......' }}
                          <el-button type="text" @click="toggleDescAll('sections', index, n)">
                            {{ ele.isOpen ? '收起' : '全部'}}
                          </el-button>
                        </div>
                        <div v-else>{{ ele.introduction }}</div>
                      </div>
                      <!-- 已发布 -->
                      <div v-else-if="parseInt(detailsData.status) === 2">
                        {{ ele.introduction.length > 100 ? ele.introduction.slice(0,100) + '.....' : ele.introduction }}
                        <el-button v-if="ele.pdfUrl" type="text" class="btn" @click="lookSeeAllToPDF(ele.pdfUrl)">查看全部</el-button>
                        <el-button v-else disabled type="text" >查看全部</el-button>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>

              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card-right1">
          <div slot="header" class="clearfix">
            <span>主编</span>
          </div>
          <el-avatar :size="50" icon="el-icon-s-custom"></el-avatar>
          <div class="right">
            <div>{{detailsData.adminUserName}}</div>
            <div class="l1">主编</div>
          </div>
        </el-card>
        <el-card class="back-btn-position-fx-style">
          <div slot="header" class="clearfix">
            <span>章节目录</span>
          </div>
          <div v-loading="chapterLoading">
            <el-steps direction="vertical"  :active="activeStep" finish-status="wait" space="50px">
              <el-step class="nav1 " @click.native="jump(index)" :title="item.title" v-for="(item, index) in chapterData" :key="index"></el-step>
            </el-steps>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      isOpen: false, // 是否展开
      activeSectionNames: ['3'],
      activeNames: ['c-0', 'c-1', 'c-2', 'c-3'],
      chapterLoading: false,
      loading: false,
      detailsData: {}, // 详情
      chapterData: [], // 章节信息 
      activeStep: 0
    }
  },
  watch: {
  },
  methods: {

    // 切换简介展开收缩
    toggleDescAll (flag, index, num) {
      if (flag === 'outline') {
        this.chapterData[index].isOpen = !this.chapterData[index].isOpen
      }
      if (flag === 'sections') {
        this.chapterData[index].szkSubdirListVo[num].isOpen = !this.chapterData[index].szkSubdirListVo[num].isOpen
      }
    },

    // 去pdf查看全文
    lookSeeAllToPDF (pdfUrl) {
      if (pdfUrl) {
        window.open(pdfUrl, '_blank')
      }
    },

    // 跳转锚点
    jump(index) {
      var items = document.querySelectorAll(".scroll-item");
      for (var i = 0; i < items.length; i++) {
        if (index === i) {
          items[i].scrollIntoView({
            block: "center",//默认跳转到顶部
            behavior: "smooth"//滚动的速度
          });
        }
      }
    },
    
    // 当元素滚动条被滚动时运行的脚本
    onScroll () {
      var jump = document.querySelectorAll('.step-jump')
      var distance =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop
      jump.forEach((item, index) => {
        if (distance >= item.offsetTop) {
          this.activeStep = index
        }
      })
    },

    // // 锚点点击
    // jump (index) {
    //   this.activeStep = index
    //   // 用 class=".step-jump" 添加锚点，此时的类名要放在tr上，放在td上不对，
    //   // 以后做的时候要注意这点，不是表格的时候，如何放置锚点
    //   let jump = document.querySelectorAll('.step-jump')
    //   // 通过 offsetTop 获取对象到窗体顶部的距离，然后赋值给 scrollTop，就能实现锚点的功能
    //   let total = jump[index].offsetTop
    //   // scrollTop滚动条距离页面的距离
    //   let distance =
    //     document.documentElement.scrollTop ||
    //     window.pageYOffset ||
    //     document.body.scrollTop
    //   // 平滑滚动，时长500ms，每10ms一跳，共50跳
    //   let step = total / 50
    //   if (total > distance) {
    //     smoothDown()
    //   } else {
    //     let newTotal = distance - total
    //     step = newTotal / 50
    //     smoothUp()
    //   }
    //   function smoothDown() { // 向下滚动
    //     if (distance < total) {
    //       distance += step
    //       document.body.scrollTop = distance
    //       document.documentElement.scrollTop = distance
    //       window.pageYOffset = distance
    //       setTimeout(smoothDown, 10)
    //     } else {
    //       document.body.scrollTop = total
    //       document.documentElement.scrollTop = total
    //       window.pageYOffset = total
    //     }
    //   }
    //   function smoothUp() { // 向上滚动
    //     if (distance > total) {
    //       distance -= step
    //       document.body.scrollTop = distance
    //       document.documentElement.scrollTop = distance
    //       window.pageYOffset = distance
    //       setTimeout(smoothUp, 10)
    //     } else {
    //       document.body.scrollTop = total
    //       document.documentElement.scrollTop = total
    //       window.pageYOffset = total
    //     }
    //   }
    // },

    // 切换展开收起
    toggleOpenDesc () {
      this.isOpen = !this.isOpen
    },

    // 调章节信息
    getChapterInfo () {
      let self = this
      let params = {
        projectId : this.$route.query.id
      }
      this.chapterLoading = true
      axios.get('http://szapi.lanbenzi.cn/szk_api/chapter/list',{params}).then(function(res){
        self.handleChapterData(res)
        self.chapterLoading = false
      }).catch(function (error) {
        self.$message.warning(error)
        self.chapterLoading = false
      });
    },

    // 给所有的章节信息加一个isOpen标记
    handleChapterData (res) {
      let arr = JSON.parse(JSON.stringify(res))
      let len = arr.length
      for (var i = 0; i < len; i++) {
        arr[i]['isOpen'] = false
        for (var j = 0; j < arr[i].szkSubdirListVo.length; j++) {
          arr[i].szkSubdirListVo[j]['isOpen'] = false
        }
      }
      this.chapterData = arr
    },

    // 一进入页面就调用
    getDetailsInfo () {
      let self = this
      let params = {
        id: this.$route.query.id
      }
      this.loading = true
      axios.get('http://szapi.lanbenzi.cn/szk_api/project',{params}).then(function(res){
        self.detailsData = res
        self.loading = false
      }).catch(function (error) {
        self.$message.warning(error)
        self.loading = false
      });
    },

    // 处理日期格式
    handleDate (time) {
      let arr = time.split('-')
      let str = ''
      str += arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
      return str
    },

    // 处理章节前面的序号与汉字的对应
    SectionToChinese(section){
      var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
      var chnUnitSection = ["","万","亿","万亿","亿亿"];
      var chnUnitChar = ["","十","百","千"];
      var strIns = '', chnStr = '';
      var unitPos = 0;
      var zero = true;
      while (section > 0) {
        var v = section % 10;
        if(v === 0){
          if(!zero){
            zero = true;
            chnStr = chnNumChar[v] + chnStr;
          }
        }else{
          zero = false;
          strIns = chnNumChar[v];
          strIns += chnUnitChar[unitPos];
          chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
      }
      return chnStr;
    },

    // 滚动时，监听右侧“章节目录”内容，距离顶部100px时，定位
    handleScroll (e) {
      if (document.documentElement.scrollTop <= 500) {
        let fxDom = document.getElementsByClassName('back-btn-position-fx-style')
        if (fxDom.length > 0) {
          fxDom[0].classList.add('back-btn-position-ab-style')
          fxDom[0].classList.remove('back-btn-position-fx-style')
        }
      } else {
        let adDom = document.getElementsByClassName('back-btn-position-ab-style')
        if (adDom.length > 0) {
          adDom[0].classList.add('back-btn-position-fx-style')
          adDom[0].classList.remove('back-btn-position-ab-style')
        }
      }
    }
  },
  mounted () {
    this.$nextTick(function() {
      window.addEventListener('scroll', this.onScroll)
      window.addEventListener('scroll', this.handleScroll)
    })
    this.getDetailsInfo()
    this.getChapterInfo()
    this.handleScroll()
  }
};
</script>
<style lang="scss">
.szk-details{
  width: 1170px;
  margin: 0 auto;
  padding-bottom: 50px;
  .el-card{
    border: 0;
  }
  .el-breadcrumb{
    padding: 30px 0;
    font-size:14px;
    color: #999;
    .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link{
      color: #999!important;
    }
  }
  .el-card__header{
    font-size: 14px;
    font-family: PingFangSC-Semibold,PingFang SC;
    font-weight: 600;
    color: rgba(51,51,51,1);
    line-height: 24px;
  }
  .box-card-top{
    margin-bottom: 30px;
    .el-card__body{
      padding: 24px;
      overflow: hidden;
    }
    .el-button{
      padding: 0;
      padding-left: 10px;
    }
    .img-wrap{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 240px;
      float: left;
      padding-right: 40px;
      height: 240px;
      overflow: hidden;
      border-radius: 2px;
      position: relative;
      img{
        width: 100%;
        box-shadow:0px 0px 12px 0px rgba(0,0,0,0.05);
        border-radius: 2px;
      }
    }
    .title{
      padding-bottom: 20px;
      font-size: 24px;
      font-family: PingFangSC-Semibold,PingFang SC;
      font-weight: 600;
      color: rgba(51,51,51,1);
      text-overflow:ellipsis;
      white-space: nowrap;
      max-width: 850px;
      overflow: hidden;
      letter-spacing: 2px;
    }
    .desc{
      font-size: 14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height: 24px;
    }
    .gray{
      height:24px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height: 24px;
      margin-bottom: 5px;
      span{
        padding-left: 10px;
      }
    }
    .mt15{
      margin-top: 15px;
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
  .box-card-right1{
    margin-bottom: 15px;
    .right{
      display: inline-block;
      vertical-align: top;
      margin-left: 20px;
      div{
        font-size: 16px;
        // font-family:PingFangSC-Semibold,PingFang SC;
        font-weight: 600;
        color:rgba(51,51,51,1);
        line-height: 24px;
        padding-top: 5px;
      }
      .l1{
        font-size: 14px;
        padding-top: 0;
        font-weight: normal;
      }
    }
  }
  .el-collapse{
    border: 0;
    .el-button{
      padding: 0;
    }
    .el-collapse-item__header{
      border: 0;
      .name{
        float: right;
        background: #fff;
        position: relative;
        z-index: 4;
        display: block;
        padding: 0 8px;
        font-weight: bold;
        font-size: 14px;
        right: -2px;
      }
    }
    .el-divider{
      background: transparent;
      border: 1px dashed #EDEDED;
    }
    .el-divider--horizontal{
      height: auto;
    }
    .el-divider__text.is-left{
      left: 0;
    } 
    .el-divider__text{
      padding: 0;
      font-size:14px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(51,51,51,1);
      line-height:23px;
      span{
        padding-right: 10px;
      }
    }
    .el-collapse-item__wrap{
      border: 0;
    }
    .el-collapse-item__content{
      padding-bottom: 0;
    }
    .section-collapse{
      .el-divider__text{
        font-weight: normal;
      }
      .name{
        font-weight: normal;
      }
    }
    .desc{
      padding-bottom: 10px;
      .btn{
        color: #5C9BE5;
        cursor: pointer;
      }
    }
  }
  .el-icon-s-custom{
    font-size: 30px;
    line-height: 50px;
  }
  .el-step__title{
    cursor: pointer;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:23px
  }
  .el-step__main{
    padding-left: 0 !important;
  }
  .el-step__icon{
    border-radius: 0;
    width: 4px;
    height: 24px;
    border-color: transparent;
    .el-step__icon-inner{
      display: none;
    }
  }
  .el-step.is-vertical .el-step__head{
    width: 14px;
    &.is-process .el-step__icon{
      border-color: #4A90E2 !important;
    }
  }
  .el-step__line{
    background: transparent;
  }
  .el-loading-mask{
    z-index: 5 !important;
  }
  .back-btn-position-ab-style { // 不能删
  }
  .back-btn-position-fx-style {
    position: fixed;
    top: 100px;
    width: 370px;
  }
}
</style>
