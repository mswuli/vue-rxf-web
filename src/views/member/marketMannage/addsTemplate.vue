<template>
  <div class="mains">
    <div class="btns">
      <span>查看</span>
      <el-button @click="out" class="close">退出</el-button>
    </div>
    <div class="banner">
      <el-form label-width="100px">
        <el-form-item label="状态" class="name">
          <el-input v-model="detailList.statusCN" placeholder="请输入内容" class="con" :disabled="readonly"></el-input>
        </el-form-item>
        <el-form-item label="活动名称" class="name">
          <el-input v-model="detailList.name" placeholder="请输入内容" class="con" :disabled="readonly"></el-input>
          <div class="types">
            <div class="left">
              <span class="spans">发送类型</span>
              <el-radio v-model="detailList.sendType" label="短信" :disabled="readonly">短信</el-radio>
            </div>
          </div>
        </el-form-item>
        <div class="formulate">
          <el-form-item label="制定人" class="formulate-left">
            <el-input v-model="detailList.formulator" :disabled="readonly"></el-input>
          </el-form-item>
          <el-form-item label="制定日期" class="formulate-center">
            <el-input v-model="detailList.formulationOfDate" :disabled="readonly"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="客户类型" class="formulate-right">
          <el-tag
            v-for="(tag,i) in queryTypeList"
            :key="i"
            closable
            :disabled="readonly"
            type="info">
            {{tag}}
          </el-tag>
        </el-form-item>
        <el-form-item label="客户标签" class="formulate-label">
          <el-tag
            v-for="(tag,i) in queryLabelList"
            :key="i"
            closable
            :disabled="readonly"
            type="info">
            {{tag}}
          </el-tag>
        </el-form-item>
        <div class="mode">
          <p>1.发送方式</p>
          <div class="send">
            <span>发送频率</span>
            <el-radio v-model="detailList.sendTheObject" label="1" :disabled="readonly">一次</el-radio>
          </div>
          <div class="send">
            <span>发送计划</span>
            <el-radio v-model="detailList.sendingPlan" label="0" @change="fastSend" :disabled="readonly">立即发送</el-radio>
            <el-radio v-model="detailList.sendingPlan" label="1" @change="planSend" :disabled="readonly">按计划发送
            </el-radio>
          </div>
          <div class="starts">
            <el-form-item label="月份：" v-show="showMonth" label-width="70px">
              <el-radio v-model="detailList.month" :label="item.label" v-for="(item ,index) in months" :key="index"
                        :disabled="readonly">
                {{item.name}}
              </el-radio>
            </el-form-item>
            <el-form-item label="发送日期" label-width="70px" class="sendTime" v-show="send">
              <el-date-picker
                :disabled="readonly"
                v-model="detailList.calendarDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发送时间" label-width="70px" class="sends" v-show="send">
              <el-input v-model="detailList.sendingTime" :disabled="readonly"></el-input>
            </el-form-item>
            <el-form-item label="活动开始日期至结束日期" label-width="180px" class="start" v-show="sending">
              <el-input v-model="timeArea" :disabled="readonly"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="mode">
          <p>2.发送内容</p>
          <div class="send">
            <span>内容描述</span>
            <el-input v-model="detailList.description" placeholder="请输入内容" type="textarea"
                      :disabled="readonly"></el-input>
          </div>
          <div class="send">
            <span>发送对象</span>
            <el-radio v-model="detailList.sendTheObject" label="1" :disabled="readonly">按查询条件发送</el-radio>
          </div>
        </div>
      </el-form>
      <div class="footer">
        <div class="footer-up">
          <span>客户台账</span>
        </div>
        <el-table
          :data="memberList.data"
          stripe
          style="width: 100%">
          <el-table-column
            prop="patientName"
            label="姓名"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="sexName"
            label="性别"
            width="50"
          >
          </el-table-column>
          <el-table-column
            prop="idCard"
            label="身份证号"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="tel"
            label="联系电话"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
          <el-table-column
            prop="professional"
            label="职业">
          </el-table-column>
          <el-table-column
            prop="disease"
            label="诊断结果">
          </el-table-column>
          <el-table-column
            prop="treatmentSituation"
            label="治疗状况">
          </el-table-column>
          <el-table-column
            prop="economicConditions"
            label="消费水平">
          </el-table-column>
          <el-table-column
            prop="patientsType"
            label="客户类型"
          >
          </el-table-column>
          <el-table-column
            prop="patientsLabel"
            label="客户标签"
          >
          </el-table-column>
          <el-table-column
            label="客户电子病历"
          >
            <template slot-scope="scope">
              <el-button @click="eRecords(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="ledgerDetail(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="ledgerHandleSizeChange" @current-change="ledgerHandleCurrentChange"
                         :current-page="param.page" :page-sizes="[10,20,30, 50]"
                         :page-size="param.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="memberList.total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        class="epr"
        title=""
        :visible.sync="esdialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">电子病历</span>
          <el-button @click="eClosed3" class="close">关闭</el-button>
        </div>
        <div class="history">
          <p>病历</p>
          <div class="cont">
            <div class="cont-up">
              <span class="hospital">日期：<span>1</span></span>
              <span class="hospital">医院：<span>1</span></span>
              <span class="hospital">科别：<span>1</span></span>
            </div>
            <div class="cont-down">
              <span class="date">主诉：<span>1</span></span>
              <span class="date">现病史，既往史，家族史：<span>1</span></span>
              <span class="date">过敏史：<span>1</span></span>
              <span class="date">体格检查：<span>1</span></span>
              <span class="date">辅助检查：<span>1</span></span>
              <span class="date">初步诊断：<span>1</span></span>
              <span class="date">治疗意见/医嘱：<span>1</span></span>
            </div>
            <div class="cont-foot">
              <span class="doctors">医生签名：<span></span></span>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        class="epr"
        title=""
        :visible.sync="picsDialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">电子病历</span>
          <el-button @click="eClosed4" class="close">关闭</el-button>
        </div>
        <div class="history">
          <!--<img src="../../../assets/profile.png" alt="电子病历图片">-->
          <template v-if="patientMedicinePic">
            <img :src=patientMedicinePic alt="电子病历图片" style="width:100% ;height:100%" class="images">
          </template>
          <template v-else>
            <span class="spans">暂无病历图片</span>
          </template>
        </div>
      </el-dialog>
      <el-dialog
        class="sending"
        title=""
        :visible.sync="querysDialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">查看详情</span>
          <div class="close">
            <el-button @click="querysDialogVisible = false">关闭</el-button>
          </div>
        </div>
        <div class="history">
          <el-form label-width="100px">
            <el-form-item label="姓名">
              <el-input v-model="detailLists.patientName" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="detailLists.sexName" :disabled="readonly"></el-input>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="detailLists.idCard" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="detailLists.tel" type="number" maxlength="11" minlength="11" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="detailLists.address" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="职业">
              <el-input v-model="detailLists.professional" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="诊断结果" class="results">
              <el-input v-model="detailLists.disease" type="textarea" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="治疗状况">
              <el-input v-model="detailLists.treatmentSituation" type="textarea" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="消费水平">
              <el-input v-model="detailLists.economicConditions" type="textarea" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="客户类型">
              <el-input v-model="detailLists.patientsType" :disabled="readonly"></el-input>
            </el-form-item>
            <el-form-item label="客户电子病历" label-width="130px">
              <!--<el-upload-->
              <!--class="upload-demo"-->
              <!--:mutiple="true"-->
              <!--:action="attachmentUploadUrl"-->
              <!--:on-change="uploadDblPicSuccess"-->
              <!--:show-file-list="true"-->
              <!--:before-upload="beforeAvatarUpload"-->
              <!--:headers="headersData"-->
              <!--:limit=20>-->
              <!--<span class="upload">上传</span>-->
              <!--</el-upload>-->
            </el-form-item>
            <el-form-item label="客户标签" class="select">
              <el-tag
                v-for="(tag,i) in listing"
                :key="i"
                type="info">
                {{tag}}
              </el-tag>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {getToken} from '@/utils/auth'
  import moment from 'moment'

  export default {
    name: "addsTemplate",
    data() {
      return {
        patientMedicinePic:"",
        readonly: true,
        showMonth: false,
        esdialogVisible: false,
        picsDialogVisible: false,
        querysDialogVisible: false,
        months: [
          {
            name: "一月",
            label: '1'
          },
          {
            name: "二月",
            label: '2'
          },
          {
            name: "三月",
            label: '3'
          },
          {
            name: "四月",
            label: '4'
          },
          {
            name: "五月",
            label: '5'
          },
          {
            name: "六月",
            label: '6'
          },
          {
            name: "七月",
            label: '7'
          },
          {
            name: "八月",
            label: '8'
          },
          {
            name: "九月",
            label: '9'
          },
          {
            name: "十月",
            label: '10'
          },
          {
            name: "十一月",
            label: '11'
          },
          {
            name: "十二月",
            label: '12'
          }
        ],
        listing: [],
        send: false,
        sending: false,
        timeArea: "",
        param: {page: 1, limit: 10, searchCondition: {status: '', patientsType: '', patientsParentLabel: '', patientsChildLabel: '',tel:'' }},
      }
    },
    props: ['queryTypeList', 'queryLabelList'],
    computed: mapState({
      detailLists: state => state.memberMannage.detailLists,
      customLabel: state => state.memberMannage.customLabel,
      memberList: state => state.memberMannage.memberList,
      detailList: state => state.marketMannage.detailList,
    }),
    methods: {
      // 活动台账列表
      getMemberList() {
        this.param.searchCondition.patientsType = this.detailList.patientsTypeCN
        this.param.searchCondition.patientsParentLabel = this.detailList.patientsParentLabel
        this.param.searchCondition.patientsChildLabel = this.detailList.patientsChildLabel
        this.param.searchCondition.month = this.detailList.month == 0 ? null : this.detailList.month;
        this.param.searchCondition.tel = this.detailList.mobiles;
        this.$store.dispatch("getMemberList", {params: this.param})
      },
      out() {
        this.$emit('out')
      },
      fastSend() {
        this.$emit('fastSend')
      },
      planSend() {
        this.$emit('planSend')
      },
      eRecords(row) {
        this.patientMedicinePic ="";
        if (row.patientsType === "自主购药用户") {
          this.$store.dispatch("getElectronicRecord", {tel: row.tel}).then(response => {
            this.patientMedicinePic = response.data.medicalRecordPic;
            this.picsDialogVisible = true;
          })
        } else {
          this.$store.dispatch("getElectRecord", {tel: row.tel}).then(response => {
            this.esdialogVisible = true;
          })
        }
      },
      ledgerDetail(row) {
        this.$store.dispatch('getDetailMemberMannage', {tel: row.tel}).then(res => {
          this.querysDialogVisible = true;
          this.$store.dispatch("getQueryLabel", {params: {tel: row.tel}}).then(response => {
            this.listing = response.data;
            let ee = [];
            if (this.listing === undefined) {
              return false;
            }
            for (let i = 0; i < this.listing.length; i++) {
              ee.push(this.listing[i].name);
              if (this.listing[i].patientLabelTemplateVOS === undefined || this.listing[i].patientLabelTemplateVOS === null) {
                continue;
              }
              for (let j = 0; j < this.listing[i].patientLabelTemplateVOS.length; j++) {
                ee.push(this.listing[i].patientLabelTemplateVOS[j].fullName)
              }
            }
            this.listing = ee;
          });
        })
      },
      ledgerHandleSizeChange(size) {
        this.param.limit = size;
        this.getMemberList();
      },
      ledgerHandleCurrentChange(page) {
        this.param.page = page;
        this.getMemberList();
      },
      eClosed4() {
        this.picsDialogVisible = false;
      },
      eClosed3() {
        this.esdialogVisible = false;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .mains {
    width: 100%;
    padding: 10px;
    .btns {
      background: #ccc;
      height: 40px;
      span {
        margin-left: 20px;
        line-height: 40px;
      }
      .close {
        float: right;
        height: 36px;
        margin: 2px 20px 0px 0px;
        color: #409EFF;
      }
    }
    .banner {
      width: 100%;
      /*height:100%;*/
      .name {
        width: 100%;
        margin-top: 10px;
        position: relative;
        .conn {
          width: 44%;
        }
        .con {
          width: 44%;
        }
        .types {
          position: absolute;
          top: 0%;
          left: 48%;
          .left {
            .spans {
              margin-right: 20px;
            }
          }
        }
      }
      .formulate {
        width: 100%;
        .formulate-left {
          float: left;
        }
        .formulate-center {
          float: left;
        }
      }
      /deep/ .el-form-item {
        float: left;
      }
      .formulate-right {
        width: 100%;
      }
      .formulate-label {
        width: 100%;
        /deep/ .el-tag {
          height: 40px;
          line-height: 40px;
          margin-left: 5px;
        }
      }
      .all {
        float: left;
      }
      /deep/ .el-checkbox__inner {
        width: 35px;
        height: 35px;
      }
      /deep/ .el-checkbox__inner::after {
        width: 10px;
        height: 20px;
        left: 12px;
        top: 2px;
      }
      /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        border: 1px solid #409eff;
        margin-left: 10px;
        line-height: 34px;
        font-size: 14px;
        width: 120px;
        text-align: center;
      }
      /deep/ .el-checkbox__label {
        margin-left: 10px;
        line-height: 34px;
        font-size: 14px;
        width: 120px;
        text-align: center;
      }
      .mode {
        width: 100%;
        float: left;
        padding: 0px 30px;
        p {
          font-size: 18px;
          color: #606266;
        }
      ;
        span {
          margin-right: 10px;
          font-size: 14px;
          color: #606266
        }
        /deep/ .el-textarea {
          width: 60%;
          vertical-align: top;
        }
        .lists {
          display: inline-block;
          li {
            list-style: none;
            span {
              color: #66b1ff;
            }
          }
        }
        .send {
          margin-top: 10px;
        }
        .starts {
          width: 100%;
          height: 100%;
          /*/deep/ .el-input-inner*/
          /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 200px;
          }
          /deep/ .el-date-editor .el-range-separator {
            width: 10%;
          }
          .sendTime {
            margin-top: 10px;
            text-align: left;
            float: left;
          }
          .sends {
            margin: 10px 10px 0px 10px;
            float: left;
          }
          .start {
            margin-top: 10px;
            float: left;
            width: 500px;
          }
          /deep/ .el-form-item__label {
            text-align: left;
          }
        }
      }
      .footer {
        float: left;
        margin-top: 20px;
        .footer-up {
          background: #ccc;
          height: 40px;
          span {
            margin-left: 20px;
            line-height: 40px;
          }
        }
      }
      .epr {
        /deep/ .el-icon-close:before {
          content: ''
        }
        /deep/ .el-dialog__header {
          padding: 0px;
        }
        /deep/ .el-dialog__body {
          /*position:relative;*/
          padding: 0px;
          width: 100%;
          height: 100%;
          /*height:800px;*/
          .icons {
            width: 100%;
            height: 40px;
            background: #ccc;
            .title {
              font-size: 16px;
              line-height: 40px;
              margin-left: 15px;
            }
            .close {
              color: #409EFF;
              float: right;
              margin-right: 20px;
            }
          }
          .history {
            width: 100%;
            position:relative;
            height:400px;
            .spans{
              font-size:20px;
              position:absolute;
              top:40%;
              left:40%;
            }
            p {
              font-size: 18px;
              text-align: center;
            }
            .cont {
              width: 96%;
              margin: 0 auto;
              .cont-up {
                width: 100%;
                .hospital {
                  width: 33.33%;
                  display: block;
                  float: left;
                  margin-bottom: 20px;
                }
              }
              .cont-down {
                width: 100%;
                .date {
                  width: 100%;
                  display: block;
                  margin-top: 20px;
                }
              }
              .cont-foot {
                width: 100%;
                height: 50px;
                margin-top: 20px;
                .doctors {
                  float: right;
                  margin-right: 100px;
                }
              }
            }
          }
        }
      }
    }
    .sending {
      /*height:100%;*/
      /deep/ .el-icon-close:before {
        content: ''
      }
      /deep/ .el-dialog__header {
        padding: 0px;
      }
      /deep/ .el-dialog__body {
        padding: 0px;
        width: 100%;
        height: 100%;
        .icons {
          width: 100%;
          height: 40px;
          background: #ccc;
          .title {
            font-size: 16px;
            line-height: 40px;
            margin-left: 15px;
          }
          .close {
            color: #409EFF;
            float: right;
            margin-right: 20px;
          }
        }
        .history {
          width: 100%;
          height: 600px;
          margin-top: 20px;
          /deep/ .el-input {
            width: 100%;
          }
          /deep/ .el-form-item {
            width: 49%;
            float: left;
          }
          /deep/ .el-form-item__content {
            line-height: 40px;
          }
          /deep/ .el-select {
            display: block;
          }
          .results {
            width: 98%;
          }
          .upload {
            color: #66b1ff;
            display: block;
            line-height: 40px;
          }
          .select {
            width: 100%;
          }
          .selected {
            width: 100%;
          }
          /deep/ .el-tag {
            height: 39px;
            line-height: 39px;
            margin-left: 5px;
            margin-top: 5px;
          }
          /deep/ .el-tabs__nav-wrap {
            margin-bottom: 0px;
          }
          /deep/ .el-tabs--card > .el-tabs__header {
            border: none;
          }
          /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
            border-bottom: 1px solid #ccc;
          }
          .customer {
            float: left;
            margin-right: 10px;
            margin-bottom: 10px;
            .customers {
              color: #606266;
              font-size: 14px;
            }
            /deep/ .el-icon-close:before {
              content: "\E60F"
            }
          }
        }
      }
    }
  }
</style>
