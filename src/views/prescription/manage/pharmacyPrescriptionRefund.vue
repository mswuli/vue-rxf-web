<template>
  <div class="app-container">
    <div class="filter-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="处方退款" name="first">
          <el-input v-model="id" style="width: 200px;" placeholder="请输入支付单号"
                    @keyup.enter.native="refundSearch"></el-input>
          <el-button type="primary" @click.native.prevent="refundSearch()">搜索</el-button>
        </el-tab-pane>
        <el-dialog
          class="cf-dialog"
          title="处方详情"
          width="1000px"
          :close-on-click-modal=false
          :visible.sync="refundDialogVisible"
          v-loading="prescriptionDetailLoading">
          <div class="clearfix">
            <!--处方笺-->
            <div class="cfj">
              <h4 class="m-title">处方笺信息</h4>
              <div class="cfj-tit">
                <div class="t1"><span>{{ prescriptionRefundDetail.hospital.name }}</span>
                </div>
                <div class="t2">（<span>{{ prescriptionRefundDetail.hospital.shortName }}</span>）
                </div>
                <div class="t3">处方笺</div>
              </div>
              <div class="cfj-cont">
                <div class="clearfix cf-info">
                  <div class="item item2">姓名：<span>{{prescriptionRefundDetail.patient.name }}</span>
                  </div>
                  <div class="item item2">性别:<span>{{ prescriptionRefundDetail.patient.sexName }}</span></div>
                  <div class="item item2">年龄：<span>{{ prescriptionRefundDetail.patient.age }}</span></div>
                  <div class="item item2">手机号：<span>{{ prescriptionRefundDetail.patient.tel }}</span>
                  </div>
                  <div class="item">处方编号：{{ prescriptionRefundDetail.prescription.code }}</div>
                  <div class="item">身份证号：<span>{{ prescriptionRefundDetail.patient.idCard }}</span>
                  </div>
                  <div class="item">病情诊断：<span>{{ prescriptionRefundDetail.prescription.tentativeDiagnosis }}</span>
                  </div>
                  <div class="item">
                    处方日期：<span>{{ prescriptionRefundDetail.prescription.prescriptionTime | dateFormat }}</span>
                  </div>
                </div>
                <div class="rp-info">
                  <div class="t">Rp:</div>
                  <div class="rp-list">
                    <div class="item" v-for="item in prescriptionRefundDetail.pharmacyPrescriptionItemList" v-bind:key="item.id">
                      <div class="name clearfix">
                        <div class="pull-left">{{item.medical ? '(医保)': ''}}{{ item.name }}{{ item.specifications }}</div>
                        <div class="pull-right">数量：{{ item.numTotal }}{{ item.unit }}</div>
                      </div>
                      <div class="des">
                        <span>{{ item.usage }}</span><span>{{ item.frequency }}</span><span>{{ item.num }}</span></div>
                    </div>
                  </div>
                </div>
                <div class="other-info">
                  补充说明：<br>
                  医师签名：<span>{{ prescriptionRefundDetail.prescription.docName }}</span><br>
                  诊查费（平台代收）：<span
                >{{ prescriptionRefundDetail.prescription.diagnosticAmount }}元</span><br>
                  审方药师：<span
                >{{ prescriptionRefundDetail.dosageOperatorName }}</span><br>
                  收银员：<span>{{ prescriptionRefundDetail.payOperatorName }}</span><br>
                  发药员：<span>{{ prescriptionRefundDetail.deliverOperatorName }}</span>
                </div>
              </div>
            </div>
            <!--处方工作台-->
            <div class="work">
              <h4 class="m-title">处方工作台</h4>
              <!--提取-->
              <div class="common tq">
                <div class="tit">
                  <h4>提取</h4>
                  <div class="date">{{ prescriptionRefundDetail.pickTime | dateFormat }}</div>
                </div>
                <div class="con">
                  <table style="width: 100%">
                    <tr>
                      <td>处方单号：{{ prescriptionRefundDetail.prescription.code }}</td>
                      <td>提取码: {{ prescriptionRefundDetail.pickCode }}</td>
                      <td>操作人:{{ prescriptionRefundDetail.pickOperatorName }}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <!--收银-->
              <div class="common hf">
                <div class="tit">
                  <h4>收银</h4>
                  <div class="date">{{ prescriptionRefundDetail.prescriptionOrder.payTime | dateFormat }}</div>
                </div>
                <div class="con">
                  <table style="width: 100%">
                    <tr>
                      <td>药品总金额：{{ prescriptionRefundDetail.prescriptionOrder.drugAmount }}元</td>
                      <td>诊查费（平台代收）：{{ prescriptionRefundDetail.prescriptionOrder.diagnosticAmount }}元</td>
                      <td>处方总金额：{{ prescriptionRefundDetail.prescriptionOrder.totalAmount }}元</td>
                    </tr>
                    <tr>
                      <td>支付单号: {{ prescriptionRefundDetail.prescriptionOrder.id }}</td>
                      <td>支付日期: {{ prescriptionRefundDetail.prescriptionOrder.payTime | dateFormat }}</td>
                      <td>合计金额：{{ prescriptionRefundDetail.prescriptionOrder.finalAmount }}元</td>
                    </tr>
                    <tr style="font-size: 18px">
                      <td>应付金额：{{ prescriptionRefundDetail.prescriptionOrder.totalAmount }}元</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;" v-if="prescriptionRefundDetail.prescriptionOrder.medicalAmount">医保:{{prescriptionRefundDetail.prescriptionOrder.medicalAmount}}元</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;">{{prescriptionRefundDetail.prescriptionOrder.paymentTypeName}}: {{ parseInt((prescriptionRefundDetail.prescriptionOrder.finalAmount - (prescriptionRefundDetail.prescriptionOrder.medicalAmount ? prescriptionRefundDetail.prescriptionOrder.medicalAmount : 0))*100)  /100 }}元</td>
                    </tr>
                    <tr>
                    <tr>
                      <td style="color: red">
                        {{ prescriptionRefundDetail.prescriptionOrder.couponAmount > 0 ? prescriptionRefundDetail.prescriptionOrder.memo : '' }}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <!--审方-->
              <div class="common tq">
                <div class="tit">
                  <h4>处方清单</h4>
                  <div class="date">{{ prescriptionRefundDetail.dosageTime | dateFormat }}</div>
                </div>
                <div class="con">
                  <el-table
                    :data="prescriptionRefundDetail.pharmacyPrescriptionItemList"
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
                        <td>药品总金额：<strong>{{ prescriptionRefundDetail.prescriptionOrder.drugAmount }}元</strong></td>
                        <td>审方药师: {{ prescriptionRefundDetail.dosageOperatorName }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="refund(prescriptionRefundDetail.prescriptionOrder.id,prescriptionRefundDetail.prescriptionOrder.finalAmount,prescriptionRefundDetail
                .prescriptionPickPharmId)">退款
            </el-button>
            <el-button @click="refundDialogVisible = false">取消</el-button>
          </div>
        </el-dialog>

        <el-tab-pane label="退款记录" name="second">
          <el-input style="width: 180px;" v-model="param.searchCondition.prescriptionOrderId" class="filter-item"
                    placeholder="支付单号" @keyup.enter.native="search"></el-input>
          <el-date-picker
            v-model="payDate"
            @keyup.enter.native="search"
            type="daterange"
            style="width:240px;"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-time-picker
            is-range
            style="width:240px;"
            v-model="payTime"
            @keyup.enter.native="search"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
          <el-select v-model="param.searchCondition.payType" placeholder="支付方式" @keyup.enter.native="search">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="item in payments"
                       :key="item.id"
                       :label="item.name"
                       :value="item.code"></el-option>
          </el-select>
          <el-button class="filter-item" @click.native.prevent="search()" type="primary" icon="el-icon-search">搜索
          </el-button>
          <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
          <!-- <el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button> -->
          <el-table
            @selection-change="handleSelectionChange"
            :data="prescriptions.data"
            v-loading="listLoading"
            class="tableListIng"
            border
            style="width: 100%"
          >
            <el-table-column prop="prescriptionOrderId" width="200" label="支付单号"></el-table-column>
            <el-table-column prop="code" label="处方编号"></el-table-column>
            <el-table-column prop="paymentTypeName" label="支付方式"></el-table-column>
            <el-table-column prop="totalAmount" label="应付金额(元）">
              <template slot-scope="scope">
                -{{scope.row.totalAmount}}
              </template>
            </el-table-column>
            <el-table-column prop="finalAmount" label="合计金额（元）">
              <template slot-scope="scope">
                -{{scope.row.finalAmount}}
              </template>
            </el-table-column>
            <el-table-column width="152" prop="payTime" label="支付时间">
              <template slot-scope="scope">
                {{scope.row.payTime | dateFormat}}
              </template>
            </el-table-column>
            <el-table-column prop="payOperatorName" label="收银员"></el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="detail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog
            class="cf-dialog"
            title="处方详情"
            width="1000px"
            :close-on-click-modal=false
            :visible.sync="dialogVisible"
            v-loading="prescriptionDetailLoading">
            <div class="clearfix">
              <!--处方笺-->
              <div class="cfj">
                <h4 class="m-title">处方笺信息</h4>
                <div class="cfj-tit">
                  <div class="t1"><span id="detail_hospital_name">{{ prescriptionRefundDetail.hospital.name }}</span>
                  </div>
                  <div class="t2">（<span id="detail_hospital_shortName">{{ prescriptionRefundDetail.hospital.shortName }}</span>）
                  </div>
                  <div class="t3">处方笺</div>
                </div>
                <div class="cfj-cont">
                  <div class="clearfix cf-info">
                    <div class="item item2">姓名：<span
                      id="detail_patient_name">{{prescriptionRefundDetail.patient.name }}</span>
                    </div>
                    <div class="item item2">性别:<span
                      id="detail_patient_sexName">{{ prescriptionRefundDetail.patient.sexName }}</span></div>
                    <div class="item item2">年龄：<span
                      id="detail_patient_age">{{ prescriptionRefundDetail.patient.age }}</span></div>
                    <div class="item item2">手机号：<span
                      id="detail_patient_tel">{{ prescriptionRefundDetail.patient.tel }}</span>
                    </div>
                    <div class="item">处方编号：{{ prescriptionRefundDetail.prescription.code }}</div>
                    <div class="item">身份证号：<span id="detail_patient_idCard">{{ prescriptionRefundDetail.patient.idCard }}</span>
                    </div>
                    <div class="item">病情诊断：<span id="detail_prescription_tentativeDiagnosis">{{ prescriptionRefundDetail.prescription.tentativeDiagnosis }}</span>
                    </div>
                    <div class="item">处方日期：<span id="detail_prescription_prescriptionTime">{{ prescriptionRefundDetail.prescription.prescriptionTime | dateFormat }}</span>
                    </div>
                  </div>
                  <div class="rp-info">
                    <div class="t">Rp:</div>
                    <div class="rp-list" id="detail_prescription_item">
                      <div class="item" v-for="item in prescriptionRefundDetail.pharmacyPrescriptionItemList" v-bind:key="item.id">
                        <div class="name clearfix">
                          <div class="pull-left">{{ item.name }} {{item.medical ? '（医保）': ''}} {{ item.specifications }}</div>
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
                    医师签名：<span>{{ prescriptionRefundDetail.prescription.docName }}</span><br>
                    诊查费（平台代收）：<span>{{ prescriptionRefundDetail.prescription.diagnosticAmount }}元</span><br>
                    收银员：<span>{{ prescriptionRefundDetail.payOperatorName }}</span><br>
                    审方药师：<span>{{ prescriptionRefundDetail.dosageOperatorName }}</span><br>
                    发药员：<span>{{ prescriptionRefundDetail.deliverOperatorName }}</span>
                  </div>
                </div>
              </div>
              <!--处方工作台-->
              <div class="work">
                <h4 class="m-title">处方工作台</h4>
                <!--提取-->
                <div class="common tq">
                  <div class="tit">
                    <h4>提取</h4>
                    <div class="date">{{ prescriptionRefundDetail.pickTime | dateFormat }}</div>
                  </div>
                  <div class="con">
                    <table style="width: 100%">
                      <tr>
                        <td>处方单号：{{ prescriptionRefundDetail.prescription.code }}</td>
                        <td>提取码: {{ prescriptionRefundDetail.pickCode }}</td>
                        <td>操作人:{{ prescriptionRefundDetail.pickOperatorName }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <!--收银-->
                <div class="common hf">
                  <div class="tit">
                    <h4>收银</h4>
                    <div class="date">{{ prescriptionRefundDetail.prescriptionOrder.payTime | dateFormat }}</div>
                  </div>
                  <div class="con">
                    <table style="width: 100%">
                      <tr>
                        <td>药品总金额：-{{ prescriptionRefundDetail.prescriptionOrder.drugAmount }}元</td>
                        <td>诊查费（平台代收）：-{{ prescriptionRefundDetail.prescriptionOrder.diagnosticAmount }}元</td>
                        <td>处方总金额：-{{ prescriptionRefundDetail.prescriptionOrder.totalAmount }}元</td>
                      </tr>
                      <tr>
                        <td>支付单号: {{ prescriptionRefundDetail.prescriptionOrder.id }}</td>
                        <td>支付日期: {{ prescriptionRefundDetail.prescriptionOrder.payTime | dateFormat }}</td>
                        <td>合计金额：-{{ prescriptionRefundDetail.prescriptionOrder.finalAmount }}元</td>
                      </tr>
                      <tr style="font-size: 18px">
                        <td>应付金额：-{{ prescriptionRefundDetail.prescriptionOrder.totalAmount }}元</td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;" v-if="prescriptionRefundDetail.prescriptionOrder.medicalAmount">医保:-{{prescriptionRefundDetail.prescriptionOrder.medicalAmount}}元</td>
                      </tr>
                      <tr>
                        <td style="font-size:14px;">{{prescriptionRefundDetail.prescriptionOrder.paymentTypeName}}: -{{ parseInt((prescriptionRefundDetail.prescriptionOrder.finalAmount - (prescriptionRefundDetail.prescriptionOrder.medicalAmount ? prescriptionRefundDetail.prescriptionOrder.medicalAmount : 0))*100)  /100 }}元</td>
                      </tr>
                      <tr>
                      <tr>
                        <td style="color: red">
                          {{ prescriptionRefundDetail.prescriptionOrder.couponAmount > 0 ? prescriptionRefundDetail.prescriptionOrder.memo : '' }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <!--审方-->
                <div class="common tq">
                  <div class="tit">
                    <h4>处方清单</h4>
                    <div class="date">{{ prescriptionRefundDetail.dosageTime | dateFormat }}</div>
                  </div>
                  <div class="con">
                    <el-table
                      :data="prescriptionRefundDetail.pharmacyPrescriptionItemList"
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
                          <td>药品总金额：<strong>{{ prescriptionRefundDetail.prescriptionOrder.drugAmount }}元</strong></td>
                          <td>审方药师: {{ prescriptionRefundDetail.dosageOperatorName }}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="reprint()">打印</el-button>
              <el-button @click="dialogVisible = false">关闭</el-button>
            </div>
          </el-dialog>
          <div id="printDiv" ref="print">
            <div style="width: 50mm;">
              <div style="padding: 2mm 2mm 2mm 2mm; text-align: center">
                <div style="font-size: 15px; margin-bottom: 2px;">{{ prescriptionRefundDetail.hospital.name }}</div>
                <div style="font-size: 12px;">{{ prescriptionRefundDetail.hospital.shortName }}</div>
              </div>
              <div style="font-size: 12px;">
                <div style="line-height: 18px;">姓名：{{ prescriptionRefundDetail.patient.name }}　{{
                  prescriptionRefundDetail.patient.sexName
                  }}　{{ prescriptionRefundDetail.patient.age }}岁
                </div>
                <div style="line-height: 18px;">处方编号：{{ prescriptionRefundDetail.prescription.code }}</div>
                <div style="font-size: 12px; font-weight: 300; height: 12px;">*******************************</div>
                <table style="font-size: 10px;">
                  <thead style="text-align: left; line-height: 24px;font-size:13px;">
                  <td>品名</td>
                  <td style="width: 35px;">数量</td>
                  <td style="width: 35px;">金额</td>
                  </thead>
                  <tbody style="line-height: 20px;">
                  <tr>
                    <td colspan="4" style="border-top: 1px dashed #000; height: 5px"></td>
                  </tr>
                  <tr>
                    <td style="line-height: normal">药品费用</td>
                    <td>
                      {{numTotal}}
                    </td>
                    <td>-{{ prescriptionRefundDetail.prescriptionOrder.drugAmount }}</td>
                  </tr>
                  <tr>
                    <td style="line-height: normal">诊查费（{{ prescriptionRefundDetail.prescription.docName }}）</td>
                    <td>1</td>
                    <td>-{{ prescriptionRefundDetail.prescriptionOrder.diagnosticAmount }}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td colspan="2" style="font-size: 10px">{{ prescriptionRefundDetail.prescriptionOrder.couponAmount > 0 ? '诊查费已减免' : '' }}</td>
                  </tr>
                  <tr>
                    <td colspan="4" style="border-bottom: 1px dashed #000; height: 5px;"></td>
                  </tr>
                  </tbody>
                </table>
                <table style="line-height: 20px;">
                  <tr style="font-size: 18px;">
                    <td>合计：</td>
                    <td>-{{ currentRow.totalAmount }}元</td>
                  </tr>
                  <tr v-if="this.currentRow.medicalAmount">
                    <td>&nbsp;医保</td>
                    <td>-{{ this.currentRow.medicalAmount }}元</td>
                  </tr>
                  <tr v-if = "this.currentRow.paymentTypeAmount">
                    <td>&nbsp;{{ this.currentRow.paymentCodeName }}</td>
                    <td>-{{ this.currentRow.paymentTypeAmount }}元</td>
                  </tr>
                  <!--<tr>-->
                    <!--<td>{{ currentRow.paymentTypeName }}</td>-->
                    <!--<td>-{{ currentRow.finalAmount }}元</td>-->
                  <!--</tr>-->
                </table>
                <div style="padding: 5px 0; line-height: 18px; border-top: 1px solid #000;">
                  <div>日期：{{ new Date() | dateFormat }}</div>
                  <div>收银员：{{ username }}</div>
                  <!-- <div>支付单号：{{ currentRow.prescriptionOrderId }}</div> -->
                  <svg id="barcode"></svg>
                </div>
                <div style="line-height: 8px; text-align: center;">
                  - - - - - - - - - - - - - - - - - - - - - - - - - - -
                  - - - - - - - - - - - - - - - - - - - - - - - - - - -
                </div>
                <div style="padding: 5px 0;font-size:10px ">
                  药品属特殊商品，一经售出恕不退换。
                  凭此小票一个月内索取发票，逾期无效。
                </div>
              </div>
            </div>
          </div>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="param.page" :page-sizes="[10,20,30, 50]"
                           :page-size="param.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="prescriptions.total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;
  }

  #printDiv {
    background: #eaeaea;
    width: 58mm;
    display: none;
  }

  .tableListIng {
    margin-top: 20px;
  }
