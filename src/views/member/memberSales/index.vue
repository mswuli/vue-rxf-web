<template>
  <el-container>
    <el-main class="main">
      <div class="main-top">
        <div class="main-up">
          <span class="sales">快速查询</span>
        </div>
        <el-form label-width="100px">
          <el-form-item label="客户查询：">
            <el-input placeholder="手机号" v-model.trim="cellPhone"></el-input>
          </el-form-item>
          <el-form-item label="客户类型：">
            <el-button type="info" @click="allType" class="all" id="allType">全部</el-button>
            <span class="lines"></span>
            <el-checkbox-group v-model="list" @change="selectType">
              <el-checkbox v-for="(item ,index) in customType" :label="item" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="客户标签：">
            <el-button type="info" @click="allLabel" class="all"  id="allLabel">全部</el-button>
            <span class="lines"></span>
            <div class="tabs">
              <el-checkbox-group v-model="tabList" size="medium">
                <el-checkbox-button v-for="item in customLabel" :label="item" :key="item.name" @click.native="selectLabel(item)" id="checkBox">
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
                {{tag}}
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
          <el-form-item label="">
            <el-button type="primary" @click="searchList">搜索</el-button>
            <el-button type="danger" @click="resetList">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-down">
        <div class="down-up">
          <div class="left"><span>消费记录</span></div>
          <div class="right">
            <el-button @click="fresh">刷新</el-button>
            <el-button type="primary" @click="addSales">新增</el-button>
          </div>
        </div>
        <el-table
          :data="saleList.data"
          stripe
          style="width: 100%">
          <el-table-column
            prop="patientName"
            label="姓名"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="tel"
            label="联系电话"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="number"
            label="就诊次数"
          >
          </el-table-column>
          <el-table-column
            prop="frequency"
            label="就诊频率"
          >
          </el-table-column>
          <el-table-column
            prop="recordTime"
            label="最近购药记录">
          </el-table-column>
          <el-table-column
            prop="illnessChange"
            label="病情变化">
          </el-table-column>
          <el-table-column
            prop="paymentName"
            label="医疗消费习惯">
          </el-table-column>
          <el-table-column
            prop="preferences"
            label="个人偏好">
          </el-table-column>
          <el-table-column
            prop="problems"
            label="接受医疗服务中遇到的问题">
          </el-table-column>
          <el-table-column
            prop="advice"
            label="对药店的意见和建议"
            width="150"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="query(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small" @click="edit(scope.row)" v-show="scope.row.patientsType === '自主购药用户'">
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="param.page" :page-sizes="[10,20,30, 50]"
                         :page-size="param.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="saleList.total">
          </el-pagination>
        </div>
      </div>
      <el-dialog
        class="sending"
        title=""
        :visible.sync="addDialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">新增记录</span>
          <div class="close">
            <el-button @click="save">保存</el-button>
            <el-button @click="addClosed">关闭</el-button>
          </div>
        </div>
        <div class="history">
          <el-form :model="mObjects" label-width="107px" :rules="rules" ref="mObjects">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model.trim="mObjects.tel"  @input.native="searchTel(mObjects.tel)">
              </el-input>
            </el-form-item>
            <el-form-item label="客户类型" prop="patientsType">
              <el-input v-model="mObjects.patientsType" clearable placeholder="请选择" :disabled="true">
                <el-option label="自主购药用户" value="自主购药用户"></el-option>
                <el-option label="视频问诊用户" value="视频问诊用户"></el-option>
                <el-option label="处方外延用户" value="处方外延用户"></el-option>
              </el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="patientName">
              <el-input v-model="mObjects.patientName" :disabled="true">
              </el-input>
            </el-form-item>
            <el-form-item label="客户标签" prop="patientsLabel">
              <el-input v-model="mObjects.patientsLabel" :disabled="true">
              </el-input>
            </el-form-item>
            <el-form-item label="就诊频率" prop="frequency">
              <el-input v-model="mObjects.frequency" aria-readonly="false" :disabled="true">

              </el-input>
            </el-form-item>
            <el-form-item label="就诊次数" prop="number">
              <el-input v-model="mObjects.number" :disabled="true" value="">

              </el-input>
            </el-form-item>
            <el-form-item label="购药记录" prop="recordTime">
              <el-date-picker
                v-model="mObjects.recordTime"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="病情变化">
              <el-select v-model="mObjects.illnessChange" clearable placeholder="请选择">
                <el-option label="改善" value="改善"></el-option>
                <el-option label="恶化" value="恶化"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医疗消费习惯" prop="paymentName">
              <el-select v-model="mObjects.paymentName" clearable placeholder="请选择">
                <el-option label="医保" value="医保"></el-option>
                <el-option label="现金" value="现金"></el-option>
                <el-option label="第三方" value="第三方"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="个人偏好">
              <el-input v-model="mObjects.preferences">
              </el-input>
            </el-form-item>
            <el-form-item label="接受医疗服务中遇到的问题" class="results">
              <el-input v-model="mObjects.problems" type="textarea" placeholder="50字以内">
              </el-input>
            </el-form-item>
            <el-form-item label="对药店的意见和建议" class="results">
              <el-input v-model="mObjects.advice" type="textarea" placeholder="50字以内">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog
        class="sending"
        title=""
        :visible.sync="queryDialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">会员详情</span>
          <el-button @click="customerClosed" class="close">关闭</el-button>
        </div>
        <div class="history">
          <el-form label-width="107px">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model="detailList.tel" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="客户类型">
              <el-input v-model="detailList.patientsType" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="detailList.patientName" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="客户标签">
              <el-input v-model="detailList.patientsParentLabel" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="就诊频率">
              <el-input v-model="detailList.frequency" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="就诊次数">
              <el-input v-model="detailList.number" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="购药记录">
              <el-input v-model="detailList.recordTime" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="病情变化">
              <el-input v-model="detailList.illnessChange" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="医疗消费习惯">
              <el-input v-model="detailList.paymentName" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="个人偏好">
              <el-input v-model="detailList.preferences" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="接受医疗服务中遇到的问题" class="results">
              <el-input v-model="detailList.problems" type="textarea" :disabled="readonly">
              </el-input>
            </el-form-item>
            <el-form-item label="对药店的意见和建议" class="results">
              <el-input v-model="detailList.advice" type="textarea" :disabled="readonly">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog
        class="edit"
        title=""
        :visible.sync="editDialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">修改记录</span>
          <div class="close">
            <el-button @click="editSave">保存</el-button>
            <el-button @click="editClosed">取消</el-button>
          </div>
        </div>
        <div class="history">
          <el-form :model="mObject" label-width="107px" :rules="rules" ref="mObject">
            <el-form-item label="购药记录" prop="recordTime">
              <el-date-picker
                v-model="mObject.recordTime"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="病情变化">
              <el-select v-model="mObject.illnessChange" placeholder="请选择">
                <el-option label="恶化" value="恶化"></el-option>
                <el-option label="改善" value="改善"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医疗消费习惯" prop="paymentName">
              <el-select v-model="mObject.paymentName" clearable placeholder="请选择">
                <el-option label="医保" value="医保"></el-option>
                <el-option label="现金" value="现金"></el-option>
                <el-option label="第三方" value="第三方"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="个人偏好">
              <el-input v-model="mObject.preferences">
              </el-input>
            </el-form-item>
            <el-form-item label="接受医疗服务中遇到的问题" class="results">
              <el-input v-model="mObject.problems" type="textarea" placeholder="50字以内">
              </el-input>
            </el-form-item>
            <el-form-item label="对药店的意见和建议" class="results">
              <el-input v-model="mObject.advice" type="textarea" placeholder="50字以内">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </el-main>
  </el-container>

