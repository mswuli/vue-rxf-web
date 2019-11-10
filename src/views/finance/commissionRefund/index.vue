<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="申诉退款" name="appeal">
          <div class="nav">
            <p>处方信息</p>
          </div>
          <el-form :inline="true" ref="mObject" :model="mObject.prescription" class="demoInline " label-width="100px"
                   :rules="rules">
            <el-form-item label="处方编码：" prop="prescriptionCode">
              <el-input v-model.number="mObject.prescription.prescriptionCode"></el-input>
            </el-form-item>
            <el-form-item label="提取码：" prop="prescriptionPickCode">
              <el-input v-model="mObject.prescription.prescriptionPickCode"></el-input>
              <!--<el-input-number v-model="mObject.prescription.prescriptionPickCode"  :min="0" :controls="false" ></el-input-number>-->
            </el-form-item>
            <el-form-item label="支付单号：" prop="prescriptionOrderPaySerial">
              <el-input v-model="mObject.prescription.prescriptionOrderPaySerial"></el-input>
            </el-form-item>
            <el-form-item label="处方金额：" prop="prescriptionCash">
              <el-input v-model.number="mObject.prescription.prescriptionCash"></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="contactMan">
              <el-input v-model="mObject.prescription.contactMan"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" prop="contactWay">
              <el-input v-model.number="mObject.prescription.contactWay"></el-input>
            </el-form-item>
          </el-form>
          <div class="reason">
            <p>退款原因</p>
          </div>
          <div class="doubleSelect">
            <el-form :rules="rule" ref="form" :model="reason">
              <el-form-item prop="refundReason">
                <el-radio-group v-model="reason.refundReason">
                  <el-radio  v-for="item in refund.data" :key="item.code" :label="item.code">{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="refund">
            <el-form :inline="true" :model.number="mObject.prescription" class="demoInline" label-width="100px"
                     :rules="rules">
              <el-form-item label="退款金额：" prop="refundCash">
                <el-input v-model.number="mObject.prescription.refundCash"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="refundSpeak">
            <p>退款说明</p>
          </div>
          <el-form :inline="true" class="demoInline">
            <el-input type="textarea" v-model="refundDescription" class="selecting" placeholder="选填："></el-input>
            <el-form-item>
              <el-button type="primary" @click="refundSubmit" class="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="申诉列表" name="appealList" @click="getRefundQuery">
          <el-table
            :data="appealList.data"
            border
            v-loading="appealListLoading"
            style="width: 100%">
            <el-table-column
              prop="prescriptionCode"
              label="处方编码"
              width="180">
            </el-table-column>
            <el-table-column
              prop="prescriptionOrderPaySerial"
              label="支付单号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="prescriptionCash"
              label="处方金额"
              width="100">
            </el-table-column>
            <el-table-column
              prop="refundReasonName"
              label="退款原因">
            </el-table-column>
            <el-table-column
              prop="refundCash"
              label="退款金额"
              width="100">
            </el-table-column>
            <el-table-column
              prop="appealTime"
              label="申诉时间">
              <template slot-scope="scope">
                {{scope.row.appealTime | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column
              prop="appealStatusName"
              label="申诉状态">
            </el-table-column>
            <el-table-column
              prop="refundStatusName"
              label="审核状态">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="check(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="appealList.total">
            </el-pagination>
          </div>
          <el-dialog
            title="查看详情"
            :visible.sync="queryDialogVisible"
            width="60%"
            v-loading="queryCheckLoading"
          >
            <div class="topCheck">
              <p>申诉进度</p>
              <div class="topChecking">
                <div>申诉时间：<span>{{detailRow.appealTime | dateFormat}}</span></div>
                <div>申诉状态：<span>{{detailRow.appealStatusName}}</span></div>
                <div>审核状态：<span>{{detailRow.refundStatusName}}</span></div>
                <div>拒绝原因：<span>{{detailRow.handSuggestion}}</span></div>
              </div>
            </div>
            <div class="main">
              <p>处方信息</p>
              <div class="checkListing">
                <div>处方编号：<span>{{detailRow.prescriptionCode}}</span></div>
                <div>提取码：<span>{{detailRow.prescriptionPickCode}}</span></div>
                <div>支付单号：<span>{{detailRow.prescriptionOrderPaySerial}}</span></div>
                <div>处方金额：<span>{{detailRow.prescriptionCash}}</span></div>
                <div>联系人：<span>{{detailRow.contactMan}}</span></div>
                <div>联系方式：<span>{{detailRow.contactWay}}</span></div>
              </div>
              <p>退款原因</p>
              <div class="refundReason">
                <span>{{detailRow.refundReasonName}}</span>
              </div>
              <div class="refundAccount">
                <div>退款金额：<span>{{detailRow.refundCash}}</span></div>
              </div>
              <div class="refundAccount">
                <div>退款说明：<span class="refunding">{{detailRow.refundDescription}}</span></div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="queryDialogVisible = false">关 闭</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  let validcode = (rule,value,callback)=>{
    let reg = /^\d{19}$/
      if(!reg.test(value)){
      callback(new Error('请输入合法的数字单号'))
    }else{
      callback()
    }
  },
    validnumber = (rule,value,callback)=>{
    let reg = /^(0|[1-9][0-9]*)$/
    if(!reg.test(value)){
      callback(new Error('请输入合法的提取单号'))
    }else{
      callback()
    }
  }
  export default {
    data() {
      return {
        activeName: 'appeal',
        reason: {},
        mObject: {
          prescription: {}
        },
        detailRow: {},
        param: {
          page: 1,
          limit: 10,
          searchCondition: {}
        },
        appealListLoading: false,
        refundDescription: null,
        queryDialogVisible: false,
        queryCheckLoading: false,
        rules: {
          prescriptionCode: [
            { required: true, message: '请输入处方编码', trigger: 'blur' },
            { type: 'number', message: '输入处方编号为数字' }
          ],
          prescriptionPickCode: [
            { required: true, message: '请输入提取码', trigger: 'blur' },
            // { validator:validnumber, message: '输入提取码为数字' }
          ],
          prescriptionCash: [
            { required: true, message: '请输入处方金额', trigger: 'blur' },
            { type: 'number', message: '输入处方金额为数字' }
          ],
          prescriptionOrderPaySerial: [
            { required: true, message: '请输入支付单号', trigger: 'blur' },
            {validator:validcode,trigger:'blur'}
          ],
          contactMan: [
            { required: true, message: '请输入联系人', trigger: 'blur' }
          ],
          contactWay: [
            { required: true, message: '请输入11位手机号', trigger: 'blur' },
            { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
          ],
          refundCash: [
            { required: true, message: '请输入退款金额', trigger: 'blur' },
            { type: 'number', message: '退款金额为数字值' }
          ]
        },
        rule: {
          refundReason: [
            { required: true, message: '请选择退款原因', trigger: 'change' }
          ]
        }
      }
    },
    computed: mapState({
      appealList: state => state.pharmacy.appealList,
      refund: state => state.pharmacy.refund
    }),
    created() {
      this.getRefundQuery()
      this.getRefund()
    },
    methods: {
      handleClick(tab, event) {
        this.appealList.data = null
        if (tab.name === 'appealList') {
          this.appealListLoading = true
          this.getRefundQuery()
        }
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getRefundQuery()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getRefundQuery()
      },
      refundSubmit() {

        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$refs['mObject'].validate(valid => {
              if (valid) {
                let object = {
                  prescriptionCode: this.mObject.prescription.prescriptionCode,
                  prescriptionPickCode: this.mObject.prescription.prescriptionPickCode,
                  prescriptionOrderPaySerial: this.mObject.prescription.prescriptionOrderPaySerial,
                  prescriptionCash: this.mObject.prescription.prescriptionCash,
                  contactMan: this.mObject.prescription.contactMan,
                  contactWay: this.mObject.prescription.contactWay,
                  refundCash: this.mObject.prescription.refundCash,
                  refundReason: this.reason.refundReason,
                  refundDescription: this.refundDescription
                }
                // console.log(object,4444)
                this.$store.dispatch('appealRefund', {
                  params: object,
                  callback: () => {
                  }
                })
                // this.$refs.mObject.resetFields();
                // this.$refs.form.resetFields();
                this.refundDescription = null
                this.mObject.prescription = {}
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
              }
            })
          }

        })
      },
      getRefundQuery() {
        this.appealListLoading = true
        this.$store.dispatch('refundQuery', {
          params: this.param,
          callback: () => {
            this.appealListLoading = false
          }
        })
      },
      getRefund() {
        this.$store.dispatch('refund', {
          params: this.param,
          callback: () => {
          }
        })
      },
      check(row) {
        console.log(row)
        this.detailRow = Object.assign({}, row)
        this.queryDialogVisible = true
      }
    }
  }
</script>

<style scoped>
  .nav {
    border-bottom: 2px solid #eee;
  }

  .nav p {
    font-weight: bold;
  }

  .demoInline {
    margin-top: 20px;
  }

  .reason {
    border-bottom: 2px solid #eee;
    border-top: 2px solid #eee;
  }

  .reason p {
    font-weight: bold;
  }

  .doubleSelect {
    margin-bottom: 20px;
  }

  .doubleSelect >>> .el-form {
    padding-left: 20px;
    margin-top: 20px;
  }

  .select p {
    float: left;
  }

  .select .check {
    margin-left: 40px;
    margin-top: 18px;
    float: left;
  }

  .selects p {
    float: left;
    margin-left: 80px;
  }

  .selects .checks {
    margin-left: 40px;
    margin-top: 18px;
  }

  .refund {
    border-top: 2px solid #eee;
  }

  .refundSpeak {
    border-bottom: 2px solid #eee;
    border-top: 2px solid #eee;
  }

  .refundSpeak p {
    font-weight: bold;
  }

  .selecting {
    width: 30%;
    display: block;
    margin-left: 20px;
  }

  .submit {
    margin-top: 10px;
    margin-left: 316px;
  }

  .main {
    border-top: 2px solid lightgray;
    border-bottom: 2px solid lightgray;
  }

  p {
    font-weight: bold;
    color: black;
  }

  .checkListing div {
    width: 29%;
    display: inline-block;
    margin: 5px 0 5px 20px;
  }

  .refundReason span {
    margin-left: 30px;
  }

  .refundAccount div {
    color: black;
    margin-top: 14px;
    margin-bottom: 30px;
    font-weight: bold;
  }

  .refundAccount span {
    font-weight: normal;
    color: red;
  }
  .refundAccount .refunding{
    color:black;
  }

  .topChecking {
    border-top: 2px solid lightgray;
  }

  .topChecking div {
    margin: 5px 0 5px 30px;
  }
</style>
