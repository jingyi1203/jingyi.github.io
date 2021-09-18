<template>
  <div class="szk-list-page">
    <div class="banner">
      <div class="number-content">
        <ul>
          <li>
            <div v-if="userCount && userCount.length > 0" class="number-css" v-for="(v, k) in userCount" :key="k">
              <div class="comma" v-if="k === 2">,</div>
              <div class="item" >
                <div class="under">{{ v }}</div>
                <div :class="`on ${v === 0 ? '' : 'animate animate' + v}`">
                    <div class="bottom">
                      <div class="num">{{ v }}</div>
                    </div>
                </div>
              </div>
            </div>
            <div>(人)编创</div>
          </li>
          <li>
            <div v-if="projectCount && projectCount.length > 0" class="number-css" v-for="(v, k) in projectCount" :key="k">
              <div class="comma" v-if="k === 2">,</div>
              <div class="item" >
                <div class="under">{{ v }}</div>
                <div :class="`on ${v === 0 ? '' : 'animate animate' + v}`">
                    <div class="bottom">
                      <div class="num">{{ v }}</div>
                    </div>
                </div>
              </div>
            </div>
            <div>(个)项目</div>
          </li>
          <li>
            <div v-if="chapterCount && chapterCount.length > 0" class="number-css" v-for="(v, k) in chapterCount" :key="k">
              <div class="comma" v-if="k === 2">,</div>
              <div class="item" >
                <div class="under">{{ v }}</div>
                <div :class="`on ${v === 0 ? '' : 'animate animate' + v}`">
                    <div class="bottom">
                      <div class="num">{{ v }}</div>
                    </div>
                </div>
              </div>
            </div>
            <div>(个)章节</div>
          </li>
        </ul>
      </div>
      <div class="btn-wrap">
        <el-button round  icon="el-icon-plus" @click="handleGoLogin">发起项目编辑</el-button>
      </div>
    </div>
    <!-- list-content -->
    <div class="list-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all" v-loading="loading">
          <SZKlist v-if="listData" ptype="all" :data="listData"></SZKlist>
          <el-pagination @size-change="changeAllSize" @current-change="changeCurPageAll" :current-page.sync="allCurPage"
            :page-sizes="[20, 40, 60, 100]" :page-size="allSize"  layout="sizes, prev, pager, next" :total="allTotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="已发布" name="publish">
          <SZKlist v-if="listPublishedData" ptype="publish" :data="listPublishedData"></SZKlist>
          <el-pagination @size-change="changePubSize" @current-change="changeCurPagePublish" :current-page.sync="publishCurPage"
            :page-sizes="[20, 40, 60, 100]" :page-size="publishSize"  layout="sizes, prev, pager, next" :total="publishTotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="编著中" name="editing">
          <SZKlist v-if="listEditingData" ptype="editing" :data="listEditingData"></SZKlist>
          <el-pagination @size-change="changeEditSize" @current-change="changeCurPageEdit" :current-page.sync="editCurPage"
            :page-sizes="[20, 40, 60, 100]" :page-size="editSize"  layout="sizes, prev, pager, next" :total="editTotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹出框 -->
    <div class="msg-tips" v-if="isHadRenz2">
      <div ><i class="el-icon-check"></i></div>
      <div class="div1">您的认证信息已提交审核</div>
      <div class="div2">审批结果将以邮件的形式通知到您，请注意查收邮件。（如未能及时收到审批，请联系管理员： 李姣 15811253698）</div>
    </div>
    <!-- 弹出认证对话框 -->
    <el-dialog title="CNKI大成编客实名认证协议" :visible.sync="dialogRZVisible">
      <div class="rz-content">
        <div>感谢您使用CNKI大成编客平台。 </div>
        <div>本协议就您接受《中国学术期刊（光盘版）》电子杂志社有限公司（以下简称CNKI）认证审核，成为“CNKI大成编客”的认证主编，通过CNKI大成编客进行知网书的编创及相关服务所订立的有效合约，勾选“我已阅读并接受以上协议”或以任何方式参与知网书的编创均视为同意且遵守本协议。本协议具有法律效力。 </div>
        <div>一、 总则 1、本协议内容包括协议正文及所有CNKI大成编客已经发布的或将来可能发布的各类规则及经双方协商同意的补充协议。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。 2、CNKI与您承诺接受并遵守本协议的约定。CNKI有权根据中华人民共和国有关法律、法规的调整、网络技术的发展以及公司经营策略的变化等情况对协议内容进行修改，修订后的协议将公布于CNKI大成编客网站，您继续使用CNKI大成编客，则视为对修订后的协议不持任何异议并同意遵守。 </div>
        <div>二、相关概念 1、CNKI大成编客：是中国知网旗下的“编创出版+知识服务”平台。平台为每一位“主编”提供全流程、自助式、智能化的编创服务，可快速实现对中国知网上期刊论文、编客原创文章的检索与筛选、分类与管理、汇编与创作、编辑与排版、合成与阅读的“知网书”编创服务。网址为：http://bianke.cnki.net。 2、主编：是指具有相关行业领域的能力专长，经本人申请，并通过CNKI大成编客平台的实名认证，进行知网书编创的人员统称。 3、用户：是指在CNKI大成编客平台浏览、搜索、阅读、下载知网书等各类知识资源的互联网用户。 4、知网书：是指主编按照CNKI大成编客编创规范，利用中国知网上各类文献、编客原创文章编创而成的数字内容作品。 5、主编认证：是指登录CNKI大成编客平台，按要求填写相关信息并提供相关资质材料，申请并激活CNKI大成编客主编账户、开通主编权限的过程。 </div>
        <div> 三、您的权利与义务 1、您享有在CNKI大成编客平台，进行知网书编创的权利。 2、您享有CNKI大成编客为您开展工作提供的各项便利条件和相关服务。 3、您需保证您所编创作品的内容符合中国法律、法规及国家政策的规定，不含任何违法、违规内容。 4、您需要按照CNKI大成编客规定的质量及数量标准完成相关工作，若您能未达到有关要求，CNKI大成编客有权随时终止本协议，并取消您的认证主编权益。 5、您有义务保护CNKI大成编客平台提供的各项服务，严禁以任何形式擅自转让或授权他人使用自己的服务账户，一经发现，CNKI大成编客有权立即封禁该服务账户，并有权终止向您提供本协议约定的服务而无须承担违约责任。 </div> 
        <div>四、CNKI的权利与四、CNKI的权利与义务 1、CNKI有权对您编创的作品进行审核、修改和管理，对不符合CNKI大成编客编创规范、国家相关法律法规要求的作品，CNKI大成编客有权进行处理（包括但不限于删除）或终止委托协议。 2、CNKI负责对主编编创及相关服务提供技术支持与维护服务，保障您使用CNKI大成编客的编创服务快速、高效地开展汇编工作。</div>
        <div>五、知识产权 您一经申请认证成为CNKI大成编客的主编，即视为同意将您在本平台编创的作品著作权中的复制权、发行权、信息网络传播权、翻译权、汇编权转让给CNKI。 《中国学术期刊（光盘版）》电子杂志社有限公司以向编者（作者）提供其编创作品的一年阅读下载服务和销售收益分成（分成细则详见编创空间《大成编客作品收益结算管理办法》）作为其作品的著作权转让费。</div>
        <div> 六、免责声明 1、CNKI大成编客平台将在现有技术的基础上尽最大努力提供相应的安全措施以保障服务安全和正常运行。但CNKI大成编客平台明确声明对服务不作任何明示或暗示的保证，包括但不限于对服务的安全性、可靠性、持续性、准确性、适用于某一特定用途等。 2、CNKI大成编客平台有权在提前通知或不通知的情况下随时修改、限制、暂停或终止全部或部分CNKI大成编客平台服务，对于此等修改、限制、暂停或终止行为，CNKI大成编客对您或第三方不负任何责任。</div>
        <div> 七、违约责任 1、 除本协议另有约定外，任何一方直接或间接违反本协议的任何条款或不承担或不及时、充分地承担本协议规定其应承担的义务，即构成违约行为，应各自承担相应的责任。 2、 除本协议另有约定外，违约方因其违约行为而应赔偿的守约方的损失包括但不限于守约方因违约方的违约行为而遭致的直接的经济损失及任何可预期的间接损失及其他合理的费用，包括但不限于律师费用、诉讼及仲裁费用、财务费用及差旅费等。</div>
        <div> 八、协议期限与终止 1、本协议自您接受之日起生效，期限自协议生效之日起一年，有效期满，如双方无异议，该协议自动续签一年，自动续签无次数限制。</div>
        <div> 九、争议解决 1、如双方就本协议内容或其执行发生任何争议，双方均应通过友好协商解决；协商不成，任何一方均可将争议提交北京市海淀区人民法院裁决。 2、如本协议任何条款由法院裁决为无效，不影响本协议其他条款的持续有效和执行。 </div>
        <div>十、其他事项 1、本协议未尽事宜，双方可协商签署补充协议说明。 2、本协议最终解释权归《中国学术期刊（光盘版）》电子杂志社有限公司所有。</div>
      </div>
    </el-dialog>
    <!-- 底部确认 -->
    <div class="rz-fixed" v-if="dialogRZVisible">
      <el-checkbox v-model="checked">我已阅读并接受以上协议</el-checkbox>
      <el-button type="primary" :disabled="!checked" :class="!checked ? 'disabled' : ''" round @click="handleSummit">提交</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import SZKlist from "./list.vue";