</template>

<script>
  import {mapState} from 'vuex'
  import {getToken} from '@/utils/auth'
  import moment from 'moment'

  export default {
    data() {
      let validatePhone = (rule, value, callback) => {
        let reg = /^1(3|4|5|6|7|8)\d{9}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的电话号码"));
        } else {
          callback();
        }
      };
      return {
        currentLabel: "",
        cellPhone: "",
        clickEdit: true,
        readonly: true,
        addDialogVisible: false,
        queryDialogVisible: false,
        editDialogVisible: false,
        tagss: false,
        show: false,
        mObjects: {
          patientsLabel: '',
          patientName: '',
          patientsType: '',
          frequency: '',
          number: '',
          recordTime: new Date(),
        },
        telss:"",
        param: {
          page: 1,
          limit: 10,
          searchCondition:{patientsType: '', patientsParentLabel: '', patientsChildLabel: '',tel:''}
        },
        customType: ['处方外延用户', '视频问诊用户', '自主购药用户'],
        rules: {
          patientName: [
            {
              required: true,
              message: '请输入姓名',
              trigger: 'blur'
            }
          ],
          tel: [
            {
              required: true,
              // type: "number",
              message: "请输入11位数手机号码",
              trigger: 'blur',
              validator: validatePhone
            }
          ],
          patientsLabel: [
            {
              required: true,
              message: '请选择标签',
              trigger: 'blur'
            }
          ],
          patientsType: [
            {
              required: true,
              message: '请选择类型',
              trigger: 'blur'
            }
          ],
          number: [{
            required: true,
            message: '请选择就诊次数',
            trigger: 'blur'
          }],
          frequency: [{
            required: true,
            message: '请选择就诊频率',
            trigger: 'blur'
          }],
          recordTime: [{
            required: true,
            message: '请选择购药记录',
            trigger: 'blur'
          }],

          paymentName: [{
            required: true,
            message: '请选择习惯',
            trigger: 'blur'
          }]
        },
        list: [],
        typeList: [],
        edits: '',
        labelList: [],
        level: '1',
        mObject: {},
        parentLabelList: [],
        childrenLabelList: [],
        types: [],
        tabList:[],
        tagList:[],
      }
    },
    created() {
      this.getSaleList();
      this.getCustomLabel();
    },
    computed: mapState({
      saleList: state => state.memberSales.saleList,
      customLabel: state => state.memberMannage.customLabel,
      detailList: state => state.memberMannage.detailLists
    }),
    methods: {
      // 客户类型
      allType() {
        this.show = true
        this.list = this.customType
        this.typeList = ['全部']
        this.param.searchCondition.patientsType = '';
        let aa = document.getElementById("allType")
        aa.style.color = "#ffffff";
        aa.style.background = "#409EFF"
      },
      // 选择客户类型
      selectType(value) {
        this.show = true
        this.typeList = [];
        if(value.length == 3) {
          let aa = document.getElementById("allType")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF"
        }else{
          let aa = document.getElementById("allType")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad"
        }
        Object.assign(this.typeList, value)
        this.param.searchCondition.patientsType = this.typeList.join(',')
      },
      // 删除客户类型
      delType(tag) {
        if (tag === '全部'){
          this.list =[];
          let aa = document.getElementById("allType")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF"
        }else
        {
          this.list.splice(this.list.indexOf(tag), 1);
          let bb = document.getElementById("allType")
          bb.style.color = "#ffffff";
          bb.style.background = "#a6a9ad"
        }
        if(this.list.length === 0) {
          let cc = document.getElementById("allType")
          cc.style.color = "#ffffff";
          cc.style.background = "#a6a9ad"
        }
        this.typeList.splice(this.typeList.indexOf(tag), 1)
      },
      // 客户标签
      allLabel() {
        this.show=true;
        this.labelList = [{ name: '全部' }];
        this.tagss = false;
        let aa = document.getElementById("allLabel")
        aa.style.color = "#ffffff";
        aa.style.background = "#409EFF";
        for(let i=0; i<this.customLabel.length;i++){
          this.tabList.push(this.customLabel[i])
        }
        this.param.searchCondition.patientsLabel = '';
        this.param.searchCondition.patientsChildLabel='';
        this.param.searchCondition.patientsParentLabel='';
        this.childrenLabelList=[];
        this.parentLabelList=[];
      },
      // 选择客户标签
      selectLabel(label) {
        this.tagss = true;
        this.currentLabel = label.name;
        this.show = true;
        this.$store.dispatch('getCustomLabels', {params: {level: 2, parentId: label.id}}).then((response) => {
          this.tagList = response.data
        })
        for (let i = 0; i < this.labelList.length; i++) {
          if (this.labelList[i].name === label.name) {
            this.tabList.push(label)
            return
          }
        }
        if (JSON.stringify(this.labelList) === '[{"name":"全部"}]') {
          let aa = document.getElementById("allLabel")
          aa.style.color = "#ffffff";
          aa.style.background = "#909399";
          for(let i=0; i<this.tabList.length;i++){
            if(this.tabList[i].name === label.name){
              continue;
            }else{
              this.tabList.splice(this.tabList.indexOf(this.tabList[i]), 1);
              --i;
            }
          }
          this.labelList = [];
          this.parentLabelList = [];
        }
        this.labelList.push({name: label.name, type: 'success', realName: label.name});
        this.parentLabelList.push(label.name);
        this.param.searchCondition.patientsLabel = '';
        this.param.searchCondition.patientsParentLabel = '';
        for (let i = 0; i < this.labelList.length; i++) {
          this.param.searchCondition.patientsLabel = this.param.searchCondition.patientsLabel + ',' + this.labelList[i].name
        }
        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList.length > 1 && i > 0) {
            this.param.searchCondition.patientsParentLabel = this.param.searchCondition.patientsParentLabel + ',' + this.parentLabelList[i]
          } else {
            this.param.searchCondition.patientsParentLabel = this.parentLabelList[i];
          }
        }
      },
      // 增加客户标签的子集
      addTag(tag) {
        for (let i = 0; i < this.labelList.length; i++) {
          if (this.labelList[i].name === tag.fullName) {
            return
          }
        }
        this.childrenLabelList.push(tag.name);
        this.labelList.push({name: tag.fullName, type: 'success', realName: tag.name})
        this.param.searchCondition.patientsLabel = ''
        for (let i = 0; i < this.labelList.length; i++) {
          this.param.searchCondition.patientsLabel = this.param.searchCondition.patientsLabel + ',' + this.labelList[i].name
        }
        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList.length > 1 && i > 0) {
            this.param.searchCondition.patientsChildLabel = this.param.searchCondition.patientsChildLabel + ',' + this.childrenLabelList[i];
          } else {
            this.param.searchCondition.patientsChildLabel = this.childrenLabelList[i];
          }
        }
      },
      // 删除客户标签
      delLabel(tag) {
        if(tag != null && tag.name == "全部"){
          let aa = document.getElementById("allLabel")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad";
          this.tabList = [];
        }
        if (this.currentLabel === tag.name) {
          this.tagss = false;
        }
        //如果去掉的是父标签，则作为关联把相应的子标签也去除掉
        if (!tag.name.includes("-")) {
          for(let i=0; i<this.tabList.length;i++){
            if(this.tabList[i].name === tag.name){
              this.tabList.splice(this.tabList.indexOf(this.tabList[i]), 1);
              --i;
            }
          }
          for (let i = 0; i < this.labelList.length; i++) {
            if (this.labelList[i].name.includes(tag.name + "-")) {
              for (let j = 0; j < this.childrenLabelList.length; j++) {
                if (this.childrenLabelList[j] == this.labelList[i].realName) {
                  this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[j]), 1);
                  break;
                }
              }
              this.labelList.splice(this.labelList.indexOf(this.labelList[i]), 1);
              --i;
            }
          }
        }
        this.labelList.splice(this.labelList.indexOf(tag), 1);
        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList[i] == tag.realName) {
            this.parentLabelList.splice(this.parentLabelList.indexOf(this.parentLabelList[i]), 1);
          }
        }
        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList[i] == tag.realName) {
            this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[i]), 1);
          }
        }
        this.param.searchCondition.patientsParentLabel = '';
        this.param.searchCondition.patientsChildLabel = '';
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
            this.param.searchCondition.patientsChildLabel = this.childrenLabelList[i];
          }
        }
      },
      searchList() {
        this.param.page = 1;
        this.getSaleList()
        // this.types = [];
        // for (let i = 0; i < this.typeList.length; i++) {
        //   this.types.push(this.typeList[i]);
        //   this.param.searchCondition.patientsType = this.types.join(',');
        //   this.getSaleList()
        // }
        // if (this.typeList.length === 0 || this.typeList[0] === "全部") {
        //   this.param.searchCondition = {};
        //   this.getSaleList()
        // }
      },
      resetList() {
        this.cellPhone ="";
        this.tagss = false;
        this.param.searchCondition.patientsType ="";
        this.param.searchCondition.patientsChildLabel = "";
        this.param.searchCondition.patientsParentLabel = "";
        this.childrenLabelList = [];
        this.parentLabelList = [];
        this.list = [];
        this.edits = "";
        this.labelList = [];
        this.typeList =[];
        this.tagList=[];
        this.tabList=[];
        this.getSaleList();
      },
      getSaleList() {
        this.param.searchCondition.tel = this.cellPhone;
        this.$store.dispatch('getSaleList', {params: this.param})
      },
      getCustomLabel() {
        this.$store.dispatch('getCustomLabel', {params: {level: this.level}}).then(response => {
        })
      },
      addSales() {
        this.addDialogVisible = true;
        this.mObjects = {
          patientsLabel: '',
          patientName: '',
          patientsType: '',
          frequency: '',
          number: '',
          recordTime: new Date(),
        };
        // if (this.mObjects.recordTime = null) {
        //   this.mObjects.recordTime = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
        // }
      },
      fresh() {
        this.getSaleList()
      },
      query(row) {
        this.$store.dispatch('getDetailMemberMannage', {tel: row.tel}).then(response => {
          this.queryDialogVisible = true
        })
      },
      customerClosed() {
        this.queryDialogVisible = false
      },
      edit(row) {
        this.$store.dispatch('getDetailMemberMannage', {tel: row.tel}).then(response => {
          this.mObject = response.data;
          this.mObject.recordTime = new Date();
          this.editDialogVisible = true;
        })
      },
      editClosed() {
        this.editDialogVisible = false
      },
      editSave() {
        this.$refs['mObject'].validate((valid) => {
          if (this.mObject.recordTime != null) {
            this.mObject.recordTime = moment(this.mObject.recordTime).format('YYYY-MM-DD hh:mm:ss')
          }
          if (valid) {
            this.$store.dispatch('editSales', {
              data: this.mObject, callback: () => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.editDialogVisible = false;
                this.$nextTick(() => {
                  this.$refs['mObject'].clearValidate()
                  this.mObject = {};
                  this.getSaleList()
                })
              }
            })
          }
        })
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getSaleList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getSaleList()
      },
      save() {
        if (this.mObjects.recordTime != null) {
          this.mObjects.recordTime = moment(this.mObjects.recordTime).format('YYYY-MM-DD hh:mm:ss')
        }
        this.$refs['mObjects'].validate((valid) => {
          if (valid) {
            this.$store.dispatch('addSales', {
              data: this.mObjects, callback: () => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.addDialogVisible = false
                this.$nextTick(() => {
                  this.$refs['mObjects'].resetFields()
                  this.mObjects = {};
                  this.getSaleList()
                })
              }
            })
          }
        })
      },
      addClosed() {
        this.mObjects = {};
        this.$refs['mObjects'].resetFields();
        this.$refs['mObjects'].clearValidate();
        this.addDialogVisible = false;
      },
      // 手机号查询
      searchTel(value) {
        if (value.length != 11) {
          return;
        }
        this.$store.dispatch('getDetailMemberMannage',{tel:value}).then(res => {
            if (res.data == null) {
              this.mObjects.patientsType = "";
              this.mObjects.patientName = "";
              this.mObjects.patientsLabel = "";
              this.mObjects.frequency = "";
              this.mObjects.number = "";
              this.mObjects.recordTime = "";
              return this.$message({
                type: 'error',
                message: '此用户暂不是会员，请添加会员后，再添加相关消费记录信息。',
                duration: 1000 * 2,
              })
            } else {
              this.mObjects.patientName = res.data.patientName;
              this.mObjects.patientsLabel = res.data.patientsParentLabel;
              this.mObjects.patientsType = res.data.patientsType;
              this.mObjects.frequency = res.data.frequency;
              this.mObjects.number = res.data.number;
              this.mObjects.recordTime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
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
          left: 2%;
        }
      }

      /deep/ .el-input {
        width: 20%;
      }

      /deep/ .el-form-item {
        margin-top: 20px;
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
      .tabs {
        /deep/ .el-checkbox-button--medium .el-checkbox-button__inner {
          padding: 10px 10px;
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

      /deep/ .el-tag {
        height: 39px;
        line-height: 39px;
        margin-left: 10px;
      }

      /deep/ .el-tabs__nav-wrap {
        margin-bottom: 0px;
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
        height: 44px;
        border: 1px solid #ccc;
        background: #ccc;

        .left {
          float: left;

          span {
            display: block;
            line-height: 44px;
            margin-left: 20px;
            font-weight: bold;
          }
        }

        .right {
          float: right;
          margin-right: 10px;
          line-height: 44px;
        }
      }
    }

    .sending {
      height: 100%;

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
          height: 550px;
          margin-top: 20px;

          /deep/ .el-input {
            width: 100%;
          }

          /*/deep/ .el-form-item__label{*/
          /*text-align: center;*/
          /*}*/
          /deep/ .el-autocomplete {
            display: block;
          }

          /deep/ .el-form-item {
            width: 48%;
            float: left;
          }

          /deep/ .el-form-item__content {
            line-height: 40px;
          }

          /deep/ .el-select {
            display: block;
          }

          .results {
            width: 96%;

            /deep/ .el-form-item__label {
              line-height: 20px;
            }
          }
        }
      }
    }

    .edit {
      height: 100%;

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
          width: 95%;
          height: 400px;
          margin: 20px auto;
          /deep/ .el-input {
            width: 100%;
          }

          /deep/ .el-autocomplete {
            display: block;
          }

          /deep/ .el-form-item {
            width: 48%;
            float: left;
          }

          /deep/ .el-form-item__content {
            line-height: 40px;
          }

          /deep/ .el-select {
            display: block;
          }

          .results {
            width: 96%;
            margin: 20px auto;

            /deep/ .el-form-item__label {
              line-height: 20px;
            }
          }
        }
      }
    }
  }
</style>

