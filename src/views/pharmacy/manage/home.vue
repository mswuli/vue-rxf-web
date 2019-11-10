<template>
  <div class="app-container" style="background: #eeeeee;">
    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content bg-purple account">
        <div class="tit">余额</div>
        <div class="con">
          <div class="t">您当前的账户余额</div>
          <div class="m">￥<strong>{{ pharmacyHomeInfo.data.financeAccount.amount || 0 }}</strong></div>
          <div class="b"><el-button class="cz-btn" @click="edit(pharmacyHomeInfo.data)" type="primary">充值</el-button></div>
        </div>
      </div></el-col>
      <el-col :span="18"><div class="grid-content bg-purple">
        <div class="tit">销量</div>
        <div class="con">
          <el-row :gutter="10">
            <el-col :span="6"><div class="grid-content">
              <div class="x-item x-item01">
                <div class="t">当日总额(元)</div>
                <div class="v">￥<strong>{{ pharmacyHomeInfo.data.today.amountSum || 0 }}</strong></div>
              </div>
            </div></el-col>
            <el-col :span="6"><div class="grid-content">
              <div class="x-item x-item02">
                <div class="t">当日处方数(单)</div>
                <div class="v"><strong>{{ pharmacyHomeInfo.data.today.orderCount || 0 }}</strong></div>
              </div>
            </div></el-col>
            <el-col :span="6"><div class="grid-content">
              <div class="x-item x-item03">
                <div class="t">昨日总额(元)</div>
                <div class="v">￥<strong>{{ pharmacyHomeInfo.data.yesterday.amountSum || 0 }}</strong></div>
              </div>
            </div></el-col>
            <el-col :span="6"><div class="grid-content">
              <div class="x-item x-item04">
                <div class="t">昨日处方数(单)</div>
                <div class="v"><strong>{{ pharmacyHomeInfo.data.yesterday.orderCount || 0 }}</strong></div>
              </div>
            </div></el-col>
          </el-row>
        </div>
      </div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24"><div class="grid-content bg-purple">
        <div class="filter-container">
          <el-button class="filter-item" @click="resetSearch()" icon="el-icon-refresh">刷新</el-button>
        </div>
        <el-table
          @selection-change="handleSelectionChange"
          :data="pharmacyGoods.data"
          v-loading="listLoading"
          border
          style="width: 100%">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column fixed prop="itemName" width="200" label="药品名称"></el-table-column>
          <el-table-column prop="spec" label="规格"></el-table-column>
          <el-table-column prop="manufacturer" width="300" label="厂家"></el-table-column>
          <el-table-column prop="store" label="库存" class-name="inng" ></el-table-column>
          <el-table-column prop="tinyStore" width="100" label="散装库存"></el-table-column>
          <el-table-column prop="price" width="80" label="价格(元)"></el-table-column>
          <el-table-column prop="marketable" label="上架状态">
            <template slot-scope="scope">
              {{scope.row.marketable | yesOrNo}}
            </template>
          </el-table-column>
          <el-table-column prop="marketableTime" width="152" label="上架时间">
            <template slot-scope="scope">
              {{scope.row.marketableTime | dateFormat}}
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
            layout="total, sizes, prev, pager, next, jumper" :total="pharmacyGoods.total">
          </el-pagination>
        </div>
      </div></el-col>
    </el-row>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible"
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
      font-size: 30px;
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
    padding-top:35px;
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

/*.el-table__row >>> .ing  {*/
  /*color:red;*/
/*}*/
.el-table__row {
  .inng{
    background-color: #000;
  }

}
</style>

<script>
import { mapState } from 'vuex'
import { getConstants } from '@/utils/constants'
import { getToken } from '@/utils/auth'
import moment from 'moment'
import { Message } from 'element-ui';

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: { pharmacyId: -1, storeMax: 9 }},
      dialogVisible: false,
      mTitle: '',
      marketableTime: '',
      attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
      importGoodsUrl: '',
      fileList: [],
      activeName: 'first',
      pharmacyId: '',
      outTradeNo: '',
      mObject: {
        pharmacyId: null
      },
      checkTimer: null,
      amounts: [100, 200, 300, 500, 1000, 2000, 3000, 5000],
      activeAmount: '',
      headersData: { Authorization: getToken() },
      couponRules: {
        couponCode: [
          { required: true, message: '请输入优惠券码', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getPharmacyGoodsList()
    this.getPharmacyHomeInfo()
  },
  computed: mapState({
    pharmacyGoods: state => state.pharmacyGoods.pharmacyGoods,
    pharmacyHomeInfo: state => state.pharmacyGoods.pharmacyHomeInfo
  }),
  methods: {
    getPharmacyGoodsList() {
      if (this.marketableTime) {
        this.param.searchCondition.marketableTimeStart = moment(this.marketableTime[0]).format('YYYY-MM-DD')
        this.param.searchCondition.marketableTimeEnd = moment(this.marketableTime[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getPharmacyGoodsList', { params: this.param }).then(() => {
        this.listLoading = false
      })
    },
    getPharmacyHomeInfo() {
      this.$store.dispatch('getPharmacyHomeInfo', { pharmacyId: -1 })
    },
    getSaasPayQrcode(amount) {
      if (amount > 0 && this.activeAmount === amount) {
        this.activeAmount = ''
        clearInterval(this.checkTimer)
        return false
      }
      if (amount === -1) {
        amount = this.mObject.amount
      }
      this.activeAmount = amount

      let amountReg = /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/
      if (!amount) {
        this.$message({
          type: 'error',
          message: '充值金额不能为空!',
          duration: 3 * 1000
        })
        return false
      } if (!amountReg.test(amount)) {
        this.$message({
          type: 'error',
          message: '请输入正确金额!',
          duration: 3 * 1000
        })
        return false
      }
      const params = {
        amount: amount,
        businessId: this.pharmacyId,
        id: this.outTradeNo,
        payTypeCode: 'saaspay'
      }
      console.log(params,99)
      this.$store.dispatch('getSaasPayQrcode', params).then(response => {
        console.log(response)
        document.getElementById("qrcode").innerHTML = ''
        new QRCode(document.getElementById("qrcode"), {
          text: response.data.qrcode,
          width: 240,
          height: 240
        })
        this.outTradeNo = response.data.outTradeNo
        if (this.checkTimer) {
          clearInterval(this.checkTimer)
        }
        this.checkTimer = setInterval(() => {
          this.getPayStatusTimer(this.outTradeNo)
        },3000)
      })
    },
    getPayStatusTimer(outTradeNo) {
      const localCheckTime = this.checkTimer
      this.$store.dispatch('getPayStatus', { outTradeNo }).then(function(response) {
        if (response.data.payStatus) {
          clearInterval(localCheckTime)
          Message({
            message: '支付成功',
            type: 'success'
          });
        }
      })
    },
    closeDialog(done) {
      console.log(1)
      this.activeAmount = ''
      clearInterval(this.checkTimer)
      this.dialogVisible = false
      done && done()
    },
    resetSearch() {
      this.param.searchCondition = { pharmacyId: -1, storeMax: 9 }
      this.getPharmacyGoodsList()
    },
    useCashCoupon() {
      this.$store.dispatch('useCashCoupon', { id: this.pharmacyId, couponCode: this.mObject.couponCode }).then(function(response) {
        this.dialogVisible = false
      }).then((error) => {
        Message({
          message: error.msg,
          type: 'error'
        });
      })
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getPharmacyGoodsList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getPharmacyGoodsList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    edit(row) {
      this.mTitle = '余额充值'
      this.pharmacyId = row.pharmacy.id
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    }
  }
}
</script>