import navTop from "@/components/layouts/nav";
export default {
  data() {
    return {

      allSize: 20, // all一页显示的数量
      allCurPage: 1, // all-当前页
      allTotal: null, // all-总条数

      publishSize: 20, // publish 一 页显示的数量
      publishCurPage: 1, // publish - 当前页
      publishTotal: null, // publish  - 总条数

      editSize: 20, // edit 一 页显示的数量
      editCurPage: 1, // edit - 当前页
      editTotal: null, // edit  - 总条数
      
      listData: [], // 项目数据
      listPublishedData: [],
      listEditingData: [],

      projectCount: null,
      userCount: null,
      chapterCount: null,

      isHadRenz2: false, 
      isHadRenZ: false, // 是否已经认证
      checked: false, 
      dialogRZVisible: false, // 认证对话框

      loading: false,
      activeName: 'all', // 当前tab
    }
  },
  components: {
    SZKlist,
    navTop       
  },
  watch: {
    listData (newVal) {
      this.listData = newVal
    },
    dialogRZVisible (newVal) {
      this.dialogRZVisible = newVal
    }
  },
  methods: {

    // 改变 all 一页显示量
    changeAllSize (val) {
      this.allSize = val
      this.getListData('all')
    },

    // 改变 publish 一页显示量
    changePubSize (val) {
      this.publishSize = val
      this.getListData('publish')
    },

    // 改变 edit 一页显示量
    changeEditSize (val) {
      this.editSize = val
      this.getListData('editing')
    },

    // 改变 all 的当前页数
    changeCurPageAll (val) {
      this.allCurPage = val
      this.getListData('all')
    },

    // 改变 publish 的当前页数
    changeCurPagePublish (val) {
      this.publishCurPage = val
      this.getListData('publish')
    },

    // 改变 edit 的当前页数
    changeCurPageEdit (val) {
      this.editCurPage = val
      this.getListData('editing')
    },

    // 提交认证
    handleSummit () {
      let self = this
      this.dialogRZVisible = false
      this.isHadRenZ = true
      this.isHadRenz2 = true
      setTimeout(function (){
        self.isHadRenz2 = false
      }, 3000)
    },

    // 去认证
    handleGoConfirm () {
      this.dialogRZVisible = true
    },
    
    // 跳转到编审系统的登录页
    handleGoLogin () {
      window.open('http://szweb.lanbenzi.cn/', "_blank");
    },

    // 切换tab
    handleClick(tab, event) {
      let name = tab.name
      this.activeName = name
      this.getListData(name)
    },

    // 一进入加载
    getListData(ptype) {
      let self = this
      let pageNum, pageSize
      if (ptype === 'all') {
        pageNum = this.allCurPage
        pageSize = this.allSize
      }
      if (ptype === 'publish') {
        pageNum = this.publishCurPage
        pageSize = this.publishSize
      }
      if (ptype === 'editing') {
        pageNum = this.editCurPage
        pageSize = this.editSize
      }
      let params = {
        type: ptype,
        pageNum: pageNum,
        pageSize: pageSize // 每页查询条数
      }
      this.loading = true
      axios.get('http://szapi.lanbenzi.cn/szk_api/project/list',{params}).then(function(res){
        if (ptype === 'all') {
          self.listData = res.projectList
          self.allTotal = res.totalRecord
        }
        if (ptype === 'publish') {
          self.listPublishedData = res.projectList
          self.publishTotal = res.totalRecord
        }
        if (ptype === 'editing') {
          self.listEditingData = res.projectList
          self.editTotal = res.totalRecord
        }
        self.loading = false
      }).catch(function (error) {
        self.$message.warning(error)
        self.loading = false
      });
    },

    // 一进入页面加载
    getCount () {
      let self = this
      this.loading = true
      axios.get('http://szapi.lanbenzi.cn/szk_api/count',{}).then(function(res){
        self.projectCount = res.projectCount
        self.userCount = res.userCount
        self.chapterCount = res.chapterCount
        self.loading = false
      }).catch(function (error) {
        self.$message.warning(error)
        self.loading = false
      });
    }

  },
  mounted () {
    this.getListData('all')
    this.getCount()
  }
};
</script>
<style lang="scss">
.szk-list-page{
  width: 100%;
  background: #fff;
  justify-content: center;
  align-items: center;
  div {
    text-align: center;
    img {
    }
    p {
      margin: auto;
      width: 182px;
      height: 24px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 24px;
      text-align: center;
      margin-top: 3px;
    }
  }
  .banner{
    padding-top: 80px;
    width: 100%;
    height: 438px;
    background: url('../../assets/images/szk/szk-bg.png') left -2px no-repeat;
    background-size: 100% 100%;
    .number-content{
      ul{
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        padding: 80px 0;
      }
      li{
        margin: 0 30px;
        font-size: 28px;
        font-weight: normal;
        color:rgba(255,255,255,1);
        line-height: 29px;
        font-family:FZDBSJW--GB1-0,FZDBSJW--GB1;
        text-shadow: 0px 2px 24px rgba(0,0,0,0.2);
        letter-spacing: 3px;
        .number-css{
          position: relative; 
          display: inline-block;
          padding-bottom: 30px;
          font-family: "宋体";
        }
        .comma{
          position: relative;
          width: 20px;
          font-size: 30px;
          display: inline-block;
        }
        .item {
          position: relative;
          display: inline-block;
          width: 34px;
          height: 64px;
          background: linear-gradient(180deg,rgba(255, 255, 255, 0.2) 0%,rgba(255,255,255,0.1) 51%,rgba(255,255,255,0) 100%);
          box-shadow: 0px 0px 3px 0px rgba(255,255,255,1);
          border-radius: 2px 2px 0px 0px;
          margin: 0 3px;
        }
        .under, .on {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          line-height: 62px;
          font-weight: normal;
          color: #fff;
          font-size: 56px;
        overflow: hidden;
        }
        .bottom {
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 50%;
          line-height: 0;
          background: linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.1) 51%,rgba(255,255,255,0.2) 100%);
          box-shadow: 0px 0px 3px 0px rgba(255,255,255,1);
          overflow: hidden;    /*不加这行就不会隐藏掉上面那半个数字部分*/
        }
        .animate {
          animation-name: flip;
          animation-duration: 1s;
          animation-direction: normal;
          animation-fill-mode: forwards;
        }
      }
    }
    .btn-wrap .el-button{
      width: 273px;
      height: 48px;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 400;
      color: #333;
      margin-right: 40px;
      border: 1px solid #fff;
      transition: color 1s, border 1s;
      &:hover{
        // color: #9C7624;
        background: #fff;
        border-color: #9C7624;
      }
      &.rz{
        background: transparent;
        color: #fff;
        &:hover{
          // color: #9C7624;
        }
        img{
          width: 18px;
          height: 18px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 5px;
        }
      }
    }
    .animate1 {
      animation-delay: .3s;
      -webkit-animation-delay: .3s;
    }
    .animate2 {
      animation-delay: .6s;
    }
    .animate3 {
      animation-delay: .9s;
    }
    .animate4 {
      animation-delay: 1.2s;
    }
    .animate5 {
      animation-delay: 1.5s;
    }
    .animate6 {
      animation-delay: 1.8s;
    }
    .animate7 {
      animation-delay: 2.1s;
    }
    .animate8 {
      animation-delay: 2.4s;
      }
    .animate9 {
      animation-delay: 2.7s;
    }
  }
  .list-content{
    width: 1170px;
    margin: 0 auto;
    padding: 20px 0 60px;
  }
  .el-loading-mask{
    z-index: 5 !important;
  }
  .el-tabs__nav-wrap::after{
    background: transparent !important;
  }
  .el-tabs__item.is-active{
    font-weight: bold;
    color: #333;
  }
  .el-tabs__active-bar{
    background: #AB936D;
  }
  .el-tabs__item:hover{
    color: #AB936D;
  }
  .rz-content{
    div{
      text-align: left !important;
    }
  }
  .el-dialog__title{
    font-size:24px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:32px;
  }
  .el-dialog__body{
    padding: 0 50px 80px;
    div{
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:23px;
      padding: 20px 0;
    }
  }
  .rz-fixed{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    // height: 136px;
    width: 100%;
    z-index: 2002;
    box-shadow:0px 2px 24px 0px rgba(0,0,0,0.2);
    border-radius:6px 6px 0px 0px;
    background: #fff;
    padding: 30px 0;
    .el-button{
      display: block;
      margin: 20px auto 0;
      border: 0;
      width: 370px;
      border-radius: 24px;
      height: 48px;
      font-size: 18px;
      background:linear-gradient(270deg,rgba(201,183,150,1) 0%,rgba(179,150,105,1) 100%);
      &.disabled{
        background: #ccc;
      }
    }
  }
  .msg-tips{
    left: 50%;
    margin-left: -176px;
    position: fixed;
    width:354px;
    height:202px;
    background:rgba(0,0,0,0.8);
    box-shadow:0px 0px 24px 0px rgba(0,0,0,0.15);
    border-radius:8px;
    z-index: 2003;
    top: 100px;
    padding: 0 20px;
    .el-icon-check{
      font-size: 60px;
      color: #fff;
      padding: 18px 0 0;
    }
    .div1{
      font-size:18px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:30px;
    }
    .div2{
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:23px;
    }
  }
}
@keyframes flip{
  from {
    transform: rotateX(180deg);
    width: 100%;
  }
  to {
    transform: rotateX(0);
  }
}      
</style>
