<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 150px;" v-model="param.searchCondition.code" class="filter-item" placeholder="处方编号">
      </el-input>
<el-date-picker
      v-model="payDate"
      type="daterange"
       style="width:240px;"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd">
    </el-date-picker>
     <el-time-picker
      is-range
       style="width:240px;"
      v-model="payTime"
      range-separator="-"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      placeholder="选择时间范围"
      format="HH:mm"
      value-format="yyyy-MM-dd HH:mm">
     </el-time-picker>
      <el-button class="filter-item" @click="getPrescriptionList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="prescriptions.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column prop="code" label="处方编号"></el-table-column>
      <el-table-column prop="patientName" label="患者姓名"></el-table-column>
      <el-table-column prop="patientTel" label="手机号"></el-table-column>
      <el-table-column prop="idCard" label="身份证"></el-table-column>
      <el-table-column prop="docName" label="开方医师"></el-table-column>
      <el-table-column prop="dosageOperatorName" label="审方药师"></el-table-column>
      <el-table-column prop="deliverOperatorName" label="配药员"></el-table-column>
       <el-table-column prop="prescriptionTime" label="日期">
         <template slot-scope="scope">
          {{scope.row.prescriptionTime | dateFormat}}
        </template>
       </el-table-column>
        <!-- <el-table-column prop="tradingTypeName" label="时间"></el-table-column> -->
         <el-table-column  label="操作"  fixed="right">
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
        <div class="cfj">
          <h4 class="m-title">处方笺信息</h4>
          <div class="cfj-tit">
            <div class="t1"><span id="detail_hospital_name">{{ prescriptionDetail.hospital.name }}</span></div>
            <div class="t2">（<span id="detail_hospital_shortName">{{ prescriptionDetail.hospital.shortName }}</span>）</div>
            <div class="t3">处方笺</div>
          </div>
          <div class="cfj-cont">
            <div class="clearfix cf-info">
              <div class="item item2">姓名：<span id="detail_patient_name">{{ prescriptionDetail.patient.name }}</span></div>
              <div class="item item2">性别：<span id="detail_patient_sexName">{{ prescriptionDetail.patient.sexName }}</span></div>
              <div class="item item2">年龄：<span id="detail_patient_age">{{ prescriptionDetail.patient.age }}</span></div>
              <div class="item item2">手机号：<span id="detail_patient_tel">{{ prescriptionDetail.patient.tel }}</span></div>
              <div class="item">处方编号：{{prescriptionDetail.prescription.code }}</div>
              <div class="item">身份证号：<span id="detail_patient_idCard">{{ prescriptionDetail.patient.idCard }}</span></div>
              <div class="item">病情诊断：<span id="detail_prescription_tentativeDiagnosis">{{ prescriptionDetail.prescription.tentativeDiagnosis }}</span></div>
              <div class="item">处方日期：<span id="detail_prescription_prescriptionTime">{{ prescriptionDetail.prescription.prescriptionTime | dateFormat }}</span></div>
            </div>
            <div class="rp-info">
              <div class="t">Rp:</div>
              <div class="rp-list" id="detail_prescription_item">
                <div class="item" v-for="item in prescriptionDetail.itemList" v-bind:key="item.id">
                  <div class="name clearfix">
                    <div class="pull-left">{{ item.skuName }} {{ item.specifications }}</div>
                    <div class="pull-right">数量：{{ item.numTotal }}{{ item.unit }}</div>
                  </div>
                  <div class="des"><span>{{ item.usage }}</span><span>{{ item.frequency }}</span><span>{{ item.num }}</span></div>
                </div>
              </div>
            </div>
            <div class="other-info">
              补充说明：<br>
              医师签名：<span id="detail_prescription_docName">{{ prescriptionDetail.prescription.docName }}</span><br>
              诊查费（平台代收）：<span id="detail_prescription_docName">{{ prescriptionDetail.prescription.diagnosticAmount }}元</span><br>
              审方药师：<span id="detail_prescription_docName">{{ currentRow.dosageOperatorName }}</span><br>
              收银员：<span id="detail_prescription_docName">{{ currentRow.payOperatorName }}</span><br>
              发药员：<span id="detail_prescription_docName">{{ currentRow.deliverOperatorName }}</span>
            </div>
          </div>
        </div>
        <div class="work">
          <h4 class="m-title">处方工作台</h4>
          <div class="common tq">
            <div class="tit">
              <h4>提取</h4>
              <div class="date">{{ currentRow.pickTime | dateFormat }}</div>
            </div>
            <div class="con">
              <table style="width: 100%">
                <tr>
                  <td>处方编号：{{ currentRow.code }}</td>
                  <td>提取码: {{ currentRow.pickCode }}</td>
                  <td>操作人:{{ currentRow.pickOperatorName }} </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="common tq">
            <div class="tit">
              <h4>处方清单</h4>
              <div class="date">{{ currentRow.dosageTime | dateFormat }}</div>
            </div>
            <div class="con">
              <el-table
                :data="prescriptionItems"
                border
                style="width: 100%">
                 <el-table-column prop="goodsBarcode"  width="120" label="药品编码"></el-table-column>
                <el-table-column prop="name"  width="100" label="药品名称"></el-table-column>
                <el-table-column prop="specifications" width="120" label="规格"></el-table-column>
                <el-table-column prop="numTotal" width="50" label="数量"></el-table-column>
                <el-table-column prop="unit" width="50" label="单位"></el-table-column>
                <!-- <el-table-column prop="hspSkuSpec" width="100" label="医院规格"></el-table-column> -->
                <el-table-column prop="manufacturer" width="100" label="生产厂家"></el-table-column>
                 <el-table-column prop="lotNumber" width="100" label="批号"></el-table-column>

              </el-table>
              <div class="foo">
                <table style="width: 100%">
                <tr>
                  <td>药品总金额：<strong>{{ currentRow.drugAmount }}元</strong></td>
                  <td>药剂师: {{ currentRow.dosageOperatorName }}</td>
                </tr>
              </table>
              </div>
            </div>
          </div>
          <div class="common hf">
            <div class="tit">
              <h4>收银</h4>
              <div class="date">{{ currentRow.payTime | dateFormat }}</div>
            </div>
            <div class="con">
              <table style="width: 100%">
                <tr>
                  <td>药品总金额：{{ currentRow.drugAmount }}元 </td>
                  <td>诊查费（平台代收）：{{ currentRow.diagnosticAmount }}元 </td>
                  <td>处方总金额：{{ currentRow.totalAmount }}元 </td>
                </tr>
                <tr>
                  <td>应付金额: {{ currentRow.finalAmount }}元</td>
                  <td>支付方式：{{ currentRow.paymentTypeName }}</td>
                  <td>收银员: {{ currentRow.payOperatorName }}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="common hf">
            <div class="tit">
              <h4>发药</h4>
              <div class="date">{{ currentRow.deliverTime | dateFormat }}</div>
            </div>
            <div class="con">
              <table style="width: 100%">
                <tr>
                  <td>发药员： {{ currentRow.deliverOperatorName }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="prescriptions.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import { download } from "@/utils/export";

export default {
  data() {
    return {
      listLoading: false,
      param: {
        page: 1,
        limit: 10,
        searchCondition: { finish: true, orderStatus: "FINISH" }
      },
      payDate: null,
      payTime: null,
      currentRow: {},
      daterange: null,
      dateTime: "",
      rules: {},
      prescriptionDetailLoading: false,
      dialogVisible: false
    };
  },
  filters: {},
  created() {
    this.getPrescriptionList();
  },
  computed: mapState({
    // financeCommissions: state => state.financeIncome.financeCommissions,
    prescriptions: state => state.prescription.pharmacyPrescriptions,
    prescriptionItems: state => state.prescription.prescriptionItems,
    prescriptionDetail: state => state.prescription.prescriptionDetail,
    prescriptionShDetail: state => state.prescription.prescriptionShDetail
  }),
  methods: {
    getPrescriptionList() {
      if (this.payDate && !this.payTime) {
        this.param.searchCondition.prescriptionTimeStart =
          moment(this.payDate[0]).format("YYYY-MM-DD") + " 00:00:00";
        this.param.searchCondition.prescriptionTimeEnd =
          moment(this.payDate[1]).format("YYYY-MM-DD") + " 23:59:59";
      } else if (!this.payDate && this.payTime) {
        let date = moment(new Date()).format("YYYY-MM-DD");

        this.param.searchCondition.prescriptionTimeStart =
          date + " " + moment(this.payTime[0]).format("HH:mm");

        this.param.searchCondition.prescriptionTimeEnd =
          date + " " + moment(this.payTime[1]).format("HH:mm");
      } else if (this.payDate && this.payTime) {
        this.param.searchCondition.prescriptionTimeStart =
          moment(this.payDate[0]).format("YYYY-MM-DD") +
          " " +
          moment(this.payTime[0]).format("HH:mm");
        this.param.searchCondition.prescriptionTimeEnd =
          moment(this.payDate[1]).format("YYYY-MM-DD") +
          " " +
          moment(this.payTime[1]).format("HH:mm");
      }
      this.listLoading = true;
      this.$store
        .dispatch("getPharmacyPrescriptionList", {
          params: this.param
        })
        .then(response => {
          this.listLoading = false;
        });
    },
    resetSearch() {
      this.param.searchCondition = { finish: true, orderStatus: "FINISH" };
      this.payDate = null;
      this.payTime = null;
      this.getPrescriptionList();
    },
    handleSizeChange(size) {
      this.param.limit = size;
      this.getPrescriptionList();
    },
    handleCurrentChange(page) {
      this.param.page = page;
      this.getPrescriptionList();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    detail(row) {
      this.dialogVisible = true;
      this.currentRow = row;
      this.prescriptionDetailLoading = true;
      this.$store.dispatch("getPrescriptionDetail", {
        params: row,
        callback: () => {
          this.prescriptionDetailLoading = false;
        }
      });
      this.getPharmacyPrescriptionItems();
    },
    getPharmacyPrescriptionItems() {
      this.$store
        .dispatch("getPharmacyPrescriptionItems", {
          params: { prescriptionId: this.currentRow.prescriptionId }
        })
        .then(response => {});
    }
  }
};
</script>
