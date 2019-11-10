<template>
  <div class="maining">
    <div class="btns">
      <span>新增活动</span>
      <el-button type="primary" @click="addCloseds" class="close">关闭</el-button>
    </div>
    <el-form label-width="100px" :model="mObject">
      <el-form-item label="活动名称" class="name">
        <el-select v-model="mObject.name" clearable placeholder="请选择" @change="select">
          <el-option
            v-for="item in selectTemplate.data"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 20px" @click="delClose(item)">X</span>
          </el-option>
        </el-select>
        <el-button class="model" @click="custom">自定义</el-button>
        <div class="types">
          <div class="left">
            <span class="spans">发送类型</span>
            <el-radio v-model="mObject.sendType" :label="1" :disabled="sendClick">短信</el-radio>
          </div>
        </div>
      </el-form-item>
      <div class="formulate">
        <el-form-item label="制定人" class="formulate-left">
          <el-select v-model="mObject.formulate" clearable :disabled="sendClick">
            <el-option label="店长" value="店长"></el-option>
            <el-option label="店员" value="店员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制定日期" class="formulate-center">
          <el-date-picker
            :disabled="sendClick"
            v-model="mObject.formulationOfDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item label="客户类型" class="formulate-right">
        <el-button type="info" class="all" :disabled="sendClick">全部</el-button>
        <span class="lines"></span>
        <el-checkbox-group>
          <el-checkbox v-for="(item ,index) in customType" :label="item" :key="index" :disabled="sendClick">{{item}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="客户标签" class="formulate-label">
        <el-button type="info" class="all" :disabled="sendClick">全部</el-button>
        <span class="lines"></span>
        <div class="tabs">
          <el-checkbox-group v-model="tabList" size="medium">
            <el-checkbox-button v-for="item in customLabel" :label="item" :key="item.name" :disabled="sendClick">
              {{item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <div class="mode">
        <p>1.发送方式</p>
        <div class="send">
          <span>发送频率</span>
          <el-radio v-model="mObject.frequency" :label="1" :disabled="sendClick">一次</el-radio>
        </div>
        <div class="send">
          <span>发送计划</span>
          <el-radio v-model="mObject.fastPlan" label="" :disabled="sendClick">立即发送</el-radio>
          <el-radio v-model="mObject.sendingPlan" :label="1" :disabled="sendClick">按计划发送</el-radio>
        </div>
      </div>
      <div class="mode">
        <p>2.发送内容</p>
        <div class="send">
          <span>内容模板</span>
          <span>你可以插入</span>
          <ul v-for="(item ,index) in selectTemps" :key="index" class="lists">
            <li><span>#{{item.smsTemplateName}}#</span></li>
          </ul>
        </div>
        <div class="send">
          <span>内容描述</span>
          <el-input v-model="mObject.description" type="textarea" :disabled="sendClick"></el-input>
        </div>
        <div class="send">
          <span>发送对象</span>
          <el-radio v-model="mObject.sendTheObject" :label="1" :disabled="sendClick">按查询条件发送</el-radio>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {getToken} from '@/utils/auth'
  import moment from 'moment'

  export default {
    name: "addTemplate",
    data() {
      return {
        // showing:"1",
        mObject: {
          sendType: "1",
          frequency: "1",
          sendTheObject: "1",
          sendingPlan: "1",
          name: "",
        },
        sendClick: true,
        customType: ['自主购药用户', '处方外延用户', '视频问诊用户'],
        level: "1",
        tabList:[],
      }
    },
    created() {
      this.getCustomLabel();
      this.getNameList();
      this.getSelectTemp();
    },
    computed: mapState({
      customLabel: state => state.memberMannage.customLabel,
      selectTemplate: state => state.crmHome.selectTemplate,
      selectTemps:state=>state.crmHome.selectTemp,
    }),
    methods: {
      // 客户标签
      getCustomLabel() {
        this.$store.dispatch("getCustomLabel", {params: {level: this.level}}).then(response => {
        })
      },
      // 活动名称下拉
      getNameList() {
        this.$store.dispatch("getNameList", {})
      },
      getSelectTemp(){
        this.$store.dispatch("getSelectTemp",{params:{}}).then(response=>{})
      },
      // 新增选择活动模板
      select(value) {
        this.$emit('select', value)
        this.mObject.name = "";
      },
      addCloseds() {
        this.$emit('close');
        this.mObject.name = "";
      },
      custom() {
        this.$emit('custom')
      },
      delClose(item){
        this.$emit('delClose',item);
        this.mObject={};
      },
    }
  }
</script>

<style lang="scss" scoped>
  .maining {
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
        height: 37px;
        margin: 2px 20px 0px 0px;
      }
    }
    .name {
      width: 100%;
      margin-top: 10px;
      position: relative;
      .model {
        margin: 0 20px;
        width:10%;
      }
      .types {
        width:30%;
        position: absolute;
        top: 0%;
        left: 38%;
        .left {
          .spans {
            margin-right: 20px;
            color: #606266;
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
      /deep/ .el-icon-arrow-up:before{
        content:"";
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
      .tabs {
        /deep/ .el-checkbox-button--medium .el-checkbox-button__inner {
          padding: 10px 5px;
        }
        /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
          color: #fff;
          background-color: #409EFF;
        }
        .tags{
          width:100%;
          height:30px;
          position:relative;
          margin-top:10px;
          .tagChild{
            position:absolute;
            width:100%;
            left:13%;
            /deep/ .el-tag:hover{
              color:#409EFF;
            }
          }
        }
      }
    }
    .formulate-select {
      margin-bottom: 0px;
      /deep/ .el-icon-close:before {
        content: "\E60F";
      }
      /deep/ .el-tag--info {
        margin-left: 5px;
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
    /deep/ .el-tabs--card > .el-tabs__header {
      border: none;
      margin-left: 100px;
    }
    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border-bottom: 1px solid #ccc;
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
      border: 1px solid #e4e7ed;
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
        width: 50%;
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
          /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 280px;
          }
        }
        /deep/ .el-form-item__label {
          text-align: left;
        }
      }
    }
  }
</style>
