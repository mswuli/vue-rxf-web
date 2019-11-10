<template>
  <div class="app-container">
    <div class="current-pharmacy">
      账户余额:<span style="color: red;font-size: 20px"> ¥ {{ pharmacyHome.financeAccount.amount }} </span><el-button type="primary" size="mini" @click="charging()">充值</el-button>
    </div>
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.payIdSearch" class="filter-item" placeholder="支付单号">
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
      <el-button class="filter-item" @click="getRechargeList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeRecharges.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed=" right" prop="id" label="支付单号"></el-table-column>
      <el-table-column prop="payAmount" label="支付金额（元）"></el-table-column>
      <el-table-column prop="payTime" label="支付时间">
        <template slot-scope="scope">
          {{scope.row.payTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="paymentTypeName" label="支付方式"></el-table-column>
      <el-table-column prop="paymentsAccount" label="支付账号"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="financeRecharges.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="医院" prop="hspName">
          <el-input disabled v-model="mObject.hspName"></el-input>
        </el-form-item>
        <el-form-item label="线路" prop="line">
          <el-input v-model="mObject.line"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="账户充值"
      :close-on-click-modal=false
      :visible.sync="chargingDialogVisible"
      :before-close="closeDialog"
      width="800px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="扫描支付" name="first">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form :model="mObject" ref="mObject" label-width="120px">
                <el-form-item width="70%" label="充值金额">
                  <el-input v-model="mObject.amount"><template slot="append">元</template></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="getSaasPayQrcode(-1)">确 定</el-button>
                </el-form-item>
                <el-form-item label="快捷选择">
                  <div class="clearfix labels">
                    <div v-for="amount of amounts" v-bind:key="amount" class="item" :class="{'active': amount === activeAmount}" @click="getSaasPayQrcode(amount)">￥{{ amount }}</div>
                  </div>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <div class="qrcode" id="qrcode"></div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="使用优惠券" name="second">
          <el-form :model="mObject" :rules="couponRules" ref="mObject" label-width="120px" style="width: 500px;">
              <el-form-item width="70%" label="优惠券码" prop="couponCode">
                <el-input v-model="mObject.couponCode"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="useCashCoupon()">确 定</el-button>
              </el-form-item>
            </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog(null)">关 闭</el-button>
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-dialog__body {
  padding: 10px 20px;
}
.bg-purple {
  background: #fff;
  padding: 10px;
  .tit {
    font-size: 20px;
    color: #444;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }
  .con {
    height: 168px;
  }
}
.account {
  .con {
    text-align: center;
  }
  .t {
    font-size: 16px;
    color: #444;
    padding: 15px 0;
  }
  .m {
    font-size: 18px;
    color: #ff6c20;
    padding-bottom: 20px;
    strong {
      font-size: 48px;
      font-weight: 500;
    }
  }
  .cz-btn {
    width: 100%;
    background: #00c2c2;
    border-color: #00c2c2;
  }
}
.x-item {
  position: relative;
  margin-top: 20px;
  height: 138px;
  padding: 10px;
  background: #8fcf8f;
  color: #fff;
  &.x-item01 {
    background: #8fcf8f;
  }
  &.x-item02 {
    background: #84bdd0;
  }
  &.x-item03 {
    background: #849bd0;
  }
  &.x-item04 {
    background: #d084c5;
  }
  .t {
    font-size: 14px;
  }
  .v {
    text-align: center;
    font-size: 14px;
    padding-bottom: 20px;
    padding-top: 35px;
    strong {
      font-size: 30px;
      font-weight: 500;
    }
  }
}
.labels {
  .item {
    width: 85px;
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
    &.active {
      background: #00c2c2;
      color: #fff;
    }
  }
}
.qrcode {
  width: 240px;
  height: 240px;
  img {
    width: 100%;
    height: 100%;
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
      param: {
        page: 1,
        limit: 10,
        searchCondition: { bankCard: {} },
        type: ""
      },
      dialogVisible: false,
      mObject: {
        bankCard: {}
      },
      mTitle: "",

      mCharging: {},
      chargingDialogVisible: false,
      activeName: "first",
      amounts: [100, 200, 300, 500, 1000, 2000, 3000, 5000],
      activeAmount: "",
      outTradeNo: "",
      payTime: null,
      couponRules: {
        couponCode: [
          { required: true, message: "请输入激活码", trigger: "blur" }
        ]
      },
      chargingRules: {
        chargingAmount: [
          { required: true, message: "请输入充值金额", trigger: "blur" }
        ],
        chargingMemo: [
          { required: true, message: "请输入备注", trigger: "blur" }
        ]
      }
    };
  },
  filters: {},
  created() {
    this.getRechargeList();
    this.getPharmacyHome();
  },
  computed: mapState({
    financeRecharges: state => state.financeAccount.financeRecharges,
    pharmacyHome: state => state.financeAccount.pharmacyHome,
    currentPharmacy: state => state.financeAccount.currentPharmacy
  }),
  methods: {
    getRechargeList() {
      if (this.payTime) {
        this.param.searchCondition.payTimeStart = moment(
          this.payTime[0]
        ).format("YYYY-MM-DD");
        this.param.searchCondition.payTimeEnd = moment(this.payTime[1]).format(
          "YYYY-MM-DD"
        );
      }
      this.listLoading = true;
      this.$store.dispatch("getRechargeList", {
        params: this.param,
        callback: () => {
          this.listLoading = false;
        }
      });
    },
    getCurrentPharmacy() {
      this.$store.dispatch("getCurrentPharmacy", {});
    },
    getPharmacyHome() {
      this.$store.dispatch("getPharmacyHome", {});
    },
    resetSearch() {
      this.payTime = null;
      this.param.searchCondition = {};
      this.getRechargeList();
    },
    handleSizeChange(size) {
      this.param.limit = size;
      this.getRechargeList();
    },
    handleCurrentChange(page) {
      this.param.page = page;
      this.getRechargeList();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    closeDialog(done) {
      console.log(1);
      this.activeAmount = "";
      clearInterval(this.checkTimer);
      this.chargingDialogVisible = false;
      done && done();
    },
    charging(row) {
      this.chargingDialogVisible = true;
      this.getCurrentPharmacy();
    },
    getSaasPayQrcode(amount) {
      if (amount > 0 && this.activeAmount === amount) {
        this.activeAmount = "";
        clearInterval(this.checkTimer);
        return false;
      }
      if (amount === -1) {
        amount = this.mObject.amount;
      }
      let amountReg = /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/;
      if (!amount) {
        this.$message({
          type: "error",
          message: "充值金额不能为空!",
          duration: 3 * 1000
        });
        return false;
      }
      if (!amountReg.test(amount)) {
        this.$message({
          type: "error",
          message: "请输入正确金额!",
          duration: 3 * 1000
        });
        return false;
      }
      this.activeAmount = amount;
      const params = {
        amount: amount,
        businessId: this.pharmacyHome.pharmacy.id,
        id: this.outTradeNo,
        payTypeCode: "saaspay"
      };
      this.$store.dispatch("getSaasPayQrcode", params).then(response => {
        console.log(response);
        document.getElementById("qrcode").innerHTML = "";
        new QRCode(document.getElementById("qrcode"), {
          text: response.data.qrcode,
          width: 240,
          height: 240
        });
        this.outTradeNo = response.data.outTradeNo;
        if (this.checkTimer) {
          clearInterval(this.checkTimer);
        }
        this.checkTimer = setInterval(() => {
          this.getPayStatusTimer(this.outTradeNo);
        }, 3000);
      });
    },
    getPayStatusTimer(outTradeNo) {
      this.$store
        .dispatch("getPayStatus", { outTradeNo })
        .then(function(response) {
          if (response.data.payStatus) {
            clearInterval(this.checkTimer);
            Message({
              message: "支付成功",
              type: "success"
            });
          }
        });
    },
    useCashCoupon() {
      this.$refs["mObject"].validate(valid => {
        if (valid) {
          this.$store.dispatch("useCashCoupon", {
            id: this.currentPharmacy.id,
            couponCode: this.mObject.couponCode,
            callback: () => {
              this.$message({
                message: "使用成功",
                type: "success",
                duration: 3 * 1000
              });
              this.chargingDialogVisible = false;
              this.getRechargeList();
              this.getPharmacyHome();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提交充值表单
    submitChargingForm() {
      this.$refs["mCharging"].validate(valid => {
        if (valid) {
          this.$store.dispatch("chargingAccount", {
            data: this.mCharging,
            callback: () => {
              this.$message({
                message: "充值成功",
                type: "success",
                duration: 3 * 1000
              });
              this.chargingDialogVisible = false;
              this.getRechargeList();
              this.getPharmacyHome();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
