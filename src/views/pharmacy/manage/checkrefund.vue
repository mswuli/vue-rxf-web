<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="待处理" name="appealing">
          <el-date-picker
            v-model="appealDate"
            type="daterange"
            style="width:240px;"
            start-placeholder="申诉日期"
            end-placeholder="申诉日期">
          </el-date-picker>
          <el-time-picker
            is-range
            style="width:240px;"
            v-model="appealTime"
            range-separator="-"
            start-placeholder="申诉时间"
            end-placeholder="申诉时间"
            placeholder="选择时间范围">
          </el-time-picker>
          <el-select v-model="param.searchCondition.pharmacyId" placeholder="申诉药店">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="item in appealRefundPharmacyList.data"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
          <el-button class="filter-item" @click="appealingRefundSearch()" type="primary" icon="el-icon-search">搜索
          </el-button>
          <el-button class="filter-item" @click="appealingRefundResetSearch()" type="danger" icon="el-icon-refresh">重置
          </el-button>
          <el-table
            @selection-change="handleSelectionChange"
            :data="appealRefundList.data"
            v-loading="appealingRefundListLoading"
            class="Listing"
            border
            style="width: 100%">
            <el-table-column prop="prescriptionCode" width="100" label="处方编码"></el-table-column>
            <el-table-column prop="prescriptionCash" label="处方金额"></el-table-column>
            <el-table-column prop="prescriptionOrderPaySerial" label="支付单号"></el-table-column>
            <el-table-column prop="refundReasonName" label="退款原因"></el-table-column>
            <el-table-column prop="refundCash" label="退款金额"></el-table-column>
            <el-table-column prop="appealTime" label="申诉时间">
              <template slot-scope="scope">
                {{scope.row.appealTime | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column prop="pharmacyName" label="申诉药店"></el-table-column>
            <!--<el-table-column prop="pharmacyName" label="处方提取记录"></el-table-column>-->
            <el-table-column label="操作" fixed="right" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="detail(scope.row)">查看处方</el-button>
                <el-button type="primary" size="mini" @click="check(scope.row)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="param.page" :page-sizes="[10,20,30, 50]"
                           :page-size="param.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="appealRefundList.total">
            </el-pagination>
          </div>
          <el-dialog
            class="cf-dialog"
            title="收银台"
            width="1000px"
            :close-on-click-modal=false
            :visible.sync="detailDialogVisible"
            v-loading="detailPrescriptionDetailLoading">
            <div class="clearfix">
              <div class="cfj">
                <h4 class="m-title">处方笺信息</h4>
                <div class="cfj-tit">
                  <div class="t1"><span id="detail_hospital_name">{{ prescriptionCheckDetail.hospital.name }}</span>
                  </div>
                  <div class="t2">（<span
                    id="detail_hospital_shortName">{{ prescriptionCheckDetail.hospital.shortName }}</span>）
                  </div>
                  <div class="t3">处方笺</div>
                </div>
                <div class="cfj-cont">
                  <div class="clearfix cf-info">
                    <div class="item item2">姓名：<span
                      id="detail_patient_name">{{prescriptionCheckDetail.patient.name }}</span>
                    </div>
                    <div class="item item2">性别:<span
                      id="detail_patient_sexName">{{ prescriptionCheckDetail.patient.sexName }}</span></div>
                    <div class="item item2">年龄：<span
                      id="detail_patient_age">{{ prescriptionCheckDetail.patient.age }}</span></div>
                    <div class="item item2">手机号：<span
                      id="detail_patient_tel">{{ prescriptionCheckDetail.patient.tel }}</span>
                    </div>
                    <div class="item">处方编号：{{ prescriptionCheckDetail.prescription.code }}</div>
                    <div class="item">身份证号：<span
                      id="detail_patient_idCard">{{ prescriptionCheckDetail.patient.idCard }}</span>
                    </div>
                    <div class="item">病情诊断：<span id="detail_prescription_tentativeDiagnosis">{{ prescriptionCheckDetail.prescription.tentativeDiagnosis }}</span>
                    </div>
                    <div class="item">处方日期：<span id="detail_prescription_prescriptionTime">{{ prescriptionCheckDetail.prescription.prescriptionTime | dateFormat }}</span>
                    </div>
                  </div>
                  <div class="rp-info">
                    <div class="t">Rp:</div>
                    <div class="rp-list" id="detail_prescription_item">
                      <div class="item" v-for="item in prescriptionCheckDetail.itemList" v-bind:key="item.id">
                        <div class="name clearfix">
                          <div class="pull-left">{{ item.skuName }} {{ item.specifications }}</div>
                          <div class="pull-right">数量：{{ item.numTotal }}{{ item.unit }}</div>
                        </div>
                        <div class="des">
                          <span>{{ item.usage }}</span><span>{{ item.frequency }}</span><span>{{ item.num }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="other-info">
                    补充说明：<br>
                    医师签名：<span
                    id="detail_prescription_docName">{{ prescriptionCheckDetail.prescription.docName }}</span><br>
                    诊查费（平台代收）：<span
                    id="detail_prescription_docName">{{ prescriptionCheckDetail.prescription.diagnosticAmount }}元</span><br>
                    审方药师：<span
                    id="detail_prescription_docName">{{ prescriptionCheckDetail.dosageOperatorName }}</span><br>
                    收银员：<span id="detail_prescription_docName">{{ prescriptionCheckDetail.payOperatorName }}</span><br>
                    发药员：<span id="detail_prescription_docName">{{ prescriptionCheckDetail.deliverOperatorName }}</span>
                  </div>
                </div>
              </div>
              <div class="work">
                <h4 class="m-title">处方工作台</h4>
                <div class="common tq">
                  <div class="tit">
                    <h4>提取</h4>
                    <div class="date">{{ prescriptionCheckDetail.pickTime | dateFormat }}</div>
                  </div>
                  <div class="con">
                    <table style="width: 100%">
                      <tr>
                        <td>处方单号：{{ prescriptionCheckDetail.prescription.code }}</td>
                        <td>提取码: {{ prescriptionCheckDetail.pickCode }}</td>
                        <td>操作人:{{ prescriptionCheckDetail.pickOperatorName }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="common tq">
                  <div class="tit">
                    <h4>处方清单</h4>
                    <div class="date">{{ prescriptionCheckDetail.dosageTime | dateFormat }}</div>
                  </div>
                  <div class="con">
                    <el-table
                      :data="prescriptionCheckDetail.pharmacyPrescriptionItemList"
                      border
                      style="width: 100%">
                      <el-table-column prop="name" label="药品名称"></el-table-column>
                      <el-table-column prop="specifications" width="50" label="规格"></el-table-column>
                      <el-table-column prop="numTotal" width="40" label="数量"></el-table-column>
                      <el-table-column prop="unit" width="50" label="单位"></el-table-column>
                      <el-table-column prop="hspSkuSpec" width="100" label="医院规格"></el-table-column>
                      <el-table-column prop="store" width="60" label="库存"></el-table-column>
                      <el-table-column prop="tinyStore" width="60" label="散装库存"></el-table-column>
                      <el-table-column prop="price" width="80" label="总价（元）"></el-table-column>
                      <el-table-column prop="goodsBarcode" label="药品编码"></el-table-column>
                    </el-table>
                    <div class="foo">
                      <table style="width: 100%">.
                        <tr>
                          <td>药品总金额：<strong>{{ prescriptionCheckDetail.prescriptionOrder.drugAmount }}元</strong></td>
                          <td>审方药师: {{ prescriptionCheckDetail.dosageOperatorName }}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="common hf">
                  <div class="tit">
                    <h4>收银</h4>
                    <div class="date">{{ prescriptionCheckDetail.prescriptionOrder.payTime | dateFormat }}</div>
                  </div>
                  <div class="con">
                    <table style="width: 100%">
                      <tr>
                        <td>药品总金额：{{ prescriptionCheckDetail.prescriptionOrder.drugAmount }}元</td>
                        <td>诊查费（平台代收）：{{ prescriptionCheckDetail.prescriptionOrder.diagnosticAmount }}元</td>
                        <td>处方总金额：{{ prescriptionCheckDetail.prescriptionOrder.totalAmount }}元</td>
                      </tr>
                      <tr>
                        <td>支付方式: {{ prescriptionCheckDetail.prescriptionOrder.paymentTypeName }}</td>
                        <td>应付金额：{{ prescriptionCheckDetail.prescriptionOrder.totalAmount }}元</td>
                        <td>合计金额：{{ prescriptionCheckDetail.prescriptionOrder.finalAmount }}元</td>
                      </tr>
                      <tr>
                        <td>支付单号: {{ prescriptionCheckDetail.prescriptionOrder.id }}</td>
                        <td>支付日期: {{ prescriptionCheckDetail.prescriptionOrder.payTime | dateFormat }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="detailDialogVisible = false">关闭</el-button>
            </div>
          </el-dialog>
          <el-dialog
            title="申诉详情"
            :visible.sync="dialogVisible"
            width="60%"
            v-loading="checkLoading"
          >
            <div class="main">
              <p>处方信息</p>
              <div class="checkListing">
                <div>处方编号：<span>{{mObject.prescriptionCode}}</span></div>
                <div>提取码：<span>{{mObject.prescriptionPickCode}}</span></div>
                <div>支付单号：<span>{{mObject.prescriptionOrderPaySerial}}</span></div>
                <div>处方金额：<span>{{mObject.prescriptionCash}}</span></div>
                <div>联系人：<span>{{mObject.contactMan}}</span></div>
                <div>联系方式：<span>{{mObject.contactWay}}</span></div>
              </div>
              <p>退款原因</p>
              <div class="refundReason">
                <span>{{mObject.refundReasonName}}</span>
              </div>
              <div class="refundAccount">
                <div>退款金额：<span>{{mObject.refundCash}}</span></div>
              </div>
              <div class="refundAccount">
                <div>退款说明：<span class="refunding">{{mObject.refundDescription}}</span></div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="agreeAppealRefund">同意</el-button>
              <el-button type="danger" @click="reject()">拒绝</el-button>
              <el-button @click="dialogVisible = false">关 闭</el-button>
            </div>
            <el-dialog
              class="rejecting"
              title="拒绝原因"
              :visible.sync="rejectDialogVisible"
              width="30%"
              :modal="false"
            >
              <div class="rejectReasoning">
                <el-radio v-model="rejectReason" v-for="item in getReject.data" :key="item.code" :label="item.code">
                  {{item.name}}
                </el-radio>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="sure">确定</el-button>
                <el-button @click="rejectDialogVisible = false">取消</el-button>
              </div>
            </el-dialog>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="已处理" name="finished">
          <el-date-picker
            v-model="appealDate"
            type="daterange"
            style="width:240px;"
            start-placeholder="申诉日期"
            end-placeholder="申诉日期">
          </el-date-picker>
          <el-time-picker
            is-range
            style="width:240px;"
            v-model="appealTime"
            range-separator="-"
            start-placeholder="申诉时间"
            end-placeholder="申诉时间"
            placeholder="选择时间范围">
          </el-time-picker>
          <el-select v-model="param.searchCondition.pharmacyId" placeholder="申诉药店">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="item in appealRefundPharmacyList.data"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
          <el-button class="filter-item" @click="appealFinishedRefundSearch()" type="primary" icon="el-icon-search">搜索
          </el-button>
          <el-button class="filter-item" @click="appealFinishedRefundResetSearch()" type="danger"
                     icon="el-icon-refresh">
            重置
          </el-button>
          <el-table
            @selection-change="handleSelectionChangeAppealFinishedRefund"
            :data="appealRefundList.data"
            v-loading="appealFinishRefundListLoading"
            class="Listing"
            border
            style="width: 100%"
          >
            <el-table-column prop="prescriptionCode" width="100" label="处方编码"></el-table-column>
            <el-table-column prop="prescriptionCash" label="处方金额"></el-table-column>
            <el-table-column prop="prescriptionOrderPaySerial" label="支付单号"></el-table-column>
            <el-table-column prop="refundReasonName" label="退款原因"></el-table-column>
            <el-table-column prop="refundCash" label="退款金额" width="80"></el-table-column>
            <el-table-column prop="appealTime" label="申诉时间" width="160">
              <template slot-scope="scope">
                {{scope.row.appealTime | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column prop="pharmacyName" label="申诉药店"></el-table-column>
            <el-table-column prop="refundStatusName" label="审核状态"></el-table-column>
            <el-table-column prop="handTime" label="处理时间" width="160">
              <template slot-scope="scope">
                {{scope.row.handTime | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="finishDetail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChangeAppealFinishedRefund"
                           @current-change="handleCurrentChangeAppealFinishedRefund"
                           :current-page="param.page" :page-sizes="[10,20,30, 50]"
                           :page-size="param.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="appealRefundList.total">
            </el-pagination>
          </div>
          <el-dialog
            title="查看详情"
            :visible.sync="queryDialogVisible"
            width="60%"
            v-loading="queryCheckLoading"
          >
            <div class="topCheck">
              <p>审核进度</p>
              <div class="topChecking">
                <div>审核时间：<span>{{mObject.handTime | dateFormat}}</span></div>
                <div>审核状态：<span>{{mObject.refundStatusName}}</span></div>
                <div>拒绝原因：<span>{{mObject.handSuggestionName}}</span></div>
              </div>
            </div>
            <div class="main">
              <p>处方信息</p>
              <div class="checkListing">
                <div>处方编号：<span>{{mObject.prescriptionCode}}</span></div>
                <div>提取码：<span>{{mObject.prescriptionPickCode}}</span></div>
                <div>支付单号：<span>{{mObject.prescriptionOrderPaySerial}}</span></div>
                <div>处方金额：<span>{{mObject.prescriptionCash}}</span></div>
                <div>联系人：<span>{{mObject.contactMan}}</span></div>
                <div>联系方式：<span>{{mObject.contactWay}}</span></div>
              </div>
              <p>退款原因</p>
              <div class="refundReason">
                <span>{{mObject.refundReasonName}}</span>
              </div>
              <div class="refundAccount">
                <div>退款金额：<span>{{mObject.refundCash}}</span></div>
              </div>
              <div class="refundAccount">
                <div>退款说明：<span class="refunding">{{mObject.refundDescription}}</span></div>
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

<style lang="scss" scoped>
  .Listing {
    margin-top: 20px;
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
    margin: 5px 0 5px 30px;
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

  .rejecting {
    margin-top: 15vh;
    margin-left: 70vh;
  }

  .rejectReasoning .el-radio {
    margin: 10px 0 10px 10px;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'

  export default {
    data() {
      return {
        activeName: 'appealing',
        mObject: {},
        appealDate: '',
        appealTime: '',
        param: {
          page: 1,
          limit: 10,
          searchCondition: {}
        },
        pharmacyAppeal: {},
        appealingRefundListLoading: false,
        appealFinishRefundListLoading: false,
        dialogVisible: false,
        checkLoading: false,
        queryDialogVisible: false,
        queryCheckLoading: false,
        rejectDialogVisible: false,
        detailDialogVisible: false,
        detailPrescriptionDetailLoading: false,
        rejectReason: null,
        prescriptionCheckDetail: {
          hospital: {},
          prescriptionOrder: {},
          prescription: {},
          patient: {},
          itemList: [],
          pharmacyPrescriptionItemList: []
        }
      }
    },
    computed: mapState({
      appealRefundList: state => state.appealRefund.appealRefundList,
      // appealRefundList: state => state.pharmacy.appealList,
      appealRefundPharmacyList: state => state.appealRefund.appealRefundPharmacyList,
      // prescriptionItems: state => state.prescription.prescriptionItems,
      appealRefund: state => state.financeIncome.appealRefund,
      appealNoRefund: state => state.financeIncome.appealNoRefund,
      getReject: state => state.financeIncome.getReject
    }),
    created() {
      this.getAppealRefundList('APPEALING')
      this.getAppealRefundPharmacyList()
      this.reject()
    },
    methods: {
      getAppealRefundList(refundType) {
        this.param.searchCondition.appealStatus = refundType
        this.appealingRefundListLoading = true
        this.$store.dispatch('getAppealRefundList', {
          params: this.param,
          callback: () => {
            // console.log(this.appealRefundList)
            this.appealingRefundListLoading = false
          }
        })
      },
      // getAppealRefundList(refundType) {
        // this.param.searchCondition.appealStatus = refundType
        // this.appealingRefundListLoading = true
        // this.$store.dispatch('refundQuery', {
          // params: this.param,
          // callback: () => {
            // console.log(this.appealRefundList)
            // this.appealingRefundListLoading = false
          // }
        // })
      // },
      getAppealRefundPharmacyList() {
        this.$store.dispatch('getAppealRefundPharmacyList', {
          callback: () => {
          }
        })
      },
      /**
       * 切换tab
       * @param tab
       * @param event
       */
      handleClick(tab, event) {
        this.param.searchCondition.pharmacyId = null
        this.appealRefundList.data = null
        if (tab.name === 'appealing') {
          // 待处理
          this.getAppealRefundList('APPEALING')
        } else {
          // 已处理
          this.getAppealRefundList('FINISHED')
        }
      },
      /**
       * 申诉中列表查询
       */
      appealingRefundSearch() {
        this.param.page = 1
        this.param.searchCondition.startTime = null
        this.param.searchCondition.endTime = null
        if (this.appealDate && !this.appealTime) {
          this.param.searchCondition.startTime =
            moment(this.appealDate[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.param.searchCondition.endTime =
            moment(this.appealDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
        } else if (!this.appealDate && this.appealTime) {
          const date = moment(new Date()).format('YYYY-MM-DD')

          this.param.searchCondition.startTime =
            date + ' ' + moment(this.appealTime[0]).format('HH:mm:ss')

          this.param.searchCondition.endTime =
            date + ' ' + moment(this.appealTime[1]).format('HH:mm:ss')
        } else if (this.appealDate && this.appealTime) {
          this.param.searchCondition.startTime =
            moment(this.appealDate[0]).format('YYYY-MM-DD') +
            ' ' +
            moment(this.appealTime[0]).format('HH:mm:ss')
          this.param.searchCondition.endTime =
            moment(this.appealDate[1]).format('YYYY-MM-DD') +
            ' ' +
            moment(this.appealTime[1]).format('HH:mm:ss')
        }
        this.getAppealRefundList('APPEALING')
      },
      appealingRefundResetSearch() {
        this.appealDate = null
        this.appealTime = null
        this.param.searchCondition.startTime = null
        this.param.searchCondition.endTime = null
        this.getAppealRefundList('APPEALING')
      },

      /**
       * 已申诉列表查询
       */
      appealFinishedRefundSearch() {
        this.param.page = 1
        this.param.searchCondition.startTime = null
        this.param.searchCondition.endTime = null
        if (this.appealDate && !this.appealTime) {
          this.param.searchCondition.startTime =
            moment(this.appealDate[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.param.searchCondition.endTime =
            moment(this.appealDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
        } else if (!this.appealDate && this.appealTime) {
          const date = moment(new Date()).format('YYYY-MM-DD')

          this.param.searchCondition.startTime =
            date + ' ' + moment(this.appealTime[0]).format('HH:mm:ss')

          this.param.searchCondition.endTime =
            date + ' ' + moment(this.appealTime[1]).format('HH:mm:ss')
        } else if (this.appealDate && this.appealTime) {
          this.param.searchCondition.startTime =
            moment(this.appealDate[0]).format('YYYY-MM-DD') +
            ' ' +
            moment(this.appealTime[0]).format('HH:mm:ss')
          this.param.searchCondition.endTime =
            moment(this.appealDate[1]).format('YYYY-MM-DD') +
            ' ' +
            moment(this.appealTime[1]).format('HH:mm:ss')
        }
        this.getAppealRefundList('FINISHED')
      },
      appealFinishedRefundResetSearch() {
        this.appealDate = null
        this.appealTime = null
        this.param.searchCondition.startTime = null
        this.param.searchCondition.endTime = null
        this.getAppealRefundList('FINISHED')
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getAppealRefundList('APPEALING')
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getAppealRefundList('APPEALING')
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      handleSizeChangeAppealFinishedRefund(size) {
        this.param.limit = size
        this.getAppealRefundList('FINISHED')
      },
      handleCurrentChangeAppealFinishedRefund(page) {
        this.param.page = page
        this.getAppealRefundList('FINISHED')
      },
      handleSelectionChangeAppealFinishedRefund(val) {
        this.selectedRows = val
      },
      detail(row) {
        // const params = {
        //   pharmacyId: row.pharmacyId,
        //   prescriptionCode: row.prescriptionCode,
        //   prescriptionPickCode: row.prescriptionPickCode
        // }
        console.log(row,555)
        this.$store.dispatch('getPrescriptionCheckDetail', {
          id: row.id
        }).then(response => {
          this.detailDialogVisible = true
          // console.log(response, 32333)
          this.prescriptionCheckDetail = Object.assign({}, response.data)
        })
      },
      check(row) {
        this.dialogVisible = true
        this.rejectDialogVisible = false
        // console.log(row,666)
        this.mObject = Object.assign({}, row)
      },
      agreeAppealRefund() {
        this.$confirm(
          '确认退款的总费用' + this.mObject.refundCash + '元？, 是否继续?',
          '',
          {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }
        ).then(response => {
          // todo 申诉退款接口
          // console.log(this.mObject.id);
          this.$store.dispatch('getAppealRefund', {
            id: this.mObject.id, callback: () => {
              this.dialogVisible = false
              // console.log(response)
              this.$message({
                type: 'success',
                message: '申诉退款成功!',
                duration: 3 * 1000
              })
              this.getAppealRefundList('APPEALING')
              // this.getAppealRefundList('FINISHED')
            }
          })
        })
      },
      reject() {
        this.rejectDialogVisible = true
        this.$store.dispatch('getReject', {
          callback: (response) => {
          }
        })

      },
      sure() {
        // console.log(this.mObject.id)
        if (!this.rejectReason) {
          return
        }
        this.$store.dispatch('getAppealNoRefund', {
          param: {
            appealRefundId: this.mObject.id,
            reason: this.rejectReason
          }, callback: () => {
            this.rejectDialogVisible = false
            this.dialogVisible = false
          }
        })

      },
      finishDetail(row) {
        console.log(row)
        this.mObject = Object.assign({}, row)
        this.queryDialogVisible = true
      }
    }
  }
</script>
