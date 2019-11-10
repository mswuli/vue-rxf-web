<template>
  <el-container>
    <el-main class="main" v-show="showing=='1'">
      <div class="main-top">
        <div class="main-up">
          <span class="sales">快速查询</span>
        </div>
        <el-form label-width="50px" class="forms">
          <div>
            <el-form-item label="查找">
              <el-select v-model="param.searchCondition.status" clearable placeholder="状态">
                <el-option
                  v-for="item in state"
                  :key="item.label"
                  :label="item.name"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-select v-model="param.searchCondition.source" clearable placeholder="来源">
                <el-option label="营销计划" value="营销计划"></el-option>
                <el-option label="购药提醒" value="购药提醒"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-select v-model="param.searchCondition.name" clearable placeholder="活动名称">
                <el-option
                  v-for="item in nameList.data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="制定日期从" label-width="100px">
              <el-date-picker
                v-model="payDate"
                type="daterange"
                range-separator="至"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日">
              </el-date-picker>
            </el-form-item>
          </div>
          <el-form-item label="" class="buttons">
            <el-button type="primary" @click="search">搜索</el-button>
            <el-button type="danger" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-down">
        <div class="down-up">
          <div class="left"><span>活动列表</span></div>
          <div class="right">
            <el-button @click="fresh" class="fresh">刷新</el-button>
            <el-button @click="add">新增</el-button>
          </div>
        </div>
        <el-table
          :data="marketList.data"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="活动名称"
          >
          </el-table-column>
          <el-table-column
            prop="sendType"
            label="发送类型"
          >
          </el-table-column>
          <el-table-column
            prop="source"
            label="来源"
          >
          </el-table-column>
          <el-table-column
            prop="formulator"
            label="制定人"
          >
          </el-table-column>
          <el-table-column
            prop="formulationOfDate"
            label="制定日期"
            width="100"
          >
            <template slot-scope="scope">
              {{scope.row.formulationOfDate | dateFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="活动内容"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="sendingTime"
            label="发送日期和时间"
            width="150"
          >
            <template slot-scope="scope">
              {{scope.row.calendarDate+'-'+scope.row.sendingTime}}
            </template>
          </el-table-column>
          <el-table-column
            prop="beginDate"
            label="开始日期"
            width="100"
          >
            <template slot-scope="scope">
              {{scope.row.beginDate | dateFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="截止日期"
            width="100"
          >
            <template slot-scope="scope">
              {{scope.row.endDate | dateFilter}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sendersOfNumber"
            label="发送人数"
          >
          </el-table-column>
          <el-table-column
            prop="statusCN"
            label="状态"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="90">
            <template slot-scope="scope">
              <el-button @click="listDetail(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small" @click="deleted(scope.row)"
                         v-show="scope.row.statusCN !== '已完成' && scope.row.statusCN !== '作废'">作废
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="param.page" :page-sizes="[10,20,30,50]"
                         :page-size="param.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="marketList.total">
          </el-pagination>
        </div>
      </div>
    </el-main>
    <el-main class="maining" v-show="showing =='2'">
      <add-template @select='select' @close="addCloseds" @custom="custom" @delClose="delClose"></add-template>
    </el-main>
    <el-main class="mains" v-show="showing=='3'">
      <adds-template @out="out" @fastSend="fastSend" @planSend="planSend" :queryTypeList="queryTypeList"
                     :queryLabelList="queryLabelList">
      </adds-template>
    </el-main>
    <el-main class="custom" v-show="showing=='4'">
      <div class="btns">
        <span>自定义</span>
        <el-button @click="closed" class="close">关闭</el-button>
        <el-button @click="saving" class="close">存为活动模板</el-button>
      </div>
      <div class="banner">
        <el-form :model="marking" label-width="100px" ref="marking">
          <el-form-item label="活动名称" class="name">
            <el-input v-model="marking.name" placeholder="请输入内容" class="con"></el-input>
            <el-button @click="selectTemp">选择模板</el-button>
            <div class="types">
              <div class="left">
                <span class="spans">发送类型</span>
                <el-radio v-model="marking.sendType" label="短信">短信</el-radio>
              </div>
            </div>
            <div class="active">
              <div class="left">
                <span class="spans">活动类型</span>
                <el-radio v-model="marking.typeOfActivity" label="0" @change="typeOfActivity">常规活动</el-radio>
                <el-radio v-model="marking.typeOfActivity" label="1" @change="typeOfActivity">生日关怀</el-radio>
              </div>
            </div>
          </el-form-item>
          <div class="formulate">
            <el-form-item label="制定人" class="formulate-left">
              <el-select v-model="marking.formulator" placeholder="请选择" :disabled="true">
                <el-option value="店长" label="店长"></el-option>
                <el-option value="店员" label="店员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="制定日期" class="formulate-center">
              <el-date-picker :disabled="true"
                              v-model="payDating"
                              type="date"
                              value-format="yyyy-MM-DD"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <el-form-item label="客户类型：" class="customerType">
            <el-button type="info" @click="allTypes" class="all" id="allTypes">全部</el-button>
            <span class="lines"></span>
            <el-checkbox-group v-model="listss" @change="selectTypes">
              <el-checkbox v-for="(item ,index) in customTypes" :label="item" :key="index">{{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="客户标签：" class="customerLabel">
            <el-button type="info" @click="allLabels" class="all" id="allLabels">全部</el-button>
            <span class="lines"></span>
            <div class="tabs">
              <el-checkbox-group v-model="customTabList" size="medium">
                <el-checkbox-button v-for="item in customLabel" :label="item" :key="item.name" @click.native="selectLabels(item)" id="checkBox">
                  {{item.name}}
                </el-checkbox-button>
              </el-checkbox-group>
              <div class="tags">
                <div class="tagChild">
                  <el-tag
                    v-show="tagss"
                    @click.native="addTags(tag)"
                    v-for="(tag,i) in tagList"
                    :key="i"
                    type="info"
                    class="addTag"
                  >
                    {{tag.name}}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="您已选择：" v-show="!(typeList.length === 0 &&　labelList.length === 0)">
            <div class="customer">
              <span class="customers">客户类型：</span>
              <el-tag
                @close="delTypes(tag)"
                v-for="(tag,i) in typeList"
                :key="i"
                closable
                type="info">
                {{tag.name}}
              </el-tag>
            </div>
            <div class="customer">
              <span class="customers">客户标签：</span>
              <el-tag
                @close="delLabels(tag)"
                v-for="(tag, i) in labelList"
                :key="i"
                closable
                type="info">
                {{tag.name}}
              </el-tag>
            </div>
          </el-form-item>
          <div class="mode">
            <p>1.发送方式</p>
            <div class="send">
              <span>发送频率</span>
              <el-radio v-model="marking.frequency" label="1">一次</el-radio>
            </div>
            <div class="send">
              <span>发送计划</span>
              <el-radio v-model="marking.sendingPlan" label="0">立即发送</el-radio>
              <el-radio v-model="marking.sendingPlan" label="1">按计划发送</el-radio>
            </div>
            <div class="starts">
              <el-form-item label="月份：" label-width="70px" v-show="marking.typeOfActivity == '1'">
                <el-radio v-model="marking.month" :label="item.label" v-for="(item ,index) in months" :key="index"
                          @change="selMonth">
                  {{item.name}}
                </el-radio>
              </el-form-item>
              <el-form-item label="发送日期" label-width="70px" class="sendTime"
                            v-show="marking.sendingPlan == '1' && marking.typeOfActivity == '1' || marking.sendingPlan == '1' && marking.typeOfActivity == '0' ">
                <el-date-picker
                  type="date"
                  v-model="marking.calendarDate"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="发送时间" label-width="70px" class="sends"
                            v-show="marking.sendingPlan == '1' && marking.typeOfActivity == '1' || marking.sendingPlan == '1' && marking.typeOfActivity == '0' ">
                <el-time-picker
                  v-model="marking.sendingTime"
                  :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59',
                  format:'HH:mm:ss'
                  }"
                  value-format="HH:mm:ss"
                  placeholder="任意时间点">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="活动开始日期至结束日期" label-width="180px" class="start">
                <el-date-picker
                  v-model="payTimeEnd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="mode">
            <p>2.发送内容</p>
            <div class="send">
              <span>内容模板</span>
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane
                  :key="item.id"
                  v-for="(item, index) in selectTemps"
                  :label="item.smsTemplateName"
                  :name="item.smsCode"
                >
                  <div class="divs" style="color:#606266;font-size:14px;height:30px" id="customs"></div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="send">
              <span>发送对象</span>
              <el-radio v-model="marking.sendTheObject" label="1">按查询条件发送</el-radio>
            </div>
          </div>
        </el-form>
      </div>
    </el-main>
    <el-main class="newAdd" v-show="showing =='5'">
      <div class="btns">
        <span>新增活动</span>
        <el-button type="primary" @click="addsCloseds" class="close">关闭</el-button>
        <el-button @click="editAdd" class="close">修改</el-button>
      </div>
      <el-form label-width="100px" :model="form">
        <el-form-item label="活动名称" class="name">
          <el-select v-model="form.name" clearable placeholder="请选择" @change="select">
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
              <el-radio v-model="form.sendType" label="短信" :disabled="readonly">短信</el-radio>
            </div>
          </div>
        </el-form-item>
        <div class="formulate">
          <el-form-item label="制定人" class="formulate-left">
            <el-select v-model="form.formulator" clearable :disabled="readonly">
              <el-option label="店长" value="店长"></el-option>
              <el-option label="店员" value="店员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="制定日期" class="formulate-center">
            <el-input v-model="form.dating" :disabled="readonly"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="客户类型" class="customerType" >
          <el-button type="info" class="all" id="allType" :disabled="forbidden">全部</el-button>
          <span class="lines"></span>
          <el-checkbox-group v-model="listss">
            <el-checkbox v-for="(item ,index) in customTypes" :label="item" :key="index" :disabled="forbidden"
                         class="types">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="客户标签" class="customerLabel">
          <el-button type="info" class="all" id="allLabel" :disabled="forbidden">全部</el-button>
          <span class="lines"></span>
          <div class="tabs">
            <el-checkbox-group v-model="tabList" size="medium" disabled>
              <el-checkbox-button v-for="item in customLabel" :label="item.name" :key="item.name">
                {{item.name}}
              </el-checkbox-button>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="您已选择" v-show="!(typeList.length === 0 &&　labelList.length === 0)">
          <div class="customer">
            <span class="customers">客户类型：</span>
            <el-tag
              :disabled="readonly"
              v-for="(tag,i) in typeList"
              :key="i"
              closable
              type="info">
              {{tag.name}}
            </el-tag>
          </div>
          <div class="customer">
            <span class="customers">客户标签：</span>
            <el-tag
              :disabled="readonly"
              v-for="(tag, i) in labelList"
              :key="i"
              closable
              type="info">
              {{tag.name}}
            </el-tag>
          </div>
        </el-form-item>
        <div class="mode">
          <p>1.发送方式</p>
          <div class="send">
            <span>发送频率</span>
            <el-radio v-model="form.frequency" label="1" :disabled="readonly">一次</el-radio>
          </div>
          <div class="send">
            <span>发送计划</span>
            <el-radio v-model="form.sendingPlan" label="0" @change="fastSend" :disabled="readonly">立即发送</el-radio>
            <el-radio v-model="form.sendingPlan" label="1" @change="planSend" :disabled="readonly">按计划发送</el-radio>
          </div>
          <div class="starts">
            <el-form-item label="月份：" v-show="showMonth" label-width="70px">
              <el-radio v-model="form.month" :label="item.label" v-for="(item ,index) in months" :key="index"
                        :disabled="readonly">
                {{item.name}}
              </el-radio>
            </el-form-item>
            <el-form-item label="发送日期" label-width="70px" class="sendTime" v-show="send">
              <el-date-picker
                :disabled="readonly"
                v-model="form.calendarDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发送时间" label-width="70px" class="sends" v-show="send">
              <el-time-select
                :disabled="readonly"
                placeholder="起始时间"
                v-model="form.sendingTime">
              </el-time-select>
            </el-form-item>
            <el-form-item label="活动开始日期至结束日期" label-width="180px" class="start" v-show="sending">
              <el-date-picker
                :disabled="readonly"
                v-model="payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
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
          <div class="send" v-show="descript">
            <div class="divs" style="color:#606266;font-size:14px;height:30px" id="descriptions"></div>
          </div>
          <div class="send">
            <span>发送对象</span>
            <el-radio v-model="form.sendTheObject" label="1" :disabled="readonly">按查询条件发送</el-radio>
          </div>
        </div>
      </el-form>
      <div class="footer">
        <div class="footer-up">
          <div class="left"><span>客户台账</span></div>
          <div class="right">
            <el-button @click="planFresh">刷新</el-button>
            <el-button type="primary" @click="startPlan" v-show="btns">开启计划</el-button>
            <el-button type="warning" @click="startPlan" v-show="!btns">立即发送</el-button>
          </div>
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
            width="120"
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
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="patientsLabel"
            label="客户标签"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="客户电子病历"
            width="120"
          >
            <template slot-scope="scope">
              <el-button @click="eRecord(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="addListDetail(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="listHandleSizeChange" @current-change="listHandleCurrentChange"
                         :current-page="param.page" :page-sizes="[10,20,30, 50]"
                         :page-size="param.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="memberList.total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        class="send"
        :visible.sync="sendDialogVisible"
        width="30%"
        :close-on-click-modal=false>
        <span>当前总计<span>{{memberList.total}}</span>条，请确认后一键发送短信</span>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="customerMust" class="buttons">确 定</el-button>
          <el-button @click="sendDialogVisible = false" class="buttons">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        class="epr"
        title=""
        :visible.sync="edialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">电子病历</span>
          <el-button @click="eClosed" class="close">关闭</el-button>
        </div>
        <div class="history">
          <p>病历</p>
          <div class="cont">
            <div class="cont-up">
              <span class="hospital">日期：<span>{{record.patientName}}</span></span>
              <span class="hospital">医院：<span>{{record.sexName}}</span></span>
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
        :visible.sync="picDialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">电子病历</span>
          <el-button @click="picClosed" class="close">关闭</el-button>
        </div>
        <div class="history">
          <img src="../../../assets/profile.png" alt="电子病历图片">
        </div>
      </el-dialog>
      <el-dialog
        class="sending"
        title=""
        :visible.sync="queryDialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">查看详情</span>
          <div class="close">
            <el-button @click="queryDialogVisible = false">关闭</el-button>
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
    </el-main>
    <el-main class="editAdd" v-show="showing =='6'">
      <div class="btns">
        <span>修改模板</span>
        <el-button type="primary" @click="addsClosedss" class="close">取消</el-button>
        <el-button @click="editSave" class="close">保存</el-button>
      </div>
      <el-form label-width="100px" :model="form">
        <el-form-item label="活动名称" class="name">
          <el-input v-model="form.name" class="naming"></el-input>
          <el-button class="model" @click="custom">自定义</el-button>
          <div class="types">
            <div class="left">
              <span class="spans">发送类型</span>
              <el-radio v-model="form.sendType" label="短信">短信</el-radio>
            </div>
          </div>
        </el-form-item>
        <div class="formulate">
          <el-form-item label="制定人" class="formulate-left">
            <el-select v-model="form.formulator" clearable :disabled="true">
              <el-option label="店长" value="店长"></el-option>
              <el-option label="店员" value="店员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="制定日期" class="formulate-center">
            <el-date-picker :disabled="true"
                            v-model="form.formulationOfDate"
                            type="date"
                            placeholder="制定日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="客户类型：" class="customerType">
          <el-button type="info" @click="allType" class="all" id="editAllType">全部</el-button>
          <span class="lines"></span>
          <el-checkbox-group v-model="listss" @change="selectType">
            <el-checkbox v-for="(item ,index) in customTypes" :label="item" :key="index">{{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="客户标签：" class="customerLabel">
          <el-button type="info" @click="allLabel" class="all" id="editAllLabel">全部</el-button>
          <span class="lines"></span>
          <div class="tabs">
            <el-checkbox-group v-model="editTabList" size="medium">
              <el-checkbox-button v-for="item in customLabel" :label="item" :key="item.name" @click.native="selectLabel(item)">
                {{item.name}}
              </el-checkbox-button>
            </el-checkbox-group>
            <div class="tags">
              <div class="tagChild">
                <el-tag
                  v-show="tagss"
                  @click.native="addTag(tag)"
                  v-for="(tag,i) in tagList"
                  :key="i"
                  type="info"
                  class="addTag"
                >
                  {{tag.name}}
                </el-tag>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="您已选择：" v-show="!(typeList.length === 0 &&　labelList.length === 0)">
          <div class="customer">
            <span class="customers">客户类型：</span>
            <el-tag
              @close="delType(tag)"
              v-for="(tag,i) in typeList"
              :key="i"
              closable
              type="info">
              {{tag.name}}
            </el-tag>
          </div>
          <div class="customer">
            <span class="customers">客户标签：</span>
            <el-tag
              @close="delLabel(tag)"
              v-for="(tag, i) in labelList"
              :key="i"
              closable
              type="info">
              {{tag.name}}
            </el-tag>
          </div>
        </el-form-item>
        <div class="mode">
          <p>1.发送方式</p>
          <div class="send">
            <span>发送频率</span>
            <el-radio v-model="form.frequency" label="1">一次</el-radio>
          </div>
          <div class="send">
            <span>发送计划</span>
            <el-radio v-model="form.sendingPlan" label="0" @change="fastSend">立即发送</el-radio>
            <el-radio v-model="form.sendingPlan" label="1" @change="planSend">按计划发送</el-radio>
          </div>
          <div class="starts">
            <el-form-item label="月份：" v-show="showMonth" label-width="70px">
              <el-radio v-model="form.month" :label="item.label" v-for="(item ,index) in months" :key="index"
                        @change="selectMonth">
                {{item.name}}
              </el-radio>
            </el-form-item>
            <el-form-item label="发送日期" label-width="70px" class="sendTime" v-show="send">
              <el-date-picker
                v-model="form.calendarDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发送时间" label-width="70px" class="sends" v-show="send">
              <el-time-picker
                v-model="form.sendingTime"
                :picker-options="{
                 selectableRange: '00:00:00 - 23:59:59',
                 format:'HH:mm:ss'
                }"
                value-format="HH:mm:ss"
                placeholder="发送时间">
              </el-time-picker>
            </el-form-item>
            <el-form-item label="活动开始日期至结束日期" label-width="180px" class="start" v-show="sending">
              <el-date-picker
                v-model="payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
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
            <!--<span>内容描述</span>-->
            <div class="divs" style="color:#606266;font-size:14px;height:30px" id="description"></div>
          </div>
          <div class="send">
            <span>发送对象</span>
            <el-radio v-model="form.sendTheObject" label="1">按查询条件发送</el-radio>
          </div>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
  import { mapState } from 'vuex'
  import { getToken } from '@/utils/auth'
  import moment from 'moment'
  import addTemplate from './addTmplate'
  import addsTemplate from './addsTemplate'

  export default {
    components: { addTemplate, addsTemplate },
    data() {
      return {
        patientMedicinePic:"",
        currentTemplateId: '',
        activeName: null,
        tagss: true,
        showing: '1',
        send: false,
        sending: false,
        plan: false,
        fast: false,
        customType: ['自主购药用户', '处方外延用户', '视频问诊用户'],
        customTypes: [
          {
            name: '自主购药用户',
            label: '0'
          },
          {
            name: '处方外延用户',
            label: '1'
          },
          {
            name: '视频问诊用户',
            label: '2'
          }
        ],
        addDialogVisible: false,
        edialogVisible: false,
        esdialogVisible: false,
        picsDialogVisible: false,
        picDialogVisible: false,
        queryDialogVisible: false,
        querysDialogVisible: false,
        sendDialogVisible: false,
        form: {
          dated: '',
          dating: ''
        },
        param: {
          page: 1,
          limit: 10,
          searchCondition: { status: '', patientsType: '', patientsParentLabel: '', patientsChildLabel: '' }
        },
        params: {
          page: 1,
          limit: 10,
          searchCondition: { patientsType: '', patientsLabel: '', patientsParentLabel: '', patientsChildLabel: '' }
        },
        rules: {},
        marking: {
          description: '',
          calendarDate: '',
          formulationOfDate: new Date(),
          sendType: '短信',
          typeOfActivity: '0',
          frequency: '1',
          sendingPlan: '0',
          sendTheObject: '1',
          formulator: '',
          sendingTime: '',
          month: '',
          patientsParentLabel: '',
          patientsChildLabel: ''
        },
        mObject: {
          sendType: '1',
          frequency: '1',
          sendTheObject: '1',
          sendingPlan: '1',
          name: ''
        },
        tags: [],
        list: [
          { name: '店庆模板', id: '1' },
          { name: '生日模板', id: '2' }
        ],
        readonly: true,
        state: [
          {
            label: '',
            name: '全部'
          }, {
            label: '0',
            name: '未执行'
          }, {
            label: '1',
            name: '已完成'
          }, {
            label: '2',
            name: '作废'
          }
        ],
        level: '1',
        sendClick: true,
        itemList: [],
        listss: [],
        typeList: [],
        labelList: [],
        parentLabelList: [],
        childrenLabelList: [],
        edits: '',
        tells: [],
        date: new Date(),
        listing: [],
        addCustomLabel: [],
        editss: '',
        arr: {},
        months: [
          {
            name: '一月',
            label: '1'
          },
          {
            name: '二月',
            label: '2'
          },
          {
            name: '三月',
            label: '3'
          },
          {
            name: '四月',
            label: '4'
          },
          {
            name: '五月',
            label: '5'
          },
          {
            name: '六月',
            label: '6'
          },
          {
            name: '七月',
            label: '7'
          },
          {
            name: '八月',
            label: '8'
          },
          {
            name: '九月',
            label: '9'
          },
          {
            name: '十月',
            label: '10'
          },
          {
            name: '十一月',
            label: '11'
          },
          {
            name: '十二月',
            label: '12'
          }
        ],
        timeArea: '',
        forbidden: false,
        showMonth: false,
        btns: true,
        payDate: null,
        payTime: [],
        payTimeEnd: [],
        queryTypeList: [],
        queryLabelList: [],
        queryLabel: [],
        payDating: new Date(),
        tabClick: '',
        template: false,
        templateClass: '',
        selectMaps: '',
        descript: false,
        currentLabel: '',
        month: null,
        tabList:[],
        customLabels:[],
        customTabList:[],
        tagList:[],
        editTabList:[],
      }
    },
    created() {
      this.getMarketList()
      this.getNameList()
      this.getMemberList()
    },
    computed: mapState({
      marketList: state => state.marketMannage.marketList,
      detailList: state => state.marketMannage.detailList,
      memberList: state => state.memberMannage.memberList,
      record: state => state.memberMannage.electPicRecord,
      detailLists: state => state.memberMannage.detailLists,
      selectTemplate: state => state.crmHome.selectTemplate,
      detailTemplate: state => state.marketMannage.detailTemplate,
      nameList: state => state.marketMannage.nameList,
      customLabel: state => state.memberMannage.customLabel,
      selectTemps: state => state.crmHome.selectTemp
    }),
    methods: {
      // 活动列表
      getMarketList() {
        this.$store.dispatch('getMarketList', {params: this.param}).then(response => {
        })
      },
      // 活动台账列表
      getMemberList() {
        this.$store.dispatch('getMemberList', {params: this.param})
      },
      // 客户标签
      getCustomLabel() {
        this.$store.dispatch('getCustomLabel', {params: {level: this.level}}).then(response => {
        })
      },
      getSelectTemplate() {
        this.$store.dispatch('getSelectTemplate', {templateStatus: 0})
      },
      // 活动名称下拉
      getNameList() {
        this.$store.dispatch('getNameList', {})
      },
      // 搜索
      search() {
        this.param.page = 1
        this.param.searchCondition.beginDate = null
        this.param.searchCondition.endDate = null
        if (this.payDate) {
          this.param.searchCondition.beginDate =
            moment(this.payDate[0]).format('YYYY-MM-DD')
          this.param.searchCondition.endDate =
            moment(this.payDate[1]).format('YYYY-MM-DD')
        }
        // this.param.searchCondition.status = null;
        this.$store.dispatch('getMarketList', {params: this.param}).then(response => {
        })
      },
      // 重置
      reset() {
        this.param.searchCondition = {}
        this.payDate = null
        this.getMarketList()
      },
      // 刷新
      fresh() {
        this.param.searchCondition = {}
        this.payDate = null
        this.getMarketList()
      },
      // 活动列表查看详情
      listDetail(row) {
        this.$store.dispatch('getDetailList', {id: row.id}).then(res => {
          this.showing = '3'
          this.readonly = true
          if (res.data.sendingPlan === '1') {
            this.send = true
            this.sending = true
            this.btns = true
          } else {
            this.send = true
            this.sending = false
            this.btns = false
          }
          if (res.data.month === undefined || res.data.month === null) {
            this.showMonth = false
          } else {
            this.showMonth = true
          }
          this.queryTypeList = res.data.patientsTypeCN.split(',')
          let startTime = moment(res.data.beginDate).format('YYYY-MM-DD')
          let endTime = moment(res.data.endDate).format('YYYY-MM-DD')
          this.timeArea = startTime + '至' + endTime
          this.param.searchCondition.patientsType = this.queryTypeList.join(',')
          this.param.searchCondition.patientsLabel = res.data.patientsParentLabel
          this.param.searchCondition.patientsChildLabel = res.data.patientsChildLabel
          this.$store.dispatch('getQueryLabel', {params: {templateId: row.templateId}}).then(response => {
            let ee = []
            this.queryLabel = response.data
            if (this.queryLabel === undefined) {
              return false
            }
            for (let i = 0; i < this.queryLabel.length; i++) {
              ee.push(this.queryLabel[i].name)
              if (this.queryLabel[i].patientLabelTemplateVOS === undefined || this.queryLabel[i].patientLabelTemplateVOS === null) {
                continue
              }
              for (let j = 0; j < this.queryLabel[i].patientLabelTemplateVOS.length; j++) {
                ee.push(this.queryLabel[i].patientLabelTemplateVOS[j].fullName)
              }
            }
            this.queryLabelList = ee
            this.param.page = 1;
            this.param.limit = 10;
            this.param.searchCondition.patientsType = res.data.patientsTypeCN
            this.param.searchCondition.patientsParentLabel = res.data.patientsParentLabel
            this.param.searchCondition.patientsChildLabel = res.data.patientsChildLabel
            this.param.searchCondition.month = res.data.month == 0 ? null : res.data.month;
            this.param.searchCondition.tel = res.data.mobiles;
            // debugger;
            // this.getMemberList()
            this.$store.dispatch('getMemberList', {params: this.param})
          })
        })
      },
      // 活动列表删除
      deleted(row) {
        this.$confirm('此操作将永久作废, 是否继续?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('getDeleteList', {
            id: row.id, callback: (response) => {
              this.$message({
                type: 'success',
                message: response.msg,
                duration: 1 * 1000
              })
              this.getMarketList()
            }
          })
        })
      },
      // 营销管理分页
      handleSizeChange(size) {
        this.param.limit = size
        this.getMarketList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getMarketList()
      },
      // 退出查看
      out() {
        this.showing = '1'
      },
      add() {
        this.mObject = {
          sendType: '1',
          frequency: '1',
          sendTheObject: '1',
          sendingPlan: '1'
        }
        this.$store.dispatch('getSelectTemplate', {templateStatus: 0,type:1}).then(res => {
          this.showing = '2'
          this.getCustomLabel()
        })
      },
      // 删除选择活动模板
      delClose(item) {
        this.$confirm(`确定删除${item.name}的全部内容吗？, 是否继续'`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteTemplate', {
            id: item.id, callback: () => {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 3 * 1000
              })
              this.form = {}
              this.mObject = {}
              this.typeList = []
              this.labelList = []
              this.edits = ''
              this.listss = []
              this.payTime = []
              this.send = false
              this.sending = false
              this.descript = false
              this.addCustomLabel = []
              this.customLabels =[];
              this.childrenLabelList=[]
              this.tabList = [];
              let aa = document.getElementById("allType")
              aa.style.color = "#ffffff";
              aa.style.background = "#a6a9ad";
              let bb = document.getElementById("allLabel")
              bb.style.color = "#ffffff";
              bb.style.background = "#a6a9ad";
              this.getNameList()
              this.getSelectTemplate()
              this.showing = '2'
            }
          })
        })
      },
      // 新增选择活动模板
      select(value) {
        this.month = null;
        this.currentTemplateId = value
        if (value === null || value === '') {
          this.showing = '2'
          return
        }
        this.tabList = [];
        this.edits = null
        this.listss = []
        this.typeList = []
        this.labelList = []
        this.descript = true
        this.$store.dispatch('getDetailTemplate', {id: value}).then(res => {
          this.showing = '5'
          this.forbidden = true;
          this.form = res.data
          this.form.sendingPlan = res.data.sendingPlan
          // this.form.month = res.data.month;
          this.form.dating = moment(res.data.formulationOfDate).format('YYYY-MM-DD')
          let startTime = moment(res.data.beginDate).format('YYYY-MM-DD')
          let endTime = moment(res.data.endDate).format('YYYY-MM-DD')
          this.payTime = [startTime, endTime]
          if (res.data.patientsTypeCN) {
            let patientsType = res.data.patientsTypeCN.split(',')
            let typeNum = res.data.patientsType.split(',')
            for (let i = 0; i < patientsType.length; i++) {
              for (let s = 0; s < this.customTypes.length; s++) {
                if (patientsType[i] === this.customTypes[s].name) {
                  this.listss.push(this.customTypes[s])
                }
              }
            }
          }
          if (res.data.sendingPlan == '1' ) {
            this.send = true
            this.sending = true
            this.btns = true
          } else {
            this.sending = true
            this.send = false
            this.btns = false
          }
          if (res.data.month === undefined || res.data.month === null || res.data.typeOfActivity == '0') {
            this.showMonth = false
          } else {
            this.showMonth = true
            this.form.month = res.data.month.toString();
            // this.month = res.data.month.toString()
          }
          this.$store.dispatch('getQueryLabel', {params: {templateId: value}}).then(response => {
            this.customLabels = response.data
            let ff = []
            if (this.customLabels === undefined) {
              return false
            }
            this.parentLabelList = []
            this.childrenLabelList = []
            for (let i = 0; i < this.customLabels.length; i++) {
              ff.push({name: this.customLabels[i].fullName, type: 'success', realName: this.customLabels[i].name})
              this.parentLabelList.push(this.customLabels[i].name)
              if (this.customLabels[i].patientLabelTemplateVOS === undefined || this.customLabels[i].patientLabelTemplateVOS === null) {
                continue
              }
              for (let j = 0; j < this.customLabels[i].patientLabelTemplateVOS.length; j++) {
                ff.push({
                  name: this.customLabels[i].patientLabelTemplateVOS[j].fullName,
                  type: 'success',
                  realName: this.customLabels[i].patientLabelTemplateVOS[j].name
                })
                this.childrenLabelList.push(this.customLabels[i].patientLabelTemplateVOS[j].name)
              }
            }
            this.labelList = ff;
            if (res.data.patientsType == "0,1,2") {
              this.typeList = [{name: "全部"}]
              let aa = document.getElementById("allType")
              aa.style.color = "#ffffff";
              aa.style.background = "#409EFF"
            } else {
              this.typeList = this.listss;
              let aa = document.getElementById("allType")
              aa.style.color = "#ffffff";
              aa.style.background = "#a6a9ad"
            }
            if (res.data.patientsParentLabel == "") {
              this.labelList = [{name: '全部'}];
              let aa = document.getElementById("allLabel")
              aa.style.color = "#ffffff";
              aa.style.background = "#409EFF";
              this.$store.dispatch("getCustomLabel", {params: {level: this.level}}).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                  this.tabList.push(response.data[i].name)
                }
              })
            } else {
              let cc = res.data.patientsParentLabel.split(',');
              for (let i = 0; i < cc.length; i++) {
                this.tabList.push(cc[i])
              }
              let aa = document.getElementById("allLabel")
              aa.style.color = "#ffffff";
              aa.style.background = "#a6a9ad";
            }
            // this.typeList = this.listss
            this.smsCode = res.data.smsTemplateId
            let cc = res.data.smsContent
            let bb = cc.split(',')
            this.$store.dispatch('getSelectTemp', {params: {smsCode: this.smsCode}}).then(response => {
              let StrString = response.data[0].smsContent
              let divs = document.getElementById('descriptions')
              let reg = new RegExp('XX', 'g')
              let inputs = StrString.replace(reg, "<input type='number' name='hh' value='' maxlength='3' style='width:5%;height:20px' disabled  oninput=\"if(value.length>3)value=value.slice(0,3)\">")
              divs.innerHTML = inputs
              let desc = divs.children
              for (let i = 0; i < bb.length; i++) {
                desc[i].value = bb[i]
              }
            })
            this.$nextTick(() => {
              this.params.searchCondition.patientsParentLabel = res.data.patientsParentLabel
              this.params.searchCondition.patientsChildLabel = res.data.patientsChildLabel
              this.params.searchCondition.month = this.month
              this.planFresh()
            })
          })
        })

      },
      planFresh() {
        let arra = []
        for (let i = 0; i < this.listss.length; i++) {
          arra.push(this.listss[i].name)
        }
        this.params.searchCondition.patientsType = arra.join(',')
        this.params.searchCondition.patientsLabel = this.edits
        this.$store.dispatch('getMemberList', {params: this.params})
      },
      startPlan() {
        this.sendDialogVisible = true
      },
      // 新增客户台账开启计划和立即发送
      customerMust() {
        let dated = moment(this.date).format('YYYY-MM-DD')
        let status = ''
        if (this.detailTemplate.sendingPlan == '0') {
          status = '1'
        } else {
          status = '0'
        }
        this.$store.dispatch('sendMessage', {
          data: {
            templateId: this.detailTemplate.id,
            source: '营销计划',
            sendersOfNumber: this.memberList.total,
            status: status,
            smsTemplateId: this.detailTemplate.smsTemplateId,
            description: this.memberList.data.description,
            // mobiles: "",
            formulationOfDate: this.detailTemplate.formulationOfDate,
            sendingPlan: this.detailTemplate.sendingPlan,
            calendarDate: dated,
            sendingTime: this.form.sendingTime
          }
        }).then(res => {
          this.$message({
            type: 'success',
            message: '发送成功',
            duration: 1000 * 2
          })
          this.sendDialogVisible = false
          this.showing = '1'
          this.getMarketList()
        })
      },
      eRecord(row) {
        if (row.patientsType === '自主购药用户') {
          this.$store.dispatch('getElectronicRecord', {tel: row.tel}).then(response => {
            this.picDialogVisible = true
          })
        } else {
          this.$store.dispatch('getElectRecord', {tel: row.tel}).then(response => {
            this.edialogVisible = true
          })
        }
      },
      eClosed() {
        this.edialogVisible = false
      },
      picClosed() {
        this.picDialogVisible = false
      },
      // 新增列表查看台账
      addListDetail(row) {
        this.$store.dispatch('getDetailMemberMannage', {tel: row.tel}).then(response => {
          this.queryDialogVisible = true
          this.$store.dispatch('getQueryLabel', {params: {tel: row.tel}}).then(response => {
            this.listing = response.data
            let ee = []
            if (this.listing === undefined) {
              return false
            }
            for (let i = 0; i < this.listing.length; i++) {
              ee.push(this.listing[i].name)
              if (this.listing[i].patientLabelTemplateVOS === undefined || this.listing[i].patientLabelTemplateVOS === null) {
                continue
              }
              for (let j = 0; j < this.listing[i].patientLabelTemplateVOS.length; j++) {
                ee.push(this.listing[i].patientLabelTemplateVOS[j].fullName)
              }
            }
            this.listing = ee
          })
        })
      },
      listHandleSizeChange(size) {
        this.param.limit = size
        this.getMemberList()
      },
      listHandleCurrentChange(page) {
        this.param.page = page
        this.getMemberList()
      },
      // 客户类型
      allType() {
        this.listss = []
        this.selectMaps = ''
        this.customTypes.forEach(i => {
          this.listss.push(i)
        })
        this.typeList = [{name: '全部'}]
        this.param.searchCondition.patientsType = ''
        let aa = document.getElementById("editAllType")
        aa.style.color = "#ffffff";
        aa.style.background = "#409EFF"
      },
      // 选择客户类型
      selectType(value) {
        // console.log(value, 33)
        this.selectMaps = ''
        this.typeList = []
        if (value.length == 3) {
          let aa = document.getElementById("editAllType")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF"
        } else {
          let aa = document.getElementById("editAllType")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad"
        }
        Object.assign(this.typeList, value)
      },
      selectMap(name) {
        for (let i = 0; i < this.customTypes.length; i++) {
          if (this.customTypes[i].name == name) {
            return this.customTypes[i].label
          }
        }
      },
      // 删除客户类型
      delType(tag) {
        // if (tag === '全部') {
        //   this.listss = []
        // } else {
        //   this.listss.splice(this.listss.indexOf(tag), 1)
        // }
        if (tag === '全部') {
          this.listss = [];
          let aa = document.getElementById("editAllType")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF"
        } else {
          this.listss.splice(this.listss.indexOf(tag), 1);
          let bb = document.getElementById("editAllType")
          bb.style.color = "#ffffff";
          bb.style.background = "#a6a9ad"
        }
        if (this.listss.length === 0) {
          let cc = document.getElementById("editAllType")
          cc.style.color = "#ffffff";
          cc.style.background = "#a6a9ad"
        }
        this.typeList.splice(this.typeList.indexOf(tag), 1)
      },
      // 客户标签
      allLabel() {
        this.labelList = [{name: '全部'}]
        this.edits = null
        this.tagss = false
        this.parentLabelList = []
        this.childrenLabelList = []
        let aa = document.getElementById("editAllLabel")
        aa.style.color = "#ffffff";
        aa.style.background = "#409EFF";
        for (let i = 0; i < this.customLabel.length; i++) {
          this.editTabList.push(this.customLabel[i])
        }
        this.param.searchCondition.patientsLabel = ''
        this.param.searchCondition.patientsParentLabel = ''
        this.param.searchCondition.patientsChildLabel = ''
      },
      // 选择客户标签
      selectLabel(label) {
        this.currentLabel = label.name
        this.tagss = true
        // if(this.customLabel.length == this.editTabList.length){
        //   let aa = document.getElementById("editAllLabel")
        //   aa.style.color = "#ffffff";
        //   aa.style.background = "#409EFF";
        //   this.labelList = [{name:'全部'}]
        // }else{
        //   let cc = document.getElementById("editAllType")
        //   cc.style.color = "#ffffff";
        //   cc.style.background = "#a6a9ad"
        // }
        if (this.labelList.length > 0 && this.labelList[0].name === '全部') {
          this.labelList = []
          this.parentLabelList = []
          this.childrenLabelList = []
          let aa = document.getElementById("editAllLabel")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad";
          for (let i = 0; i < this.editTabList.length; i++) {
            if (this.editTabList[i].name === label.name) {
              continue;
            } else {
              this.editTabList.splice(this.editTabList.indexOf(this.editTabList[i]), 1);
              --i;
            }
          }
          this.editTabList.push(label)
        }
        this.$store.dispatch('getCustomLabels', {params: {level: 2, parentId: label.id}}).then((response) => {
          this.tagList = response.data
        })
        for (let i = 0; i < this.labelList.length; i++) {
          if (this.labelList[i].name === label.name) {
            this.editTabList.push(label)
            return
          }
        }
        if (JSON.stringify(this.labelList) === '[{"name":"全部"}]') {
          for (let i = 0; i < this.editTabList.length; i++) {
            if (this.editTabList[i].name === label.name) {
              continue;
            } else {
              this.editTabList.splice(this.editTabList.indexOf(this.editTabList[i]), 1);
              --i;
            }
          }
          this.labelList.push({name: label.name, type: 'success', realName: label.name})
          this.parentLabelList.push(label.name)
        }else {
          this.labelList.push({ name: label.name, type: 'success',realName:label.name });
          this.parentLabelList.push(label.name);
        }
        this.param.searchCondition.patientsLabel = ''
        for (let i = 0; i < this.labelList.length; i++) {
          this.param.searchCondition.patientsLabel = this.param.searchCondition.patientsLabel + ',' + this.labelList[i]
        }
        this.param.searchCondition.patientsParentLabel = ''
        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList.length > 1 && i > 0) {
            this.param.searchCondition.patientsParentLabel = this.param.searchCondition.patientsParentLabel + ',' + this.parentLabelList[i]
          } else {
            this.param.searchCondition.patientsParentLabel = this.parentLabelList[i]
          }
        }
      // }
      },
      // 增加客户标签的子集
      addTag(tag) {
        for (let i = 0; i < this.labelList.length; i++) {
          if (this.labelList[i].name === tag.fullName) {
            return
          }
        }
        if (JSON.stringify(this.labelList) === '[{"name":"全部"}]') {
          this.labelList = []
          this.childrenLabelList = []
        } else {
          this.childrenLabelList.push(tag.name)
        }
        this.labelList.push({ name: tag.fullName, type: 'success', realName: tag.name })
        this.param.searchCondition.patientsLabel = ''
        for (let i = 0; i < this.labelList.length; i++) {
          this.param.searchCondition.patientsLabel = this.param.searchCondition.patientsLabel + ',' + this.labelList[i].name
        }

        this.param.searchCondition.patientsChildLabel = ''
        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList.length > 1 && i > 0) {
            this.param.searchCondition.patientsChildLabel = this.param.searchCondition.patientsChildLabel + ',' + this.childrenLabelList[i]
          } else {
            this.param.searchCondition.patientsChildLabel = this.childrenLabelList[i]
          }
        }
      },
      // 删除客户标签
      delLabel(tag) {
        if(tag != null && tag.name == "全部"){
          let aa = document.getElementById("editAllLabel")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad";
          this.editTabList = [];
        }
        if (this.currentLabel === tag.name) {
          this.tagss = false
        }
        //如果去掉的是父标签，则作为关联把相应的子标签也去除掉
        if (!tag.name.includes('-')) {
          for(let i=0; i<this.editTabList.length;i++){
            if(this.editTabList[i].name === tag.name){
              this.editTabList.splice(this.editTabList.indexOf(this.editTabList[i]), 1);
              --i;
            }
          }
          for (let i = 0; i < this.labelList.length; i++) {
            if (this.labelList[i].name.includes(tag.name + '-')) {
              for (let j = 0; j < this.childrenLabelList.length; j++) {
                if (this.childrenLabelList[j] == this.labelList[i].realName) {
                  this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[j]), 1)
                  break
                }
              }
              this.labelList.splice(this.labelList.indexOf(this.labelList[i]), 1)
              --i
            }
          }
        }
        this.labelList.splice(this.labelList.indexOf(tag), 1)

        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList[i] == tag.realName) {
            this.parentLabelList.splice(this.parentLabelList.indexOf(this.parentLabelList[i]), 1)
          }
        }
        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList[i] == tag.realName) {
            this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[i]), 1)
          }
        }

        this.param.searchCondition.patientsParentLabel = ''
        this.param.searchCondition.patientsChildLabel = ''

        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList.length > 1 && i > 0) {
            this.param.searchCondition.patientsParentLabel = this.param.searchCondition.patientsParentLabel + ',' + this.parentLabelList[i]
          } else {
            this.param.searchCondition.patientsParentLabel = this.parentLabelList[i]
          }
        }

        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList.length > 1 && i > 0) {
            this.param.searchCondition.patientsChildLabel = this.param.searchCondition.patientsChildLabel + ',' + this.childrenLabelList[i]
          } else {
            this.param.searchCondition.patientsChildLabel = this.childrenLabelList[i]
          }
        }

      },
      addCloseds() {
        this.showing = '1'
        this.mObject.name = ''
        this.form = {
          dated: '',
          dating: ''
        }
      },
      addsCloseds() {
        this.showing = '1'
        this.mObject.name = ''
        this.form = {
          dated: '',
          dating: ''
        }
      },
      editAdd() {
        this.currentLabel = ''
        this.showing = '6'
        for(let i=0; i<this.tabList.length;i++){
          for(let j=0; j<this.customLabel.length;j++){
            if(this.customLabel[j].name === this.tabList[i]){
              this.editTabList.push(this.customLabel[j])
              break;
            }
          }
        }
        if (this.detailTemplate.patientsType == "0,1,2") {
          this.typeList = [{name:"全部"}]
          let aa = document.getElementById("editAllType")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF"
        } else {
          this.typeList = this.listss;
          let aa = document.getElementById("editAllType")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad"
        }
        if(this.tabList.length === this.customLabel.length){
          let aa = document.getElementById("editAllLabel")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF";
        }else{
          let aa = document.getElementById("editAllLabel")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad";
        }
        let aa = this.detailTemplate.smsTemplateId
        let cc = this.detailTemplate.smsContent
        this.form.formulationOfDate = moment(new Date()).format('YYYY-MM-DD')
        let bb = cc.split(',')
        this.form.formulator = (window.localStorage.roleType == 2 ? '店长' : '店员')
        this.param.searchCondition.patientsParentLabel =   this.params.searchCondition.patientsParentLabel;
        this.param.searchCondition.patientsChildLabel = this.params.searchCondition.patientsChildLabel;
        this.$store.dispatch('getSelectTemp', { params: { smsCode: aa } }).then(response => {
          let StrString = response.data[0].smsContent
          let divs = document.getElementById('description')
          let reg = new RegExp('XX', 'g')
          let inputs = StrString.replace(reg, "<input type='number' name='hh' value='' maxlength='3' style='width:5%;height:20px' oninput=\"if(value.length>3)value=value.slice(0,3)\">")
          divs.innerHTML = inputs
          let desc = divs.children
          for (let i = 0; i < bb.length; i++) {
            desc[i].value = bb[i]
          };
        })
      },
      selectMonth(label) {
        let year = new Date().getFullYear()
        let month = new Date().getMonth() + 1
        if (label < month) {
          this.form.calendarDate = new Date(`${year + 1}-${label}-01`)
        } else {
          this.form.calendarDate = new Date(`${year}-${label}-01`)
        }
      },

      editSave() {
        let aa = document.getElementById('description')
        let els = aa.children
        let strss = ''
        for (let i = 0; i < els.length; i++) {
          if (els.length > 1 && i != els.length - 1) {
            strss += els[i].value + ','
          } else {
            strss += els[i].value
          }
        }
        this.selectMaps = ''
        for (let i = 0; i < this.listss.length; i++) {
          if (this.listss.length > 1 && i != this.listss.length - 1) {
            this.selectMaps += this.listss[i].label + ','
          } else {
            this.selectMaps += this.listss[i].label
          }
        }

        for (let i = 0; i < this.payTime.length; i++) {
          this.arr.endDate = this.payTime[1]
          this.arr.beginDate = this.payTime[0]
        }

        this.arr.patientsChildLabel = this.param.searchCondition.patientsChildLabel
        this.arr.patientsParentLabel = this.param.searchCondition.patientsParentLabel
        this.arr.endDate = moment(this.arr.endDate).format('YYYY-MM-DD')
        this.arr.beginDate = moment(this.arr.beginDate).format('YYYY-MM-DD')
        this.arr.calendarDate = moment(this.form.calendarDate).format('YYYY-MM-DD')
        this.arr.description = this.form.description
        this.arr.formulationOfDate = moment(this.form.formulationOfDate).format('YYYY-MM-DD')
        this.arr.formulator = this.form.formulator
        this.arr.frequency = this.form.frequency
        this.arr.id = this.form.id
        this.arr.month = this.form.month
        this.arr.name = this.form.name
        // this.arr.patientsChildLabel = this.form.patientsChildLabel;
        // this.arr.patientsParentLabel = this.form.patientsParentLabel;
        // this.arr.patientsChildLabel = this.form.patientsChildLabel;
        // this.arr.patientsParentLabel = this.form.patientsParentLabel;
        this.arr.pharmacyId = this.form.pharmacyId
        this.arr.sendTheObject = this.form.sendTheObject
        this.arr.sendType = this.form.sendType
        this.arr.sendingPlan = this.form.sendingPlan
        this.arr.sendingTime = this.form.sendingTime
        this.arr.smsTemplateId = this.form.smsTemplateId
        this.arr.templateStatus = this.form.templateStatus
        this.arr.typeOfActivity = this.form.typeOfActivity
        this.arr.patientsType = this.selectMaps
        this.arr.smsContent = strss
        this.$store.dispatch('getEditTemplate', this.arr).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000 * 2
          })
          this.currentTemplateId = ''
          this.select(res.data.id)
        })
      },
      save() {
        this.addDialogVisible = false
      },
      fastSend() {
        this.fast = true
        this.plan = false
      },
      planSend() {
        this.plan = true
        this.fast = false
      },
      // 自定义
      custom() {
        this.activeName = null
        this.marking.name = ''
        this.marking.formulator = ''
        this.marking.calendarDate = ''
        this.marking.sendingTime = null
        this.marking.typeOfActivity = '0'
        this.marking.sendingPlan = '0'
        this.marking.month = ''
        this.payTimeEnd = []
        this.showMonth = false
        this.plan = false
        this.fast = false
        this.listss = []
        this.edits = null
        this.labelList = []
        this.typeList = []
        this.showing = '4'
        this.parentLabelList = []
        this.childrenLabelList = []
        this.currentLabel = ''
        this.marking.formulator = (window.localStorage.roleType == 2 ? '店长' : '店员')
        this.$store.dispatch('getSelectTemp', { params: {} }).then(response => {

          let StrString = ''
          for (let i = 0; i < response.data.length; i++) {
            StrString = response.data[i].smsContent
            let divs = document.getElementById('pane-' + response.data[i].smsCode).firstChild
            let reg = new RegExp('XX', 'g')
            let inputs = StrString.replace(reg, "<input type='number' name='hh' value='' maxlength='3' style='width:5%;height:20px'  oninput=\"if(value.length>3)value=value.slice(0,3)\">")
            divs.innerHTML = inputs
          }
        })
      },
      selMonth(label) {
        let years = new Date().getFullYear()
        let month = new Date().getMonth() + 1
        if (label < month) {
          this.marking.calendarDate = new Date(`${years + 1}-${label}-01`)
        } else {
          this.marking.calendarDate = new Date(`${years}-${label}-01`)
        }
      },
      closed() {
        this.typeList = []
        this.labelList = []
        this.plan = false
        this.fast = false
        this.showing = '2'
      },
      selectTemp() {
        this.showing = '5'
        this.payTime = []
      },
      handleClick(tab, event) {
        this.templateClass = tab.name
      },
      // 通过判断活动进行月份展示
      typeOfActivity(label){
        // console.log(label,1)
        if(label == 0){
          // this.marking.typeOfActivity = null;
          this.marking.month = null;
        }
      },
      saving() {
        if (this.marking.name == '' || this.marking.formulator == '' || this.edits == '' || this.marking.calendarDat == '' || this.marking.sendingTime == '' || this.marking.sendingPlan == '' || (this.marking.typeOfActivity == '1'&& (this.marking.month ==null || this.marking.month ==""))) {
          return this.$message({
            type: 'error',
            message: '信息选择不完全，请选择完全',
            duration: 1000 * 2
          })
        }
        let aa = document.getElementById('pane-' + this.templateClass).firstChild
        let els = aa.children
        let strss = ''
        for (let i = 0; i < els.length; i++) {
          if (els.length > 1 && i != els.length - 1) {
            strss += els[i].value + ','
          } else {
            strss += els[i].value
          }
        }
        let aType = ''
        for (let i = 0; i < this.listss.length; i++) {
          if (this.listss.length > 1 && i != this.listss.length - 1) {
            aType += this.listss[i].label + ','
          } else {
            aType += this.listss[i].label
          }
        }

        // console.log(aType,33)
        if (this.marking.typeOfActivity == '1') {
          if (this.marking.sendingPlan == '1') {
            this.marking.calendarDate = moment(this.marking.calendarDate).format('YYYY-MM-DD')
          } else {
            this.marking.calendarDate = moment(new Date()).format('YYYY-MM-DD')
            this.marking.sendingTime = moment(new Date()).format('HH:mm:ss')
          }
          this.marking.smsContent = strss
          this.marking.description = this.selectTypes.description
          // this.marking.calendarDate = moment(this.marking.calendarDate).format("YYYY-MM-DD");
          this.marking.formulator = this.marking.formulator
          this.marking.formulationOfDate = moment(this.payDating).format('YYYY-MM-DD')
          this.marking.patientsType = aType
          this.marking.beginDate = moment(this.payTimeEnd[0]).format('YYYY-MM-DD')
          this.marking.endDate = moment(this.payTimeEnd[1]).format('YYYY-MM-DD')
          this.marking.templateStatus = '0'
          this.marking.smsTemplateId = this.templateClass
          this.$store.dispatch('customTemplate', { data: this.marking }
          ).then(res => {
            this.$message({
              type: 'success',
              message: '新增成功',
              duration: 1000 * 2
            })
            this.labelList = []
            this.typeList = []
            this.tagList = [];
            this.customTabList=[]
            this.showing = '2'
            this.getSelectTemplate()
          })
        } else {
          if (this.marking.sendingPlan == '1') {
            this.marking.calendarDate = moment(this.marking.calendarDate).format('YYYY-MM-DD')
          } else {
            this.marking.calendarDate = moment(new Date()).format('YYYY-MM-DD')
            this.marking.sendingTime = moment(new Date()).format('HH:mm:ss')
          }
          this.marking.smsContent = strss
          this.marking.description = this.selectTypes.description
          // this.marking.calendarDate = moment(new Date()).format("YYYY-MM-DD");
          // this.marking.sendingTime =  moment(new Date()).format("HH:mm:ss");
          this.marking.formulator = this.marking.formulator
          this.marking.formulationOfDate = moment(this.payDating).format('YYYY-MM-DD')
          this.marking.patientsType = aType
          this.marking.beginDate = moment(this.payTimeEnd[0]).format('YYYY-MM-DD')
          this.marking.endDate = moment(this.payTimeEnd[1]).format('YYYY-MM-DD')
          this.marking.templateStatus = '0'
          this.marking.smsTemplateId = this.templateClass
          this.$store.dispatch('customTemplate', { data: this.marking }
          ).then(res => {
            this.$message({
              type: 'success',
              message: '新增成功',
              duration: 1000 * 2
            })
            this.labelList = []
            this.typeList = []
            this.tagList = [];
            this.customTabList=[]
            this.showing = '2'
            this.getSelectTemplate()
          })
        }
      },
      addsClosedss() {
        this.select(this.currentTemplateId)
      },
      // 自定义数据
      // 删除客户类型s
      delTypes(tag) {
        if (tag.name === '全部'){
          this.listss =[];
          let aa = document.getElementById("allTypes")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF"
        }else
        {
          this.listss.splice(this.listss.indexOf(tag.name), 1);
          let bb = document.getElementById("allTypes")
          bb.style.color = "#ffffff";
          bb.style.background = "#a6a9ad"
        }
        if(this.listss.length === 0) {
          let cc = document.getElementById("allTypes")
          cc.style.color = "#ffffff";
          cc.style.background = "#a6a9ad"
        }
        this.typeList.splice(this.typeList.indexOf(tag.name), 1)
      },
      // 客户标签
      allLabels() {
        this.labelList = [{ name: '全部' }]
        this.tagss = false
        let aa = document.getElementById("allLabels")
        aa.style.color = "#ffffff";
        aa.style.background = "#409EFF";
        for(let i=0; i<this.customLabel.length;i++){
          this.customTabList.push(this.customLabel[i])
        }
        this.param.searchCondition.patientsLabel = ''
        this.childrenLabelList = []
        this.parentLabelList = []
        this.param.searchCondition.patientsParentLabel = ''
        this.param.searchCondition.patientsChildLabel = ''
      },
      // 选择客户标签
      selectLabels(label) {
        this.currentLabel = label.name;
        this.tagss = true
        this.show = true
        this.$store.dispatch('getCustomLabels', { params: { level: 2, parentId: label.id } }).then((response) => {
          this.tagList = response.data;
        })
        for (let i = 0; i < this.labelList.length; i++) {
          if (this.labelList[i].name === label.name) {
            this.customTabList.push(label)
            return
          }
        }
        if (JSON.stringify(this.labelList) === '[{"name":"全部"}]') {
          let aa = document.getElementById("allLabels")
          aa.style.color = "#ffffff";
          aa.style.background = "#909399";
          for(let i=0; i<this.customTabList.length;i++){
            if(this.customTabList[i].name === label.name){
              continue;
            }else{
              this.customTabList.splice(this.customTabList.indexOf(this.customTabList[i]), 1);
              --i;
            }
          }
          this.labelList = []
          this.parentLabelList = []
          this.childrenLabelList = []
        }
        this.labelList.push({ name: label.name, type: 'success', realName: label.name })
        this.parentLabelList.push(label.name)
        this.marking.patientsParentLabel = ''
        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList.length > 1 && i > 0) {
            this.marking.patientsParentLabel = this.marking.patientsParentLabel + ',' + this.parentLabelList[i]
          } else {
            this.marking.patientsParentLabel = this.parentLabelList[i]
          }
        }
      },
      // 增加客户标签的子集
      addTags(tag) {
        for (let i = 0; i < this.labelList.length; i++) {
          if (this.labelList[i].name === tag.fullName) {
            return
          }
        }
        if (JSON.stringify(this.labelList) === '[{"name":"全部"}]') {
          this.labelList = []
          this.childrenLabelList = []
        } else {
          this.childrenLabelList.push(tag.name)
        }
        this.labelList.push({ name: tag.fullName, type: 'success', realName: tag.name })
        this.marking.patientsChildLabel = ''
        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList.length > 1 && i > 0) {
            this.marking.patientsChildLabel = this.marking.patientsChildLabel + ',' + this.childrenLabelList[i]
          } else {
            this.marking.patientsChildLabel = this.childrenLabelList[i]
          }
        }
      },

      // 删除客户标签
      delLabels(tag) {
        if(tag != null && tag.name == "全部"){
          let aa = document.getElementById("allLabels")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad";
          this.customTabList = [];
        }
        if (this.currentLabel === tag.name) {
          for(let i=0; i<this.tagList.length;i++){
            this.tagList.splice(this.tagList.indexOf(this.tagList[i]), 1);
            --i;
          }
          this.tagss = false
        }
        //如果去掉的是父标签，则作为关联把相应的子标签也去除掉
        if (!tag.name.includes('-')) {
          for(let i=0; i<this.customTabList.length;i++){
            if(this.customTabList[i].name === tag.name){
              this.customTabList.splice(this.customTabList.indexOf(this.customTabList[i]), 1);
              --i;
            }
          }
          for (let i = 0; i < this.labelList.length; i++) {
            if (this.labelList[i].name.includes(tag.name + '-')) {
              for (let j = 0; j < this.childrenLabelList.length; j++) {
                if (this.childrenLabelList[j] == this.labelList[i].realName) {
                  this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[j]), 1)
                  break
                }
              }
              this.labelList.splice(this.labelList.indexOf(this.labelList[i]), 1);
              --i
            }
          }
        }
        this.labelList.splice(this.labelList.indexOf(tag), 1);
        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList[i] == tag.realName) {
            this.parentLabelList.splice(this.parentLabelList.indexOf(this.parentLabelList[i]), 1)
          }
        }
        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList[i] == tag.realName) {
            this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[i]), 1)
          }
        }
        this.marking.patientsParentLabel = ''
        this.marking.patientsChildLabel = ''
        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList.length > 1 && i > 0) {
            this.marking.patientsParentLabel = this.marking.patientsParentLabel + ',' + this.parentLabelList[i]
          } else {
            this.marking.patientsParentLabel = this.parentLabelList[i]
          }
        }
        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList.length > 1 && i > 0) {
            this.marking.patientsChildLabel = this.marking.patientsChildLabel + ',' + this.childrenLabelList[i]
          } else {
            this.marking.patientsChildLabel = this.childrenLabelList[i]
          }
        }
      },
      // 客户类型
      allTypes() {
        this.listss = this.customTypes
        this.typeList = [{ name: '全部' }]
        this.marking.patientsType = ''
        let aa = document.getElementById("allTypes")
        aa.style.color = "#ffffff";
        aa.style.background = "#409EFF"
      },
      // 选择客户类型
      selectTypes(value) {
        // console.log(value)
        this.typeList = []
        if(value.length == 3) {
          let aa = document.getElementById("allTypes")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF"
        }else{
          let aa = document.getElementById("allTypes")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad"
        }
        Object.assign(this.typeList, value)
        this.marking.patientsType = this.typeList.join(',')
        // console.log(this.typeList)
      }
    }
  }
