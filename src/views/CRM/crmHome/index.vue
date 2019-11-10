<template>
  <el-container>
    <el-aside width="301px" class="asides">
      <div class="top">
        <div class="top-up">
          <img src="../../../styles/images/fire.png" alt="" class="images">
          <span class="sales">促销活动</span>
        </div>
        <div class="top-down">
          <ul v-for="(item ,index) in promotionsList.data" :key="index" class="uls">
            <li>
              <el-tooltip class="item" effect="light" placement="top-start" offset="50">
                <div slot="content">{{item.name}}</div>
                <a href="#" class="list-left">{{item.name}}</a>
              </el-tooltip>
              <a href="#" class="list-center">{{item.formulator}}</a>
              <a href="#" class="list-right">{{item.beginDate | dateFilter}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="down">
        <div class="down-up">
          <img src="../../../styles/images/origin.png" alt="" class="images">
          <span class="sales">智能推荐</span>
        </div>
        <div class="downs">
        </div>
      </div>
    </el-aside>
    <el-main class="main">
      <div class="main-top">
        <div class="main-up">
          <img src="../../../styles/images/date.png" alt="" class="images">
          <span class="sales">购药提醒</span>
        </div>
        <el-form label-width="100px">
          <el-form-item label="活动设置：">
            <el-select v-model="sets" placeholder="请选择"  @change="select">
              <el-option
                v-for="item in selectTemplate.data"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
              </el-option>
            </el-select>
            <el-button type="primary" @click="edit">编辑</el-button>
          </el-form-item>
          <el-form-item label="客户类型：" v-show="showing">
            <el-button type="info" class="all" :disabled="forbidden" id="allType">全部</el-button>
            <span class="lines"></span>
            <el-checkbox-group v-model="list">
              <el-checkbox v-for="(item ,index) in customType" :label="item" :key="index" :disabled="forbidden"
                           class="types">
                {{item}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="客户标签：" v-show="showing">
            <el-button type="info" class="all" :disabled="forbidden" id="allLabel">全部</el-button>
            <span class="lines"></span>
            <div class="tabs">
              <el-checkbox-group v-model="tabList" size="medium" disabled>
                <el-checkbox-button v-for="item in customLabels" :label="item.name" :key="item.name">
                  {{item.name}}
                </el-checkbox-button>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="您已选择：" v-show="!(typeList.length === 0 &&　labelList.length === 0)">
            <div class="customer">
              <span class="customers">客户类型：</span>
              <el-tag
                v-for="(tag,i) in typeList"
                :key="i"
                type="info">
                {{tag}}
              </el-tag>
            </div>
            <div class="customer">
              <span class="customers">客户标签：</span>
              <el-tag
                v-for="(tag, i) in labelList"
                :key="i"
                type="info">
                {{tag}}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="月份：" v-show="showMonth">
            <el-radio v-model="month" :label="item.label" v-for="(item ,index) in months" :key="index"
                      :disabled="forbidden">
              {{item.name}}
            </el-radio>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="onSubmit">确认</el-button>
            <el-button type="danger" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-down">
        <div class="down-up">
          <div class="left" v-show="showList"><span>预警列表</span></div>
          <div class="left" v-show="!showList"><span>生日列表</span></div>
          <div class="right">
            <el-button @click="fresh">刷新</el-button>
            <el-button disabled v-show="showSend">一键发送</el-button>
            <el-button type="warning" @click="sending" v-show="!showSend">一键发送</el-button>
          </div>
        </div>
        <el-table
          :data="findAlertList.data"
          stripe
          style="width: 100%">
          <el-table-column
            prop="patientName"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="patientsType"
            label="客户类型">
          </el-table-column>
          <el-table-column
            prop="patientsLabel"
            label="客户标签">
          </el-table-column>
          <el-table-column
            prop="treatmentStartTime"
            label="近日购药时间">
            <template slot-scope="scope">
              {{scope.row.treatmentStartTime | dateFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="treatmentEndTime"
            label="最佳续方时间">
            <template slot-scope="scope">
              {{scope.row.treatmentEndTime | dateFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            prop="sexName"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="tel"
            label="联系方式">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="send(scope.row)" type="text" size="small" v-show="!showSend" style="color:#66b1ff">
                发送短信
              </el-button>
              <el-button type="text" size="small" style="color:#606266" v-show="showSend">发送短信</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="param.page" :page-sizes="[10,20,30, 50]"
                         :page-size="param.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="findAlertList.total">
          </el-pagination>
        </div>
      </div>
    </el-main>
    <el-dialog
      class="sending"
      title="活动短信"
      :visible.sync="messageDialogVisible"
      width="50%"
      :close-on-click-modal=false>
      <el-form label-width="100px">
        <el-form-item label="模板名称">
          <el-input v-model="detailTemplate.name" :disabled="forbidden">
          </el-input>
        </el-form-item>
        <el-form-item label="模板描述">
          <div class="divs" style="color:#606266;font-size:14px;height:30px" id="description"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSave">保存</el-button>
        <el-button @click="messageDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="send"
      :visible.sync="sendDialogVisible"
      width="30%"
      :close-on-click-modal=false>
      <span>当前总计<span>{{findAlertList.total}}</span>条，请确认后一键发送短信</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="define" class="buttons">确 定</el-button>
        <el-button @click="sendDialogVisible = false" class="buttons">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="send"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal=false>
      <span>当前总计<span>1</span>条，请核对后点击确定</span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="definer" class="buttons">确 定</el-button>
        <el-button @click="dialogVisible = false" class="buttons">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import {mapState} from 'vuex'
  import {getToken} from '@/utils/auth'
  import moment from 'moment'

  export default {
    data() {
      return {
        readonly: false,
        showing: false,
        showSend: true,
        dialogVisible: false,
        messageDialogVisible: false,
        sendDialogVisible: false,
        customType: ['自主购药用户', '处方外延用户', '视频问诊用户'],
        form: {},
        param: {page: 1, limit: 10, searchCondition: {}},
        list: [],
        typeList: [],
        edits: "",
        labelList: [],
        customLabel: [],
        level: '1',
        date: new Date(),
        forbidden: false,
        sets: '',
        tells: [],
        msg: [],
        month: null,
        showMonth: false,
        showList: true,
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
        smsCode: "",
        tabList: [],
      }
    },
    created() {
      this.getPromotionsList();
      this.getFindAlertList();
      this.getSelectTemplate();
      this.getCustomLabel();
    },
    computed: mapState({
      promotionsList: state => state.crmHome.promotionsList,
      findAlertList: state => state.crmHome.findAlertList,
      selectTemplate: state => state.crmHome.selectTemplate,
      detailTemplate: state => state.marketMannage.detailTemplate,
      customLabels: state => state.memberMannage.customLabel
    }),
    methods: {
      getPromotionsList() {
        this.date = moment(this.date).format('YYYY-MM-DD');
        this.$store.dispatch("getPromotionsList", {params: {beginDate: this.date}})
      },
      getFindAlertList() {
        this.$store.dispatch("getFindAlertList", {params: this.param})
      },
      getSelectTemplate() {
        this.$store.dispatch("getSelectTemplate", {templateStatus: 0,type:0})
      },
      getCustomLabel() {
        this.$store.dispatch("getCustomLabel", {params: {level: this.level}}).then(response => {
        })
      },
      reset() {
        this.sets = "";
        this.list = [];
        this.edits = "";
        this.typeList = [];
        this.labelList = [];
        this.showMonth = false;
        this.showing = false;
        this.showSend = true;
        this.param.searchCondition = {};
        this.getFindAlertList();
      },
      // 下拉选择模板
      select(value) {
        this.edits = null;
        this.list = [];
        this.typeList = [];
        this.labelList = [];
        this.forbidden = true;
        this.showing = true;
        this.month = null;
        this.$store.dispatch("getDetailTemplate", {id: value}).then(res => {
          if (res.data.typeOfActivity === "1" && res.data.sendingPlan === "1") {
            this.showList = false;
            this.showMonth = true;
          } else if (res.data.typeOfActivity === "1" && res.data.sendingPlan === "0") {
            this.showList = false;
            this.showMonth = true;
          } else if (res.data.typeOfActivity === "0" && res.data.sendingPlan === "0") {
            this.showList = true;
            this.showMonth = false;
          } else if (res.data.typeOfActivity === "0" && res.data.sendingPlan === "1") {
            this.showList = true;
            this.showMonth = false;
          } else {
          }
          let templateInfo = res.data;
          this.$store.dispatch("getTemplateInfo", templateInfo);
          let a = res.data.patientsType.split(",");
          for (let i = 0; i < a.length; i++) {
            this.list.push(this.customType[a[i]])
          }
          this.$store.dispatch("getQueryLabel", {params: {templateId: value}}).then(response => {
            this.customLabel = response.data;
            let ee = [];
            if (this.customLabel === undefined) {
              return false;
            }
            for (let i = 0; i < this.customLabel.length; i++) {
              ee.push(this.customLabel[i].name);
              if (this.customLabel[i].patientLabelTemplateVOS === undefined || this.customLabel[i].patientLabelTemplateVOS === null) {
                continue;
              }
              for (let j = 0; j < this.customLabel[i].patientLabelTemplateVOS.length; j++) {
                ee.push(this.customLabel[i].patientLabelTemplateVOS[j].fullName)
              }
            }
            this.tabList = ee;
            if (res.data.patientsType == "0,1,2") {
              this.typeList = ['全部'];
              let aa = document.getElementById("allType")
              aa.style.color = "#ffffff";
              aa.style.background = "#409EFF"
            } else {
              this.typeList = this.list;
            }
            if (res.data.patientsParentLabel == "") {
              this.labelList = ['全部'];
              let aa = document.getElementById("allLabel")
              aa.style.color = "#ffffff";
              aa.style.background = "#409EFF";
              this.$store.dispatch("getCustomLabel", {params: {level: this.level}}).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                  this.tabList.push(response.data[i].name)
                }
              })
            } else {
              this.labelList = this.tabList;
            }
            if(res.data.month == null){
              this.month = null
            }else{
              this.month = res.data.month.toString();
            }
          });
        })
      },
      edit() {
        if (this.sets == null || this.sets == "") {
          return this.$message({
            type: 'error',
            message: '请选择活动设置名称',
            duration: 1000 * 2,
          })
        }
        this.messageDialogVisible = true;
        this.readonly = true;
        this.smsCode = this.detailTemplate.smsTemplateId;
        let cc = this.detailTemplate.smsContent;
        let bb = cc.split(',');
        this.$store.dispatch("getSelectTemp", {params: {smsCode: this.smsCode}}).then(response => {
          let StrString = response.data[0].smsContent;
          let divs = document.getElementById("description");
          let reg = new RegExp("XX", "g");
          let inputs = StrString.replace(reg, "<input type='number' name='hh' value='' maxlength='3' style='width:9%;height:20px' oninput=\"if(value.length>3)value=value.slice(0,3)\">");
          divs.innerHTML = inputs;
          let desc = divs.children;
          for (let i = 0; i < bb.length; i++) {
            desc[i].value = bb[i];
          }
        })
      },
      // 模糊搜索
      onSubmit() {
        if (this.sets == null || this.sets == "") {
          return this.$message({
            type: 'error',
            message: '请选择活动设置名称',
            duration: 1000 * 2,
          })
        }
        this.showSend = false;
        let cc = [];
        let dd = [];
        this.param.searchCondition.patientsChildLabel = "";
        this.param.searchCondition.patientsParentLabel = "";
        this.param.searchCondition.patientsType = "";
        this.param.searchCondition.month = this.month == 0 ? null : this.month;
        this.param.searchCondition.patientsType = this.list.join(',');
        for (let i = 0; i < this.customLabel.length; i++) {
          cc.push(this.customLabel[i].name);
          if (this.customLabel[i].patientLabelTemplateVOS === null || this.customLabel[i].patientLabelTemplateVOS === "" || this.customLabel[i].patientLabelTemplateVOS.length === 0) {
            this.param.searchCondition.patientsParentLabel = cc.join(',');
          } else {
            for (let j = 0; j < this.customLabel[i].patientLabelTemplateVOS.length; j++) {
              dd.push(this.customLabel[i].patientLabelTemplateVOS[j].name)
              this.param.searchCondition.patientsParentLabel = cc.join(',');
              this.param.searchCondition.patientsChildLabel = dd.join(',');
            }
          }
        }
        ;
        this.$store.dispatch("getFindAlertList", {params: this.param})
      },
      // 刷新
      fresh() {
        this.getFindAlertList();
      },
      sending() {
        this.sendDialogVisible = true;
      },
      send() {
        this.dialogVisible = true;
      },
      handleSizeChange(size) {
        this.param.limit = size;
        this.getFindAlertList();
      },
      handleCurrentChange(page) {
        this.param.page = page;
        this.getFindAlertList();
      },
      // 编辑
      editSave() {
        let aa = document.getElementById("description");
        let els = aa.children;
        let strss = "";
        for (let i = 0; i < els.length; i++) {
          if (els.length > 1 && i != els.length - 1) {
            strss += els[i].value + ",";
          } else {
            strss += els[i].value
          }
        }
        let arr = this.$store.getters.templateInfo;
        arr.smsContent = strss;
        this.$store.dispatch('getEditTemplate', arr).then(response => {
            this.getSelectTemplate();
            this.$store.dispatch("getDetailTemplate", {id: response.data.id}).then(res => {
              this.$message({
                type: "success",
                message: "修改成功",
                duration: 1000 * 2
              });
              this.messageDialogVisible = false;
            })
        })
      },
      define() {
        let tell = [];
        for (let i = 0; i < this.findAlertList.data.length; i++) {
          tell.push(this.findAlertList.data[i].tel);
        }
        if(tell.length === 1){
          this.tells = tell.join("");
        }else{
          this.tells = ""
        }

        this.$store.dispatch("sendMessage", {
          data: {
            templateId: this.detailTemplate.id,
            source: "购药提醒",
            sendersOfNumber: this.findAlertList.total,
            status: '0',
            smsTemplateId: this.detailTemplate.smsTemplateId,
            description: this.detailTemplate.description,
            mobiles:this.tells,
            formulationOfDate: this.detailTemplate.formulationOfDate,
            sendingPlan: '0',
            calendarDate: moment(new Date()).format("YYYY-MM-DD"),
            sendingTime: moment(new Date()).format("HH:mm:ss"),
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: "发送成功",
            duration: 1000 * 2,
          })
          this.sendDialogVisible = false;
        })
      },
      definer() {
        for (let i = 0; i < this.findAlertList.data.length; i++) {
          let oneTell = [];
          oneTell.push(this.findAlertList.data[i].tel);
          this.msg = oneTell.join('');
        }
        this.$store.dispatch("sendMessage", {
          data: {
            templateId: this.detailTemplate.id,
            source: "购药提醒",
            sendersOfNumber: '1',
            status: '0',
            smsTemplateId: this.detailTemplate.smsTemplateId,
            description: this.detailTemplate.description,
            mobiles: this.msg,
            formulationOfDate: this.detailTemplate.formulationOfDate,
            sendingPlan: '0',
            calendarDate: this.date,
            sendingTime: this.detailTemplate.sendingTime,
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: "发送成功",
            duration: 1000 * 2,
          });
          this.dialogVisible = false;
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .asides {
    width: 100%;
    height: 100%;
    padding: 20px 10px;
    .top, .down {
      width: 100%;
      height: 100%;
      .top-up, .down-up {
        width: 100%;
        height: 40px;
        position: relative;
        background-color: #ccc;
        .images {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 20%;
          left: 2%;
        }
        .sales {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
          position: absolute;
          top: 25%;
          left: 10%;
        }
      }
      .top-down {
        width: 100%;
        height: 460px;
        margin-top: -16px;
        border: 1px solid #ccc;
        overflow-y: scroll;
        .uls {
          width: 100%;
          overflow-x: hidden;
          height: 40px;
          li {
            list-style: none;
            font-size: 14px;
            color: #333333;
            margin-left: -30px;
            line-height: 40px;
            width: 100%;
            .list-left {
              width: 45%;
              display: block;
              float: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .list-center {
              width: 20%;
              display: block;
              float: left;
              text-align: center;
            }
            .list-right {
              width: 35%;
              height: 39px;
              display: block;
              float: left;
              text-align: right;
            }
            .list-left:hover {
              /*color:red;*/
              /*width:auto;*/
            }
            .list-center:hover {
              color: red;
            }
            .list-right:hover {
              color: red;
            }
          }
        }
      }
    }
    .down {
      margin-top: 20px;
      .downs {
        width: 100%;
        min-height: 500px;
        /*background:pink;*/
        border: 1px solid #ccc;
      }
    }
  }

  .main {
    width: 100%;
    padding: 20px 10px 20px 0px;
    .main-top {
      width: 100%;
      .main-up {
        width: 100%;
        height: 40px;
        position: relative;
        background-color: #ccc;
        .images {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 20%;
          left: 2%;
        }
        .sales {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
          position: absolute;
          top: 25%;
          left: 6%;
        }
      }
      /deep/ .el-form-item {
        margin-top: 22px;
      }
      .lines {
        width: 2px;
        height: 39px;
        background: #ccc;
        display: block;
        float: left;
        margin: 0px 20px;
      }
      .all {
        float: left;
      }
      .types {
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #409EFF;
          border-color: #409EFF;
        }
        /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
          border-color: #fff;
        }
      }
      .tabs {
        /deep/ .el-checkbox-button--medium .el-checkbox-button__inner {
          padding: 10px 5px;
        }
        /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
          color: #fff;
          background-color: #409EFF;
        }
      }
      /deep/ .el-radio + .el-radio {
        margin-left: 5px;
      }
      /deep/ .el-radio__label{
        padding-left:0px;
      }
      /deep/ .el-radio__input.is-checked .el-radio__inner {
        background-color: #409EFF;
      }
      /deep/ .el-tabs--card > .el-tabs__header {
        border: none;
        margin-left: 100px;
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
      /deep/ .el-checkbox+.el-checkbox{
        margin-left:10px;
      }
      /deep/ .el-checkbox__label {
        margin-left: 10px;
        line-height: 34px;
        font-size: 14px;
        width: 100px;
        text-align: center;
      }
      .customer {
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
        .customers {
          color: #606266;
          font-size: 14px;
        }
      }
    }
    .main-down {
      width: 100%;

      .down-up {
        width: 100%;
        height: 41px;
        border: 1px solid #ccc;
        background: #ccc;
        .left {
          float: left;
          span {
            display: block;
            line-height: 40px;
            margin-left: 20px;
            font-weight: bold;
          }
        }
        .right {
          float: right;
          margin-right: 10px;
          line-height: 40px;
          height: 37px;
          /deep/ .el-button {
            height: 37px;
          }
        }
      }
    }
  }

  .sending {
    /deep/ .el-icon-close:before {
      content: "";
    }
    /deep/ .el-input {
      width: 90%;
    }
    /deep/ .el-textarea__inner {
      width: 90%;
    }
    /deep/ input::-webkit-outer-spin-button,
    /deep/ input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    /deep/ input[type="number"] {
      -moz-appearance: textfield;
    }
  }

  .send {
    /deep/ .el-dialog__body {
      text-align: center;
    }
    /deep/ .el-icon-close:before {
      content: "";
    }
    /deep/ .el-dialog__footer {
      text-align: center;
    }
    .buttons {
      margin: 0px 10px;
    }
  }
</style>