</style>
<script>
  import { mapState } from 'vuex'
  import { getLodop } from '@/utils/LodopFuncs'
  import moment from 'moment'
  import JsBarcode from 'jsbarcode'

  export default {
    data() {
      return {
        listLoading: false,
        activeName: 'first',
        dialogVisible: false,
        id: '',
        pickPharm: -1,
        prescriptionDetailLoading: false,
        param: {
          page: 1,
          limit: 10,
          searchCondition: { finish: true, orderStatus: 'REFUND' }
        },
        currentRow: {},
        username: '',
        numTotal: 0,
        paySerialId: '',
        scanTime: new Date().getTime(),
        paymentName: '',
        refundDialogVisible: false,
        payDate: '',
        payTime: ''
      }
    },
    created() {
      if (window.localStorage.account) {
        this.username = JSON.parse(window.localStorage.account).name
      }
      this.getPrescriptionList()
    },
    computed: mapState({
      prescriptions: state => state.prescription.pharmacyPrescriptions,
      payments: state => state.prescription.payments,
      prescriptionRefundDetail: state =>
        state.prescription.prescriptionRefundDetail,
      prescriptionRefund: state => state.prescription.prescriptionRefund,
      prescriptionItems: state => state.prescription.prescriptionItems,
      prescriptionDetail: state => state.prescription.prescriptionDetail
    }),
    methods: {
      search() {
        this.param.searchCondition.payTimeStart = ''
        this.param.searchCondition.payTimeEnd = ''
        this.param.page = 1
        this.getPrescriptionList()
      },
      getPrescriptionList() {
        if (this.payDate && !this.payTime) {
          this.param.searchCondition.payTimeStart = moment(
            this.payDate[0]
          ).format('YYYY-MM-DD')
          this.param.searchCondition.payTimeEnd = moment(this.payDate[1]).format(
            'YYYY-MM-DD'
          )
        } else if (!this.payDate && this.payTime) {
          this.param.searchCondition.payTimeStart = moment(
            this.payTime[0]
          ).format('YYYY-MM-DD HH:mm')
          this.param.searchCondition.payTimeEnd = moment(this.payTime[1]).format(
            'YYYY-MM-DD HH:mm'
          )
        } else if (this.payDate && this.payTime) {
          this.param.searchCondition.payTimeStart =
            moment(this.payDate[0]).format('YYYY-MM-DD') +
            ' ' +
            moment(this.payTime[0]).format('HH:mm')
          this.param.searchCondition.payTimeEnd =
            moment(this.payDate[1]).format('YYYY-MM-DD') +
            ' ' +
            moment(this.payTime[1]).format('HH:mm')
        }
        this.listLoading = true
        this.$store
          .dispatch('getPharmacyPrescriptionList', { params: this.param })
          .then(response => {
            this.listLoading = false
          })
      },
      resetSearch() {
        this.param.page = 1
        this.payDate = null
        this.payTime = null
        this.param.searchCondition = { finish: true, orderStatus: 'REFUND' }
        this.getPrescriptionList()
      },
      refundSearch() {
        this.$store
          .dispatch('getPrescriptionRefundDetail', {
            id: this.id
          })
          .then(response => {
            this.refundDialogVisible = true
          })
      },
      handleClick(tab, event) {
        console.log(tab, event)
      },
      refund(orderId, amount, pickPharmId) {
        this.$confirm(
          '确认全退支付单号为' +
          orderId +
          '的总费用' +
          amount +
          '元？, 是否继续?',
          '',
          {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }
        )
          .then(() => {
            this.refundOrder(pickPharmId)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退款'
            })
          })
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getPrescriptionList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getPrescriptionList()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      detail(row) {
        this.currentRow = row
        this.dialogVisible = true;
        // console.log(this.currentRow,8)
        if (this.currentRow != undefined) {
          if (!this.currentRow.paymentCodeName) {
            this.currentRow.paymentCodeName = this.currentRow.paymentTypeName;
          }
          this.currentRow.paymentTypeAmount = parseInt((this.currentRow.finalAmount - this.currentRow.medicalAmount) * 100) / 100;
        }
        this.$store
          .dispatch('getPrescriptionRefundDetail', {
            id: row.prescriptionOrderId
          })
          .then(response => {
            const list = response.data.pharmacyPrescriptionItemList
            this.numTotal = 0
            for (let index = 0; index < list.length; index++) {
              const element = list[index]
              this.numTotal = this.numTotal + (element.numTotal - 0)
            }
          })
          .catch(error => {
          })
        // this.getPharmacyPrescriptionItems();
      },
      getPayment() {
        this.$store.dispatch('getPayment', { params: this.param })
      },
      getPharmacyPrescriptionItems() {
        this.$store
          .dispatch('getPharmacyPrescriptionItems', {
            params: { prescriptionId: this.currentRow.prescriptionId }
          })
          .then(response => {
          })
      },
      refundOrder(pickPharmId) {
        this.$store
          .dispatch('prescriptionRefund', {
            pickPharm: pickPharmId
          })
          .then(response => {
            this.$message({
              message: response.msg,
              type: 'success',
              duration: 2 * 1000
            })
            this.getPrescriptionList()
            this.refundDialogVisible = false

            this.currentRow.prescriptionOrderId = this.prescriptionRefundDetail.prescriptionOrder.id
            this.currentRow.paymentTypeName = this.prescriptionRefundDetail.prescriptionOrder.paymentTypeName
            this.currentRow.totalAmount = this.prescriptionRefundDetail.prescriptionOrder.totalAmount

            const list = this.prescriptionRefundDetail
              .pharmacyPrescriptionItemList
            this.numTotal = 0
            for (let index = 0; index < list.length; index++) {
              const element = list[index]
              this.numTotal = this.numTotal + (element.numTotal - 0)
            }
            JsBarcode('#barcode', this.currentRow.prescriptionOrderId, {
              format: 'CODE128',
              font: 'OCRB',
              fontSize: 14,
              textMargin: 0,
              textAlign: 'center',
              width: 1,
              height: 39
            }).render()
            this.$nextTick(() => {
              this.print()
            })
          })
          .catch(error => {
          })
      },
      reprint() {
        JsBarcode('#barcode', this.currentRow.prescriptionOrderId, {
          format: 'CODE128',
          font: 'OCRB',
          fontSize: 14,
          textMargin: 0,
          textAlign: 'center',
          width: 1,
          height: 39
        }).render()
        this.$nextTick(() => {
          this.print()
        })
      },
      print() {
        try {
          const LODOP = getLodop()
          const html = this.$refs.print.innerHTML
          LODOP.ADD_PRINT_HTM('', '', '100%', '100%', html)
          LODOP.SET_PRINTER_INDEX('小票打印机')
          LODOP.SET_PRINT_PAGESIZE(3, '58mm', '100%', '') // 这里3表示纵向打印且纸高“按内容的高度”；纸宽58mm；页底空白6mm
          LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Width:100%;Height:100%')
          LODOP.PRINT()
        } catch (err) {
        }
      }
    }
  }
</script>