</script>

<style lang="scss" scoped>


  /*@import "./index.scss";*/
  .main {
    width: 100%;

    .main-top {
      width: 100%;

      .main-up {
        width: 100%;
        height: 40px;
        position: relative;
        background-color: #ccc;

        .sales {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
          position: absolute;
          top: 25%;
          left: 1%;
        }
      }

      .forms {
        /deep/ .el-input {
          width: 100%;
        }

        /deep/ .el-form-item {
          width: 17%;
          margin-top: 15px;
          display: inline-block;
          margin-bottom: 10px;
        }

        /deep/ .el-date-editor .el-range-separator {
          width: 10%;
        }

        .buttons {
          width: 100%;
        }
      }
    }

    .main-down {
      width: 100%;

      .down-up {
        width: 100%;
        height: 40px;
        border: 1px solid #ccc;
        background: #ccc;

        .left {
          float: left;

          span {
            display: block;
            line-height: 40px;
            margin-left: 15px;
            font-weight: bold;

          }
        }

        .right {
          float: right;
          margin-right: 10px;
          line-height: 35px;

          .fresh {
            color: #606266 !important;
          }

          /deep/ .el-button {
            height: 36px;
            color: #409EFF;
          }
        }
      }
    }
  }

  .newAdd {
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
      }
    }
    .name {
      width: 100%;
      margin-top: 10px;
      position: relative;
      .model {
        margin: 0 20px;
      }
      .types {
        position: absolute;
        top: 0%;
        left: 36%;
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
      /deep/ .el-tag {
        height: 40px;
        line-height: 40px;
        margin-left: 5px;
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
    .customerType {
      width: 100%;
      .types {
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #409EFF;
          border-color: #409EFF;
        }
        /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
          border-color: #fff;
        }
      }
    }
    .customerLabel {
      width: 100%;
      .tabs {
        /deep/ .el-checkbox-button--medium .el-checkbox-button__inner {
          padding: 10px 5px;
        }
        /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
          color: #fff;
          background-color: #409EFF;
        }
      }
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

    /deep/ .el-tabs--card > .el-tabs__header {
      border: none;
      margin-left: 100px;
    }

    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border-bottom: 1px solid #e4e7ed;
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
        /deep/ input::-webkit-outer-spin-button,
        /deep/ input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
        /deep/ input[type="number"] {
          -moz-appearance: textfield;
        }
      }

      .desc {
        width: 400px;
        height: 60px;
        background-color: pink;
      }

      .starts {
        width: 100%;
        height: 100%;
        /deep/ .el-radio__label{
          padding-left:0px;
        }
        /deep/ .el-date-editor .el-range-input {
          width: 100%;
        }

        /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
          width: 160px;
        }

        /deep/ .el-date-editor .el-range-separator {
          width: 10%;
        }

        /deep/ .el-radio + .el-radio {
          margin-left: 28px;
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
          /*width:390px;*/
          /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 280px;
          }
        }

        /deep/ .el-form-item__label {
          text-align: left;
        }
      }
    }

    .footer {
      width: 100%;
      float: left;
      margin-top: 20px;

      .footer-up {
        background: #ccc;
        height: 40px;

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
        }
      }
    }
  }

  .custom {
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
          width: 40%;
        }

        .con {
          width: 40%;
        }

        .types {
          position: absolute;
          top: 0%;
          left: 54%;

          .left {
            .spans {
              margin-right: 20px;
            }
          }
        }

        .active {
          position: absolute;
          width: 38%;
          top: 0%;
          left: 73%;

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
          /deep/ input::-webkit-outer-spin-button,
          /deep/ input::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }
          /deep/ input[type="number"] {
            -moz-appearance: textfield;
          }
          .contentdesc {
            float: left;
          }
          .desc {
            width: 400px;
            height: 60px;
            float: left;
            border: 1px solid #ccc;
          }
          .templates {
            /deep/ .el-input {
              width: 10%;
            }
            /deep/ .el-input__inner {
              /*width:10%;*/
              float: left;
            }
            .temp1 {
              width: 35%;
            }

            .temp2 {
              width: 8%;

              /deep/ .el-textarea__inner {
                line-height: 13px;
              }
            }

            .temp3 {
              width: 12%;
            }

            .temp4 {
              width: 7%;

              /deep/ .el-textarea__inner {
                line-height: 13px;
              }
            }
          }

          .templatess {
            /deep/ .el-input {
              width: 10%;
            }

            /deep/ .el-input__inner {
              /*width:10%;*/
              float: left;
            }

            .temp1 {
              width: 7%;
            }

            .temp2 {
              width: 8%;

              /deep/ .el-textarea__inner {
                line-height: 13px;
              }
            }

            .temp3 {
              width: 25%;
            }

            .temp4 {
              width: 16%;

              /deep/ .el-textarea__inner {
                line-height: 13px;
              }
            }
          }

          /deep/ .el-tabs__item {
            color: #409EFF;
          }
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
            width: 27%;
          }

          .sends {
            margin: 10px 10px 0px 10px;
            float: left;
            width: 30%;
          }

          .start {
            margin-top: 10px;
            float: left;
            width: 40%;

            /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
              /*width: 280px;*/
            }
          }

          /deep/ .el-form-item__label {
            text-align: left;
          }
        }
      }

      .footer {
        width: 100%;
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
    }

    .customerType {
      width: 100%;

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
    }

    .customerLabel {
      width: 100%;
      .lines {
        width: 2px;
        height: 39px;
        background: #ccc;
        display: block;
        float: left;
        margin: 0px 20px;
      }
      /deep/ .el-tabs--card > .el-tabs__header {
        border: none;
        margin-left: 100px;
      }
      /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border-bottom: 1px solid #e4e7ed;
      }
      .all {
        float: left;
      }
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
          .tagChild{
            /deep/ .el-tag:hover{
              color:#409EFF;
            }
          }
        }
      }
      /deep/ .el-tag{
        height:39px;
        line-height:39px;
        margin-left:10px;
        margin-top:5px;
      }
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

        /deep/ .el-radio + .el-radio {
          margin-left: 28px;
        }
        /deep/ .el-radio__label{
          padding-left:0px;
        }
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

          /deep/ .el-input__inner {
            width: 100%;
          }
        }

        .sends {
          margin: 10px 10px 0px 10px;
          float: left;

          /deep/ .el-input__inner {
            width: 100%;
          }
        }

        .start {
          margin-top: 10px;
          float: left;

          /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 280px;
            /*width:80%;*/
          }
        }

        /deep/ .el-form-item__label {
          text-align: left;
        }
      }
    }
  }

  .editAdd {
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
      }
    }
    .name {
      width: 100%;
      margin-top: 10px;
      position: relative;

      .naming {
        width: 30%;
        float: left;
      }

      .model {
        margin: 0 20px;
      }

      .types {
        position: absolute;
        top: 0%;
        left: 44%;

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
      /deep/ .el-tag {
        height: 40px;
        line-height: 40px;
        margin-left: 5px;
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
    .customerType {
      width: 100%;
    }
    .customerLabel {
      width: 100%;
      .tabs {
        /deep/ .el-checkbox-button--medium .el-checkbox-button__inner {
          padding: 10px 5px;
        }
        /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner {
          color: #fff;
          background-color: #409EFF;
        }
      }
      .tags{
        width:100%;
        .tagChild{
          /deep/ .el-tag:hover{
            color:#409EFF;
          }
        }
      }
      /deep/ .el-tag{
        height:30px;
        line-height:30px;
        margin-left:10px;
        margin-top:5px;
      }
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
    /deep/ .el-tabs--card > .el-tabs__header {
      border: none;
      margin-left: 100px;
    }
    /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border-bottom: 1px solid #e4e7ed;
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
        /deep/ input::-webkit-outer-spin-button,
        /deep/ input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
        /deep/ input[type="number"] {
          -moz-appearance: textfield;
        }
      }
      .starts {
        width: 100%;
        height: 100%;
        /deep/ .el-radio + .el-radio {
          margin-left: 28px;
        }
        /deep/ .el-radio__label{
          padding-left:0px;
        }
        /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
          width: 170px;
        }
        /deep/ .el-date-editor .el-range-separator {
          width: 10%;
        }
        .sendTime {
          margin-top: 10px;
          text-align: left;
          float: left;
          /deep/ .el-input__inner {
            width: 100%;
          }
        }
        .sends {
          margin: 10px 10px 0px 10px;
          float: left;
          /deep/ .el-input__inner {
            width: 100%;
          }
        }
        .start {
          margin-top: 10px;
          float: left;
          /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 280px;
            /*width:80%;*/
          }
        }
        /deep/ .el-form-item__label {
          text-align: left;
        }
      }
    }
    .footer {
      width: 100%;
      float: left;
      margin-top: 20px;
      .footer-up {
        background: #ccc;
        height: 40px;
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
        }
      }
    }
    .templates {
      /deep/ .el-input {
        width: 10%;
      }

      /deep/ .el-input__inner {
        /*width:10%;*/
        float: left;
      }

      .temp1 {
        width: 35%;
      }

      .temp2 {
        width: 8%;

        /deep/ .el-textarea__inner {
          line-height: 13px;
        }
      }

      .temp3 {
        width: 11%;
      }

      .temp4 {
        width: 8%;

        /deep/ .el-textarea__inner {
          line-height: 13px;
        }
      }

      .temp5 {
        width: 10%;
      }
    }
    .templatess {
      /deep/ .el-input {
        width: 10%;
      }

      /deep/ .el-input__inner {
        /*width:10%;*/
        float: left;
      }

      .temp1 {
        width: 8%;
      }

      .temp2 {
        width: 8%;

        /deep/ .el-textarea__inner {
          line-height: 13px;
        }
      }

      .temp3 {
        width: 25%;
      }

      .temp4 {
        width: 16%;

        /deep/ .el-textarea__inner {
          line-height: 13px;
        }
      }

      .temp5 {
        width: 17%;
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
          border-bottom: 1px solid #e4e7ed;
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
  .epr {
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
</style>
<style lang="scss">
  .message {
    .divs {
      font-size: 14px;
      color: #333333;
    }

    .inputs {
      font-size: 14px !important;
      text-align: center !important;
      width: 5% !important;
      color: #333333 !important;
    }
  }
</style>


