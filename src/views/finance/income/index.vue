<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="handoverDate"
        type="daterange"
        style="width:240px;"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <el-button class="filter-item" @click="getHandoverList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="handover()" type="warning" icon="el-icon-star-off">交接</el-button>
      <el-table
        ref="handoverTable"
        @selection-change="handleSelectionChange"
        :data="handoverList.data"
        :highlight-current-row="true"
        v-loading="handoverListLoading"
        class="connecting"
        border
        style="width: 100%"
        @row-click="rowClick"
      >
        <el-table-column prop="statusCodeName" label="交接状态"></el-table-column>
        <el-table-column prop="date" label="交接日期">
          <template slot-scope="scope">
            {{scope.row.startTime | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column prop="time" label="交接时间">
          <template slot-scope="scope">
            {{scope.row.startTime | handoverTime}} ---- {{scope.row.endTime | handoverEndTime}}
          </template>
        </el-table-column>
        <el-table-column prop="handoverCash" label="交接金额（元）"></el-table-column>
        <el-table-column prop="handoverCount" label="交接总处方（单）"></el-table-column>
      </el-table>
      <div class="header">
        <p>销售明细</p>
      </div>
      <el-input style="width: 180px;" v-model="param.searchCondition.paySerialId" class="filter-item"
                placeholder="支付单号">
      </el-input>
      <el-time-picker
        is-range
        style="width:240px;"
        v-model="payTime"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder='结束时间'
        placeholder="选择时间范围"
        format="HH:mm"
        value-format="yyyy-MM-dd HH:mm">
      </el-time-picker>
      <el-select v-model="param.searchCondition.payType" placeholder="支付方式">
        <el-option label="全部" :value="null"></el-option>
        <el-option v-for="item in payments"
                   :key="item.id"
                   :label="item.name"
                   :value="item.code"></el-option>
      </el-select>
      <el-button class="filter-item" @click.native.prevent="getFinanceIncomeList()" type="primary"
                 icon="el-icon-search">搜索
      </el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeIncomes.data.incomeList"
      v-loading="listLoading"
      class="financ"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" width="180" label="支付单号"></el-table-column>
      <el-table-column prop="prescriptionCode" label="处方编号"></el-table-column>
      <el-table-column prop="paymentTypeName" label="支付方式"></el-table-column>
      <el-table-column prop="diagnosticAmount" label="诊查费(元)"></el-table-column>
      <el-table-column prop="drugAmount" label="药品金额(元)"></el-table-column>
      <el-table-column prop="totalAmount" label="应付金额(元)"></el-table-column>
      <el-table-column prop="finalAmount" label="合计金额(元)"></el-table-column>
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
      title="收银台"
      width="1000px"
      :close-on-click-modal=false
      :visible.sync="dialogVisible"
      v-loading="prescriptionDetailLoading">
      <div class="clearfix">
        <div class="cfj">
          <h4 class="m-title">处方笺信息</h4>
          <div class="cfj-tit">
            <div class="t1"><span id="detail_hospital_name">{{ prescriptionRefundDetail.hospital.name }}</span></div>
            <div class="t2">（<span
              id="detail_hospital_shortName">{{ prescriptionRefundDetail.hospital.shortName }}</span>）
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
              <div class="item item2">年龄：<span id="detail_patient_age">{{ prescriptionRefundDetail.patient.age }}</span>
              </div>
              <div class="item item2">手机号：<span
                id="detail_patient_tel">{{ prescriptionRefundDetail.patient.tel }}</span>
              </div>
              <div class="item">处方编号：{{ prescriptionRefundDetail.prescription.code }}</div>
              <div class="item">身份证号：<span
                id="detail_patient_idCard">{{ prescriptionRefundDetail.patient.idCard }}</span>
              </div>
              <div class="item">病情诊断：<span id="detail_prescription_tentativeDiagnosis">{{ prescriptionRefundDetail.prescription.tentativeDiagnosis }}</span>
              </div>
              <div class="item">处方日期：<span id="detail_prescription_prescriptionTime">{{ prescriptionRefundDetail.prescription.prescriptionTime | dateFormat }}</span>
              </div>
            </div>
            <div class="rp-info">
              <div class="t">Rp:</div>
              <div class="rp-list" id="detail_prescription_item">
                <div class="item" v-for="item in prescriptionRefundDetail.itemList" v-bind:key="item.id">
                  <div class="name clearfix">
                    <div class="pull-left">{{ item.skuName }} {{ item.specifications }}</div>
                    <div class="pull-right">数量：{{ item.numTotal }}{{ item.unit }}</div>
                  </div>
                  <div class="des">
                    <span>{{ item.usage }}</span><span>{{ item.frequency }}</span><span>{{ item.num }}</span></div>
                </div>
              </div>
            </div>
            <div class="other-info">
              补充说明：<br>
              医师签名：<span id="detail_prescription_docName">{{ prescriptionRefundDetail.prescription.docName }}</span><br>
              诊查费（平台代收）：<span
              id="detail_prescription_docName">{{ prescriptionRefundDetail.prescription.diagnosticAmount }}元</span><br>
              审方药师：<span id="detail_prescription_docName">{{ prescriptionRefundDetail.dosageOperatorName }}</span><br>
              收银员：<span id="detail_prescription_docName">{{ prescriptionRefundDetail.payOperatorName }}</span><br>
              发药员：<span id="detail_prescription_docName">{{ prescriptionRefundDetail.deliverOperatorName }}</span>
            </div>
          </div>
        </div>
        <div class="work">
          <h4 class="m-title">处方工作台</h4>
          <div class="common tq">
            <div class="tit">
              <h4>提取</h4>
              <div class="date">{{ prescriptionRefundDetail.pickTime | dateFormat }}</div>
            </div>
            <div class="con">
              <table style="width: 100%">
                <tr>
                  <td>处方编号：{{ prescriptionRefundDetail.prescription.code }}</td>
                  <td>提取码: {{ prescriptionRefundDetail.pickCode }}</td>
                  <td>操作人:{{ prescriptionRefundDetail.pickOperatorName }}</td>
                </tr>
              </table>
            </div>
          </div>
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
                  <td>支付方式: {{ prescriptionRefundDetail.prescriptionOrder.paymentTypeName }}</td>
                  <td>应付金额：{{ prescriptionRefundDetail.prescriptionOrder.totalAmount }}元</td>
                  <td>合计金额：{{ prescriptionRefundDetail.prescriptionOrder.finalAmount }}元</td>
                </tr>
                <tr>
                  <td>支付单号: {{ prescriptionRefundDetail.prescriptionOrder.id }}</td>
                  <td>支付日期: {{ prescriptionRefundDetail.prescriptionOrder.payTime | dateFormat }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="financeIncomes.total">
      </el-pagination>
    </div>
    <el-footer class="footer">
      <div class="fon">
        <span>合计总金额（元）：<a href="#">{{financeIncomes.data.totalAmount || 0}}</a></span>
        <span>合计总处方（单）：<a href="#">{{financeIncomes.total}}</a></span>
      </div>
    </el-footer>
  </div>
</template>
<style lang="scss" scoped>
  .footer {
    width: 100%;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    margin-top: 20px;
    .fon {
      span {
        display: block;
        font-size: 18px;
        float: left;
        margin-left: 30px;
        line-height: 50px;
        a {
          color: red;
          font-weight: bold;
        }
      }
    }
  }

  .header {
    width: 100%;
    height: 50px;
    background: #d3d3d3;
    margin-bottom: 20px;
    p {
      line-height: 50px;
      margin-left: 10px;
      color: #fff;
    }
  }

  .connecting {
    margin-top: 20px;
  }

  .financ {
    margin-top: 13px;
  }

</style>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  import { download } from '@/utils/export'

  export default {
    data() {
      return {
        currentClickRowDate: moment(new Date()).format('YYYY-MM-DD'),
        handoverDate: null,
        data: '',
        handoverListLoading: false,
        listLoading: false,
        payTime: null,
        param: {
          page: 1,
          limit: 10,
          searchCondition: {}
        },
        handoverListParam: {},
        // daterange: null,
        rules: {},
        prescriptionDetailLoading: false,
        dialogVisible: false
      }
    },
    filters: {},
    created() {
      this.getHandoverList()
      // this.getFinanceIncomeList();
      this.getPayment()
    },
    computed: mapState({
      financeIncomes: state => state.financeIncome.financeIncomes,
      payments: state => state.prescription.payments,
      prescriptionDetail: state => state.prescription.prescriptionDetail,
      prescriptionRefundDetail: state =>
        state.prescription.prescriptionRefundDetail,
      handoverList: state => state.pharmacy.handoverList
    }),
    methods: {
      // 获取交接记录
      getHandoverList() {
        if (this.handoverDate) {
          this.handoverListParam.startTime = moment(this.handoverDate[0]).format('YYYY-MM-DD') + ' 00:00'
          this.handoverListParam.endTime = moment(this.handoverDate[1]).format('YYYY-MM-DD') + ' 23:59'
        } else {
          this.handoverListParam.startTime = null
          this.handoverListParam.endTime = null
        }
        this.handoverListLoading = true
        this.$store.dispatch('getHandoverList', {
          params: this.handoverListParam,
          callback: () => {
            this.handoverListLoading = false
            this.getDefaultFinanceIncomeList()
          }
        })
        // console.log(333333)
      },
      // 页面初始化默认加载数据
      getDefaultFinanceIncomeList() {
        const list = this.handoverList.data
        for (let index = 0; index < list.length; index++) {
          const handoverItem = list[index]
          if (handoverItem.statusCodeName === '未交接') {
            const payTimeStart = moment(handoverItem.startTime).format('YYYY-MM-DD HH:mm')
            const payTimeEnd = moment(new Date()).format('YYYY-MM-DD HH:mm')
            this.param.searchCondition.payTimeStart = payTimeStart
            this.param.searchCondition.payTimeEnd = payTimeEnd
            this.listLoading = true
            this.$store.dispatch('getFinanceIncomeList', {
              params: this.param,
              callback: () => {
                this.listLoading = false
              }
            })
          }
        }
      },
      getFinanceIncomeList() {
        if (!this.payTime) {
          this.param.searchCondition.payTimeStart = this.currentClickRowDate + ' 00:00'
          this.param.searchCondition.payTimeEnd = this.currentClickRowDate + ' 23:59'
        } else if (this.payTime) {
          this.param.searchCondition.payTimeStart = this.currentClickRowDate + ' ' + moment(this.payTime[0]).format('HH:mm')
          this.param.searchCondition.payTimeEnd = this.currentClickRowDate + ' ' + moment(this.payTime[1]).format('HH:mm')
        }

        this.listLoading = true
        this.$store.dispatch('getFinanceIncomeList', {
          params: this.param,
          callback: () => {
            this.listLoading = false
          }
        })
      },
      getPayment() {
        this.$store.dispatch('getPayment', { params: this.param })
      },
      resetSearch() {
        this.param.searchCondition = {}
        this.payTime = null
        this.getFinanceIncomeList()
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getFinanceIncomeList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getFinanceIncomeList()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      exportFile() {
        const url = '/pharmacy/finance/incomeList/export'
        download(url, this.param, '交易记录')
      },
      detail(row) {
        this.dialogVisible = true
        this.prescriptionDetailLoading = true
        this.$store
          .dispatch('getPrescriptionRefundDetail', {
            id: row.id
          })
          .then(response => {
            // console.log(666);
          })
          .catch(error => {
            this.$message({
              message: response.msg,
              type: 'error',
              duration: 3 * 1000
            })
          })
        this.prescriptionDetailLoading = false
      },
      rowClick(row, event, column) {
        this.currentClickRowDate = row.startTime
        this.currentClickRowDate = row.endTime
        // console.log(row)
        const payTimeStart = moment(row.startTime).format('YYYY-MM-DD HH:mm')
        const payTimeEnd = moment(row.endTime).format('YYYY-MM-DD HH:mm')
        this.param.searchCondition.payTimeStart = payTimeStart
        this.param.searchCondition.payTimeEnd = payTimeEnd
        this.listLoading = true
        this.$store.dispatch('getFinanceIncomeList', {
          params: this.param,
          callback: () => {
            this.listLoading = false
          }
        })
      },
      // 点击交接
      handover() {
        // todo 调用后台交接接口
        this.$store.dispatch('postHandover', {
          params: this.param
        }).then(response => {
          this.handoverDate = null
          this.getHandoverList()
        })
      }
    }
  }
</script>
