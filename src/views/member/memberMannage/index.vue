<template>
  <el-container>
    <el-main class="main">
      <div class="main-top">
        <div class="main-up">
          <span class="sales">快速查询</span>
        </div>
        <el-form label-width="100px">
          <el-form-item label="客户查询：">
            <el-input  placeholder="手机号" v-model.trim="param.searchCondition.tel" ></el-input>
          </el-form-item>
          <el-form-item label="客户类型：">
            <el-button type="info" @click="allType" class="all" id="allType">全部</el-button>
            <span class="lines"></span>
            <el-checkbox-group  v-model="list" @change="selectType">
              <el-checkbox v-for="(item ,index) in customType" :label="item" :key="index">{{item}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="客户标签：">
            <el-button type="info" @click="allLabel" class="all" id="allLabel">全部</el-button>
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
          <el-form-item label="您已选择："  v-show="!(typeList.length === 0 &&　labelList.length === 0)">
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
          <div class="left"><span>客户台账</span></div>
          <div class="right">
            <el-button @click="fresh">刷新</el-button>
            <el-button type="primary" @click="adds">新增</el-button>
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
              <el-button @click="query(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="param.page" :page-sizes="[10,20,30, 50]"
                         :page-size="param.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="memberList.total">
          </el-pagination>
        </div>
      </div>
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
              <span class="hospital">日期：<span>{{electRecord.tentativeDiagnosis}}</span></span>
              <span class="hospital">医院：<span>{{electRecord.tentativeDiagnosis}}</span></span>
              <span class="hospital">科别：<span>{{electRecord.tentativeDiagnosis}}</span></span>
            </div>
            <div class="cont-down">
              <span class="date">主诉：<span>{{electRecord.tentativeDiagnosis}}</span></span>
              <span class="date">现病史，既往史，家族史：<span>{{electRecord.tentativeDiagnosis}}</span></span>
              <span class="date">过敏史：<span>{{electRecord.tentativeDiagnosis}}</span></span>
              <span class="date">体格检查：<span>{{electRecord.tentativeDiagnosis}}</span></span>
              <span class="date">辅助检查：<span>{{electRecord.tentativeDiagnosis}}</span></span>
              <span class="date">初步诊断：<span>{{electRecord.tentativeDiagnosis}}</span></span>
              <span class="date">治疗意见/医嘱：<span>{{electRecord.tentativeDiagnosis}}</span></span>
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
        <div class="history" >
          <template v-if="patientMedicinePic">
            <img :src=patientMedicinePic alt="电子病历图片" style="width:100% ;height:100%" class="images">
          </template>
          <template v-else>
            <span class="spans">暂无病历图片</span>
          </template>
        </div>
      </el-dialog>
      <el-dialog
        class="addcustomer"
        title=""
        :visible.sync="addDialogVisible"
        width="50%"
        :close-on-click-modal=false>
        <div class="icons">
          <span class="title">新增客户</span>
          <div class="close">
            <el-button @click="save">保存</el-button>
            <el-button   @click="addClose">关闭</el-button>
          </div>
        </div>
        <div class="history">
          <el-form  :model="mObject" label-width="100px" :rules="rules"  ref="mObject">
            <el-form-item label="姓名" prop="patientName">
              <el-input v-model="mObject.patientName">
              </el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="mObject.sexName" clearable placeholder="请选择">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="mObject.idCard">
              </el-input>
            </el-form-item>
            <el-form-item label="联系电话"  prop="tel">
              <el-input v-model="mObject.tel" type="number" maxlength="11" minlength="11">
              </el-input>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="mObject.address">
              </el-input>
            </el-form-item>
            <el-form-item label="职业">
              <el-select v-model="mObject.professional" clearable placeholder="请选择">
                <el-option label="管理者" value="管理者"></el-option>
                <el-option label="技术员" value="技术员"></el-option>
                <el-option label="公务员" value="公务员"></el-option>
                <el-option label="服务者" value="服务者"></el-option>
                <el-option label="生产者" value="生产者"></el-option>
                <el-option label="工人职员" value="工人职员"></el-option>
                <el-option label="军人" value="军人"></el-option>
                <el-option label="自由职业" value="自由职业"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="诊断结果" class="results">
              <el-input v-model="mObject.disease" type="textarea">
              </el-input>
            </el-form-item>
            <el-form-item label="治疗状况">
              <el-select v-model="mObject.treatmentSituation" clearable placeholder="请选择">
                <el-option label="初诊" value="初诊"></el-option>
                <el-option label="复诊" value="复诊"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消费水平">
              <el-select v-model="mObject.economicConditions" clearable placeholder="请选择">
                <el-option label="0-100" value="0-100"></el-option>
                <el-option label="100-200" value="100-200"></el-option>
                <el-option label="200-300" value="200-300"></el-option>
                <el-option label="300以上" value="300以上"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户类型">
              <el-input v-model="mObject.patientsType" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="客户电子病历" label-width="110px">
              <el-upload
                class="upload-demo"
                :mutiple="true"
                :action="attachmentUploadUrl"
                :on-change="uploadDblPicSuccess"
                :show-file-list="true"
                :before-upload="beforeAvatarUpload"
                :headers="headersData"
                :limit=1
                :file-list="fileList"
                :on-exceed="handleExceed"
                :on-remove="removeUrl">
                <el-button size="small" type="primary" >点击上传</el-button>
                <div slot="tip" class="el-upload__tip upload" style="font-size:10px;">只能上传jpg/png文件，且不超过5M</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="客户标签" class="select" prop="patientsParentLabel">
              <div class="tabs">
                <el-checkbox-group v-model="addTabList" size="medium">
                  <el-checkbox-button v-for="item in customLabel" :label="item" :key="item.name" @click.native="addPatientsLabel(item)">
                    {{item.name}}
                  </el-checkbox-button>
                </el-checkbox-group>
                <div class="tags" >
                  <div class="tagChild">
                    <el-tag
                      v-show="tagss"
                      @click.native="addTagLabel(tag)"
                      v-for="(tag,i) in addTagList"
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
            <el-form-item label="您已选择：" v-show="!(addLabelList.length === 0)" class="selected">
              <div class="customer">
                <span class="customers">客户标签：</span>
                <el-tag
                  @close="addDelLabel(tag)"
                  v-for="(tag, i) in addLabelList"
                  :key="i"
                  closable
                  type="info">
                  {{tag.name}}
                </el-tag>
              </div>
            </el-form-item >
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
          <span class="title">查看详情</span>
          <div class="close">
            <el-button  @click="detailClose">关闭</el-button>
          </div>
        </div>
        <div class="history">
          <el-form  label-width="100px">
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
  </el-container>

</template>

<script>
  import { getConstants } from '@/utils/constants'
  import { mapState } from 'vuex'
  import { getToken } from '@/utils/auth'
  export default {
    data(){
      let validatePhone = (rule, value, callback) => {
        let reg = /^1(3|4|5|6|7|8)\d{9}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的电话号码"));
        } else {
          callback();
        }
      };
      return{
        patientMedicinePic:"",
        currentLabel:"",
        tagss:false,
        readonly:true,
        show:false,
        select:false,
        queryDialogVisible:false,
        edialogVisible:false,
        picDialogVisible:false,
        listLoading:false,
        addDialogVisible:false,
        param: { page: 1, limit: 10, searchCondition:{patientsType: '', patientsParentLabel: '',patientsChildLabel: '' } },
        customType:['处方外延用户','视频问诊用户','自主购药用户'],
        mObject:{
          patientsType:'自主购药用户',
          patientsLabel:'',
          patientsParentLabel:'',
          patientsChildLabel:'',
          medicalRecordPic:""
        },
        attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL_TT,
        attachmentUrl: getConstants().ATTACHMENT_URL_TT,
        upLoadData: {
          file_id: 0
        },
        headersData: { Authorization: getToken() },
        fileList:[],
        list:[],
        typeList:[],
        edits:"",
        labelList:[],
        addLabelList:[],
        parentLabelList:[],
        childrenLabelList:[],
        rules: {
          patientName: [
            {
              required: true,
              message: "请输入姓名",
              trigger: "blur"
            }
          ],
          patientsParentLabel: [
            {
              required: true,
              message: "请选择客户标签",
              trigger: "blur"
            }
          ],
          tel: [
            {
              required: true,
              type: "number",
              message: "请输入11位数手机号码",
              trigger: "blur",
              validator: validatePhone
            }
          ],
        },
        level:'1',
        listing:[],
        editss:"",
        tabList:[],
        currentList:[],
        tagList:[],
        addTabList:[],
        addTagList:[],
        urlList:[]
      }
    },
    created(){
      this.getMemberList();
      this.getCustomLabel();
    },
    computed: mapState({
      memberList: state => state.memberMannage.memberList,
      electRecord: state => state.memberMannage.electRecord,
      customLabel: state => state.memberMannage.customLabel,
      detailLists: state => state.memberMannage.detailLists,
    }),
    methods:{
      // 客户类型
      allType(){
        this.show=true;
        this.list =  this.customType;
        this.typeList = ['全部'];
        this.param.searchCondition.patientsType = "";
        let aa = document.getElementById("allType")
        aa.style.color = "#ffffff";
        aa.style.background = "#409EFF"
      },
      // 选择客户类型
      selectType(value){
        this.show=true;
        this.typeList =[];
        if(value.length == 3) {
          let aa = document.getElementById("allType")
          aa.style.color = "#ffffff";
          aa.style.background = "#409EFF"
        }else{
          let aa = document.getElementById("allType")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad"
        }
        Object.assign(this.typeList,value);
        this.param.searchCondition.patientsType = this.typeList.join(",")
      },
      // 删除客户类型
      delType(tag){
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
        this.typeList.splice(this.typeList.indexOf(tag), 1);
      },
      // 客户标签
      allLabel(){
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
      selectLabel(label){
        this.show=true;
        this.tagss =true;
        this.currentLabel = label.name;
        this.$store.dispatch('getCustomLabels', { params: { level: 2, parentId: label.id } }).then((response)=>{
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
          this.labelList.push({ name: label.name, type: 'success',realName:label.name })
        } else {
          this.labelList.push({ name: label.name, type: 'success',realName:label.name });
          this.parentLabelList.push(label.name);
        }

        this.param.searchCondition.patientsLabel = '';
        this.param.searchCondition.patientsParentLabel='';
        for (let i = 0; i < this.labelList.length; i++) {
          this.param.searchCondition.patientsLabel = this.param.searchCondition.patientsLabel + ',' + this.labelList[i].name
        }
        for(let i=0;i<this.parentLabelList.length;i++){
          if(this.parentLabelList.length >1 && i>0){
            this.param.searchCondition.patientsParentLabel = this.param.searchCondition.patientsParentLabel + ',' + this.parentLabelList[i]
          }else{
            this.param.searchCondition.patientsParentLabel = this.parentLabelList[i];
          }
        }
      },
      // 增加客户标签的子集
      addTag(tag){
        for(let i=0; i<this.labelList.length;i++){
          if (this.labelList[i].name === tag.fullName) {
            return
          }
        }
        if (JSON.stringify(this.labelList) === '[{"name":"全部"}]') {
          this.labelList = [];
          this.childrenLabelList = [];
        }else{
          this.childrenLabelList.push(tag.name);
        }
        this.labelList.push({ name: tag.fullName, type: 'success' ,realName:tag.name})
        this.param.searchCondition.patientsLabel = ''
        for (let i = 0; i < this.labelList.length; i++) {
          this.param.searchCondition.patientsLabel = this.param.searchCondition.patientsLabel + ',' + this.labelList[i].name
        }

        for(let i =0; i<this.childrenLabelList.length;i++){
          if(this.childrenLabelList.length >1 && i>0){
            this.param.searchCondition.patientsChildLabel = this.param.searchCondition.patientsChildLabel +','+this.childrenLabelList[i];
          }else{
            this.param.searchCondition.patientsChildLabel = this.childrenLabelList[i];
          }
        }

      },
      // 删除客户标签
      delLabel(tag){
        if(tag != null && tag.name == "全部"){
          let aa = document.getElementById("allLabel")
          aa.style.color = "#ffffff";
          aa.style.background = "#a6a9ad";
          this.tabList = [];
        }
        if(this.currentLabel === tag.name){
          this.tagss =false;
        }
        //如果去掉的是父标签，则作为关联把相应的子标签也去除掉
        if(!tag.name.includes("-")){
          for(let i=0; i<this.tabList.length;i++){
            if(this.tabList[i].name === tag.name){
              this.tabList.splice(this.tabList.indexOf(this.tabList[i]), 1);
              --i;
            }
          }
          for(let i=0; i<this.labelList.length;i++){
            if(this.labelList[i].name.includes(tag.name + "-")){
              for (let j = 0; j < this.childrenLabelList.length; j++) {
                if (this.childrenLabelList[j] == this.labelList[i].realName) {
                  this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[j]),1);
                  break;
                }
              }
              this.labelList.splice(this.labelList.indexOf(this.labelList[i]), 1);
              --i;
            }
          }
        }
        this.labelList.splice(this.labelList.indexOf(tag), 1);
        for (let i=0; i<this.parentLabelList.length;i++){
          if(this.parentLabelList[i] == tag.realName){
            this.parentLabelList.splice(this.parentLabelList.indexOf(this.parentLabelList[i]),1);
          }
        }
        for (let i=0; i<this.childrenLabelList.length;i++){
          if(this.childrenLabelList[i] == tag.realName){
            this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[i]),1);
          }
        }
        this.param.searchCondition.patientsParentLabel='';
        this.param.searchCondition.patientsChildLabel='';
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
      // 搜索
      getMemberList(){
        this.$store.dispatch("getMemberList",{params:this.param})
      },
      getCustomLabel(){
        this.$store.dispatch("getCustomLabel",{ params:{level:this.level}}).then(response=>{
          // console.log(response.data,222)
        })
      },
      searchList(){
        this.param.page = 1;
        this.getMemberList()
      },
      resetList(){
        this.param.searchCondition.tel ="";
        this.param.searchCondition.patientsType ="";
        this.param.searchCondition.patientsParentLabel="";
        this.param.searchCondition.patientsChildLabel="";
        this.childrenLabelList=[];
        this.parentLabelList=[];
        this.list =[];
        this.edits ="";
        this.typeList =[];
        this.labelList =[];
        this.tagList=[];
        this.tabList=[];
        this.getMemberList();
      },
      handleSizeChange(size) {
        this.param.limit = size;
        this.getMemberList()
      },
      handleCurrentChange(page) {
        this.param.page = page;
        this.getMemberList()
      },
      adds(){
        this.addDialogVisible = true;
        this.patientMedicinePic = "";
      },
      fresh(){
        this.getMemberList()
      },
      eRecord(row){
        this.patientMedicinePic ="";
        if(row.patientsType === "自主购药用户"){
          this.$store.dispatch("getElectronicRecord",{tel:row.tel}).then(response => {
            this.patientMedicinePic = response.data.medicalRecordPic;
            this.picDialogVisible = true;
          })
        }else{
          this.$store.dispatch("getElectRecord",{tel:row.tel}).then(response => {
            this.edialogVisible = true;
          })
        }
      },
      eClosed(){
        this.edialogVisible = false;
      },
      picClosed(){
        this.picDialogVisible = false;
      },
      detailClose(){
        this.listing =[];
        this.queryDialogVisible = false;
      },
      query(row){
        this.$store.dispatch('getDetailMemberMannage',{tel:row.tel}).then(response=>{
          this.queryDialogVisible = true;
          this.$store.dispatch("getQueryLabel",{params:{tel:row.tel}}).then(response=>{
            this.listing = response.data;
            let ee = [];
            if(this.listing === undefined){
              return false;
            }
            for(let i=0; i <this.listing.length; i++){
              ee.push(this.listing[i].name);
              if(this.listing[i].patientLabelTemplateVOS === undefined || this.listing[i].patientLabelTemplateVOS === null){
                continue;
              }
              for(let j=0; j<this.listing[i].patientLabelTemplateVOS.length;j++){
                ee.push(this.listing[i].patientLabelTemplateVOS[j].fullName)
              }
            }
            this.listing = ee;
          });
        })
      },
      // 新增标签
      addPatientsLabel(label){
        this.currentLabel = label.name;
        this.tagss = true;
        this.select = true;
        this.$store.dispatch("getCustomLabels",{ params:{level:2 ,parentId:label.id}}).then((response) => {
          this.addTagList = response.data
        });
        for(let i=0; i<this.addLabelList.length;i++){
          if (this.addLabelList[i].name == label.name){
            this.addTabList.push(label)
            return
          }
        }
        this.parentLabelList.push(label.name);
        this.mObject.patientsParentLabel ='';
        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList.length > 1 && i > 0) {
            this.mObject.patientsParentLabel = this.mObject.patientsParentLabel + ',' + this.parentLabelList[i]
          } else {
            this.mObject.patientsParentLabel = this.parentLabelList[i]
          }
        }
        this.addLabelList.push({name:label.name,type:'success',realName:label.name});
      },
      addTagLabel(tag){
        for(let i=0; i<this.addLabelList.length;i++){
          if (this.addLabelList[i].name === tag.fullName) {
            return
          }
        }
        this.childrenLabelList.push(tag.name);
        this.addLabelList.push({name:tag.fullName,type:'success',realName:tag.name});
        this.mObject.patientsChildLabel ='';
        for(let i =0 ; i<this.childrenLabelList.length;i++){
          if(this.childrenLabelList.length>1 && i>0){
            this.mObject.patientsChildLabel = this.mObject.patientsChildLabel +','+this.childrenLabelList[i];
          }else{
            this.mObject.patientsChildLabel = this.childrenLabelList[i];
          }
        }
      },
      addDelLabel(tag){
        if(this.currentLabel === tag.name){
          this.tagss=false;
        }
        if(!tag.name.includes("-")){
          for(let i=0; i<this.addTabList.length;i++){
            if(this.addTabList[i].name === tag.name){
              this.addTabList.splice(this.addTabList.indexOf(this.addTabList[i]), 1);
              --i;
            }
          }
          for(let i=0; i<this.addLabelList.length;i++){
            if(this.addLabelList[i].name.includes(tag.name + "-")){
              for (let j = 0; j < this.childrenLabelList.length; j++) {
                if (this.childrenLabelList[j] == this.addLabelList[i].realName) {
                  this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[j]),1);
                  break;
                }
              }
              this.addLabelList.splice(this.addLabelList.indexOf(this.addLabelList[i]), 1);
              --i;
            }
          }
        }
        this.addLabelList.splice(this.addLabelList.indexOf(tag), 1);
        for (let i=0; i<this.parentLabelList.length;i++){
          if(this.parentLabelList[i] == tag.realName){
            this.parentLabelList.splice(this.parentLabelList.indexOf(this.parentLabelList[i]),1);
          }
        }
        for (let i=0; i<this.childrenLabelList.length;i++){
          if(this.childrenLabelList[i] == tag.realName){
            this.childrenLabelList.splice(this.childrenLabelList.indexOf(this.childrenLabelList[i]),1);
          }
        }
        this.mObject.patientsParentLabel='';
        this.mObject.patientsChildLabel='';
        for (let i = 0; i < this.parentLabelList.length; i++) {
          if (this.parentLabelList.length > 1 && i > 0) {
            this.mObject.patientsParentLabel  = this.mObject.patientsParentLabel  + ',' + this.parentLabelList[i]
          } else {
            this.mObject.patientsParentLabel  = this.parentLabelList[i]
          }
        }
        for (let i = 0; i < this.childrenLabelList.length; i++) {
          if (this.childrenLabelList.length > 1 && i > 0) {
            this.mObject.patientsChildLabel = this.mObject.patientsChildLabel + ',' + this.childrenLabelList[i]
          } else {
            this.mObject.patientsChildLabel = this.childrenLabelList[i];
          }
        }
      },
      // 新增保存
      save(){
        // const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        // if (!p.test(this.mObject.idCard)) {
        //   this.$message({
        //     type: "error",
        //     message: "身份证号格式输入错误!",
        //     duration: 1000*2
        //   });
        //   return false;
        // }
        this.mObject.medicalRecordPic = this.patientMedicinePic;
        this.$refs['mObject'].validate((valid) => {
          if (valid) {
            this.$store.dispatch('addCustomer', {
              data: this.mObject, callback: () => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 3 * 1000
                });
                this.addDialogVisible = false;
                this.mObject={};
                this.mObject.patientsType ="自主购药用户";
                this.addLabelList = [];
                this.parentLabelList=[];
                this.childrenLabelList = [];
                this.addTabList = [];
                this.addTagList =[];
                this.select = false;
                this.tagss = false;
                this.fileList = [];
                this.getMemberList();
              }
            })
          }
        })
      },
      addClose(){
        this.patientMedicinePic="";
        this.mObject = {};
        this.mObject.patientsType ="自主购药用户";
        this.addLabelList = [];
        this.addTabList = [];
        this.addTagList =[];
        this.editss = null;
        this.select = false;
        this.$refs['mObject'].clearValidate();
        this.addDialogVisible = false;
        this.parentLabelList=[];
        this.childrenLabelList = [];
        this.fileList = [];
      },
      uploadDblPicSuccess(response, file, fileList) {
        if (response.response && response.response.success) {
          this.patientMedicinePic = response.response.data;
          // if (this.mObject.urlList == undefined) {
          //   this.mObject.urlList = [];
          // }
          if (this.urlList == undefined) {
            this.urlList = [];
          }
          this.urlList.push (response.response.data);
          this.$message({
            type:'success',
            message:response.response.msg,
            duration:1000 * 3,
          })
        }else if (response.response && !response.response.success){
           this.$message({
             type:'error',
             message:response.response.msg,
             duration:1000 * 3,
           })
        }
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择1个文件`);
      },
      removeUrl(file) {
        // console.log(file,222)
        // console.log(this.urlList,333)
        for (let index in this.urlList) {
          let url = this.urlList[index];
          // console.log(url,22222222)
          if (file.response.data == url) {
            this.urlList.splice(index,1)
            break;
          }
        }
      },
      beforeAvatarUpload(file) {
          const extension = file.type === 'image/jpg'
          const extension2 = file.type === 'image/png'
          const isLt5M = file.size / 1024 / 1024 < 5
          if (!extension && !extension2) {
            this.$message({
              message: '上传文件只能是 jpg、png格式!',
              type: 'warning'
            });
          }
          if (!isLt5M) {
            this.$message({
              message: '上传文件大小不能超过 5MB!',
              type: 'warning'
            });
          }
          return extension || extension2 && isLt5M
      }
    }
  }

</script>

<style lang="scss" scoped>
  .main{
    width:100%;
    .main-top{
      width:100%;
      .main-up{
        width:100%;
        height:40px;
        position:relative;
        background-color:#ccc;
        .sales{
          font-size:16px;
          color:#333333;
          font-weight:bold;
          position:absolute;
          top:25%;
          left:2%;
        }
      }
      /deep/ .el-input{
        width:20%;
      }
      /deep/ .el-form-item{
        margin-top:20px;
      }
      .lines{
        width:2px;
        height:39px;
        background:#ccc;
        display:block;
        float:left;
        margin:0px 20px;
      }
      .all{
        float:left;
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
      /deep/ .el-checkbox__inner{
        width:35px;
        height:35px;
      }
      /deep/ .el-checkbox__inner::after{
        width:10px;
        height:20px;
        left:12px;
        top:2px;
      }
      /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
        border:1px solid #409eff;
        margin-left: 10px;
        line-height: 34px;
        font-size: 14px;
        width: 120px;
        text-align: center;
      }
      /deep/ .el-checkbox__label{
        margin-left: 10px;
        line-height: 34px;
        font-size: 14px;
        width: 120px;
        text-align: center;
      }
      /deep/ .el-tag{
        height:39px;
        line-height:39px;
        margin-left:10px;
      }
      /deep/ .el-tabs__nav-wrap{
        margin-bottom:0px;
      }
      .customer{
        float:left;
        margin-right:10px;
        margin-bottom:10px;
        .customers{
          color:#606266;
          font-size:14px;
        }
      }
    }
    .main-down{
      width:100%;
      .down-up{
        width:100%;
        height:44px;
        border:1px solid #ccc;
        background:#ccc;
        .left{
          float:left;
          span{
            display: block;
            line-height: 44px;
            margin-left:20px;
            font-weight:bold;
          }
        }
        .right{
          float:right;
          margin-right:10px;
          line-height:44px;
        }
      }
    }
    .sending{
      /*height:100%;*/
      /deep/ .el-icon-close:before{
        content:''
      }
      /deep/ .el-dialog__header{
        padding:0px;
      }
      /deep/ .el-dialog__body{
        padding:0px;
        width:100%;
        height:100%;
        .icons{
          width:100%;
          height:40px;
          background:#ccc;
          .title{
            font-size:16px;
            line-height:40px;
            margin-left:15px;
          }
          .close{
            color:#409EFF;
            float:right;
            margin-right:20px;
          }
        }
        .history{
          width:100%;
          height:550px;
          margin-top:20px;
          /deep/ .el-input{
            width:100%;
          }
          /deep/ .el-form-item{
            width:49%;
            float:left;
          }
          /deep/ .el-form-item__content{
            line-height: 40px;
          }
          /deep/ .el-select{
            display:block;
          }
          .results{
            width:98%;
          }
          .upload{
            color:#66b1ff;
            display: block;
            line-height:40px;
          }
          .select{
            width:100%;
          }
          .selected{
            width:100%;
          }
          /deep/ .el-tag{
            height:39px;
            line-height:39px;
            margin-left:5px;
            margin-top:5px;
          }
          /deep/ .el-tabs__nav-wrap{
            margin-bottom:0px;
          }
          /deep/ .el-tabs--card>.el-tabs__header{
            border:none;
          }
          /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
            border-bottom:1px solid #ccc;
          }
          .customer{
            float:left;
            margin-right:10px;
            margin-bottom:10px;
            .customers{
              color:#606266;
              font-size:14px;
            }
            /deep/ .el-icon-close:before{
              content:"\E60F"
            }
          }
        }
      }
    }
    .addcustomer{
      height:100%;
      /deep/ .el-dialog__header{
        padding:0px;
        /deep/ .el-icon-close:before{
          content:''
          /*content: "\E60F";*/
        }
      }
      /deep/ .el-dialog__body{
        padding:0px;
        width:100%;
        height:100%;
        .icons{
          width:100%;
          height:40px;
          background:#ccc;
          .title{
            font-size:16px;
            line-height:40px;
            margin-left:15px;
          }
          .close{
            color:#409EFF;
            float:right;
            margin-right:20px;
          }
        }
        .history{
          width:100%;
          height: 700px;
          overflow-y: scroll;
          margin-top:20px;
          /deep/ .el-input{
            width:100%;
          }
          /deep/ .el-form-item{
            width:49%;
            float:left;
          }
          /deep/ .el-form-item__content{
            line-height: 40px;
          }
          /deep/ .el-select{
            display:block;
          }
          /deep/ input::-webkit-outer-spin-button,
          /deep/ input::-webkit-inner-spin-button {
            -webkit-appearance: none;
          }
          /deep/ input[type="number"] {
            -moz-appearance: textfield;
          }
          .results{
            width:98%;
          }
          .upload{
            color:#66b1ff;
            display: block;
            line-height:40px;
            /deep/ .el-icon-close:before{
              content: "\E60F" !important;
            }
          }
          .select{
            width:100%;
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
          .selected{
            width:100%;
          }
          /deep/ .el-tabs__nav-wrap{
            margin-bottom:0px;
          }
          /deep/ .el-tabs--card>.el-tabs__header{
            border:none;
          }
          /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
            border-bottom:1px solid #ccc;
          }
          .customer{
            float:left;
            margin-right:10px;
            margin-bottom:10px;
            .customers{
              color:#606266;
              font-size:14px;
            }
            /deep/ .el-icon-close:before{
              content:"\E60F"
            }
          }
        }
      }
    }
    .epr{
      /deep/ .el-icon-close:before{
        content:''
      }
      /deep/ .el-dialog__header{
        padding:0px;
      }
      /deep/ .el-dialog__body{
        padding:0px;
        width:100%;
        height:100%;
        .icons{
          width:100%;
          height:40px;
          background:#ccc;
          .title{
            font-size:16px;
            line-height:40px;
            margin-left:15px;
          }
          .close{
            color:#409EFF;
            float:right;
            margin-right:20px;
          }
        }
        .history{
          width:100%;
          height:400px;
          position:relative;
          .images{
            width:100%;
            height:100%;
          }
          .spans{
            font-size:20px;
            position:absolute;
            top:40%;
            left:40%;
          }
          p{
            font-size:18px;
            text-align: center;
          }
          .cont{
            width:96%;
            margin:0 auto;
            .cont-up{
              width:100%;
              .hospital{
                width:33.33%;
                display:block;
                float:left;
                margin-bottom:20px;
              }
            }
            .cont-down{
              width:100%;
              .date{
                width:100%;
                display:block;
                margin-top:20px;
              }
            }
            .cont-foot{
              width:100%;
              height:50px;
              margin-top:20px;
              .doctors{
                float:right;
                margin-right:100px;
              }
            }
          }
        }
      }
    }
  }
  .editAdd{
    width:100%;
    padding:10px;
    .btns{
      background:#ccc;
      height:40px;
      span{
        margin-left:20px;
        line-height:40px;
      }
      .close{
        float:right;
        height:36px;
        margin:2px 20px 0px 0px;
      }
    }
    .name{
      width:100%;
      margin-top:10px;
      position:relative;
      .model{
        margin:0 20px;
      }
      .types{
        position:absolute;
        top:0%;
        left:31%;
        .left{
          .spans{
            margin-right:20px;
          }
        }
      }
    }
    .formulate{
      width:100%;
      .formulate-left{
        float:left;
      }
      .formulate-center{
        float:left;
      }
    }
    /deep/ .el-form-item{
      float:left;
    }
    .formulate-right{
      width:100%;
    }
    .formulate-label{
      width:100%;
      /deep/ .el-tag{
        height:40px;
        line-height: 40px;
        margin-left:5px;
      }
    }
    .formulate-select{
      margin-bottom:0px;
      /deep/ .el-icon-close:before {
        content: "\E60F";
      }
      /deep/ .el-tag--info{
        margin-left:5px;
      }
      .customer{
        float:left;
        margin-right:10px;
        margin-bottom:10px;
        .customers{
          color:#606266;
          font-size:14px;
        }
      }
    }
    .lines{
      width:2px;
      height:39px;
      background:#ccc;
      display:block;
      float:left;
      margin:0px 20px;
    }
    .all{
      float:left;
    }
    .customerType{
      width:100%;
    }
    .customerLabel{
      width:100%;
    }
    .customer{
      float:left;
      margin-right:10px;
      margin-bottom:10px;
      .customers{
        color:#606266;
        font-size:14px;
      }
    }
    /deep/ .el-tabs--card>.el-tabs__header{
      border:none;
      margin-left:100px;
    }
    /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
      border-bottom:1px solid #ccc;
    }
    /deep/ .el-checkbox__inner{
      width:35px;
      height:35px;
    }
    /deep/ .el-checkbox__inner::after{
      width:10px;
      height:20px;
      left:12px;
      top:2px;
    }
    /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
      border:1px solid #409eff;
      margin-left: 10px;
      line-height: 34px;
      font-size: 14px;
      width: 120px;
      text-align: center;
    }
    /deep/ .el-checkbox__label{
      margin-left: 10px;
      line-height: 34px;
      font-size: 14px;
      width: 120px;
      text-align: center;
    }
    .mode{
      width:100%;
      float:left;
      padding:0 30px;
      p{
        font-size:18px;
        color:#606266;
      };
      span{
        margin-right:10px;
        font-size:14px;
        color:#606266
      }
      /deep/ .el-textarea{
        width:50%;
        vertical-align: top;
      }
      .lists{
        display:inline-block;
        li{
          list-style: none;
          span{
            color:#66b1ff;
          }
        }
      }
      .send{
        margin-top:10px;
      }
      .starts{
        width:100%;
        height:100%;
        /deep/ .el-radio+.el-radio{
          margin-left:28px;
        }
        /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
          width:200px;
        }
        /deep/ .el-date-editor .el-range-separator{
          width:10%;
        }
        .sendTime{
          margin-top:10px;
          text-align: left;
          float:left;
        }
        .sends{
          margin:10px 10px 0px 10px;
          float:left;
        }
        .start {
          margin-top:10px;
          float:left;
          /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width:280px;
          }
        }
        /deep/ .el-form-item__label{
          text-align: left;
        }
      }
    }
    .footer{
      width:100%;
      float:left;
      margin-top:20px;
      .footer-up{
        background:#ccc;
        height:40px;
        .left{
          float:left;
          span{
            display: block;
            line-height:40px;
            margin-left:20px;
            font-weight:bold;
          }
        }
        .right{
          float:right;
          margin-right:10px;
          line-height:40px;
        }
      }
    }
  }
</style>
