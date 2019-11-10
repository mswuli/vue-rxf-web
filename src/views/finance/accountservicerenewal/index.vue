<template>
  <div class="app-container">
    <div class="current-pharmacy">
      服务费 到期时间：{{ currentPharmacy.serviceExpireDate | dateFormat }} 剩余 {{ currentPharmacy.daysLeft }} 天，请尽快续费 <el-button type="primary" size="mini" @click="charging()">续费</el-button>
    </div>
    <div class="filter-container">
      <el-input style="width: 240px;" v-model="payIdSearch" class="filter-item" placeholder="支付单号">
      </el-input>
      <el-date-picker
      v-model="payTime"
      type="daterange"
      range-separator="-"
      start-placeholder="支付开始日期"
      end-placeholder="支付结束日期"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd">
    </el-date-picker>
      <el-button class="filter-item" @click.native.prevent="getFinanceServiceList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeServices.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column fixed prop="id" label="支付单号"></el-table-column>
      <el-table-column prop="payAmount" label="支付金额（元）"></el-table-column>
      <el-table-column prop="payTime" label="支付时间">
        <template slot-scope="scope">
          {{scope.row.payTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="serviceType" label="服务类型"></el-table-column>
      <el-table-column prop="serviceTime" label="服务时间"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="financeServices.total">
      </el-pagination>
    </div>

    <el-dialog
      title="续费"
      :close-on-click-modal=false
      :visible.sync="chargingDialogVisible">
      <el-form :model="mCharging" ref="mCharging" label-width="120px">
        <el-form-item label="选择">
          <div class="clearfix labels">
            <div v-for="service of currentPharmacy.serviceManageDetailList" v-bind:key="service.id" class="item" :class="{'active': service.id === activeServiceId}" @click="chooseService(service)">￥{{ service.price }}<span>({{ service.name }})</span></div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chargingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChargingForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.current-pharmacy {
  height: 44px;
  line-height: 44px;
  background: #f3f3f3;
  padding: 0 15px;
  color: #333;
  margin-bottom: 10px;
}
.labels {
  .item {
    width: 70%;
    padding: 0 15px;
    height: 33px;
    line-height: 33px;
    border: 1px solid #00c2c2;
    font-size: 18px;
    text-align: center;
    float: left;
    margin: 0 10px 10px 0;
    color: #00c2c2;
    border-radius: 3px;
    cursor: pointer;
    span {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }
    &.active {
      background: #00c2c2;
      color: #fff;
      span {
        color: #fff;
      }
    }
  }
}
</style>


<script>
import { mapState } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      pharmacySelectDisabled: false,
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {} },
      payTime: "",
      payIdSearch: "",
      mObject: {
        bankCard: {}
      },
      mTitle: "",

      mCharging: {},
      chargingDialogVisible: false,

      activeServiceId: ""
    };
  },
  created() {
    this.getFinanceServiceList();
    this.getCurrentPharmacy();
  },
  computed: mapState({
    financeServices: state => state.financeIncome.financeServices,
    currentPharmacy: state => state.financeAccount.currentPharmacy
  }),
  methods: {
    chooseService(service) {
      this.activeServiceId = service.id;
    },
    getFinanceServiceList() {
      if (this.payTime) {
        this.param.searchCondition.payTimeStartSearch = moment(
          this.payTime[0]
        ).format("YYYY-MM-DD");
        this.param.searchCondition.payTimeEndSearch = moment(
          this.payTime[1]
        ).format("YYYY-MM-DD");
      }
      if (this.payIdSearch) {
        this.param.searchCondition.payIdSearch = this.payIdSearch;
      }
      this.listLoading = true;
      this.$store.dispatch("getFinanceServiceList", {
        params: this.param,
        callback: () => {
          this.listLoading = false;
        }
      });
    },
    getCurrentPharmacy() {
      this.$store.dispatch("getCurrentPharmacy", {});
    },
    resetSearch() {
      this.payIdSearch = null;
      this.payTime = null;
      this.param.searchCondition = {};
      this.getFinanceServiceList();
    },
    handleSizeChange(size) {
      this.param.limit = size;
      this.getFinanceServiceList();
    },
    handleCurrentChange(page) {
      this.param.page = page;
      this.getFinanceServiceList();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    charging() {
      this.chargingDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["mCharging"].clearValidate();
      });
    },
    // 提交充值表单
    submitChargingForm() {
      if (this.activeServiceId) {
        this.$store.dispatch("renewalFinanceAccount", {
          data: { id: this.activeServiceId },
          callback: () => {
            this.$message({
              message: "续费成功",
              type: "success",
              duration: 3 * 1000
            });
            this.chargingDialogVisible = false;
            this.getFinanceServiceList();
            this.getCurrentPharmacy();
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "请选择正确的续费类型!",
          duration: 3 * 1000
        });
        return false;
      }
    }
  }
};
</script>
