<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="药店名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.tel" class="filter-item" placeholder="联系电话">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.typeCode" placeholder="药店类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in pharmacyTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.verifyStatusCode" placeholder="状态">

        <el-option
          v-for="item in pharmacyStatus"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-button class="filter-item" @click="getPharmacyList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="pharmacys.data"
      v-loading="pharmacysLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="name" width="200" label="药店名称"></el-table-column>
      <el-table-column fixed prop="shortName" width="150" label="药店简称"></el-table-column>
      <el-table-column prop="inUse" label="启用状态">
        <template slot-scope="scope">
          {{scope.row.inUse | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="verifyStatusName" width="150" label="审核状态"></el-table-column>
      <el-table-column prop="province" width="200" label="详细地址">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="leader" label="法人"></el-table-column>
      <el-table-column prop="tel" label="联系电话"></el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openServices(scope.row)">开通服务</el-button>
          <el-button type="primary" size="mini" @click="edit(scope.row)">查看服务详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="pharmacys.total">
      </el-pagination>
    </div>

    <el-dialog
      title="服务开通"
      :close-on-click-modal=false
      width="60%"
      :visible.sync="serviceDialogVisible">
      <el-table
        @selection-change="handleSelectionChange"
        :data="pharmacyServices.data"
        v-loading="pharmacyServicesLoading"
        border
        style="width: 100%">
        <el-table-column prop="name" width="120" label="服务名称"></el-table-column>
        <el-table-column prop="classify" width="120" label="服务分类"></el-table-column>
        <el-table-column prop="description" label="服务描述"></el-table-column>
        <el-table-column prop="feeScaleName" width="120" label="收费标准"></el-table-column>
        <el-table-column fixed="right" label="操作" width="76">
          <template slot-scope="scope">
            <el-button v-if="scope.row.iOpened != 1" type="primary" size="mini" @click="renew(scope.row)">设置</el-button>
            <div v-else>
              <el-button v-if="scope.row.feeScaleCode != 1" type="primary" size="mini" @click="renew(scope.row)">续费</el-button>
              <span v-else>已续费</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="serviceDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="cdtTitle"
      :close-on-click-modal=false
      :visible.sync="renewDialogVisible">
      <el-form :model="mRenew" :rules="rules" ref="mRenew" label-width="120px">
        <el-form-item label="金额">
          <div class="radio" v-for="cdt in serviceCdt" v-bind:key="cdt.id">
            <el-radio v-model="serviceManageDetailId" :label="cdt.id">
              <template>
                {{ cdt.name }}
                <el-input v-model="cdt.price"></el-input>
                {{ cdt.unit }}
              </template>
            </el-radio>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="renewDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="已开通历史服务"
      :close-on-click-modal=false
      :visible.sync="dialogVisible"
      width="70%">
      <el-table
        @selection-change="handleSelectionChange"
        :data="serviceDetail.data"
        v-loading="serviceDetailLoading"
        border
        style="width: 100%">
        <el-table-column prop="serviceManageName" label="服务类型名称"></el-table-column>
        <el-table-column prop="serviceManageDetailName" label="费用明细名称"></el-table-column>
        <el-table-column prop="feeScaleName" label="收费标准"></el-table-column>
        <el-table-column prop="serviceDay" width="80" label="服务月数"></el-table-column>
        <el-table-column prop="servicePrice" width="80" label="费用价格"></el-table-column>
        <el-table-column prop="startTime" width="152" label="服务开始时间">
          <template slot-scope="scope">
            {{scope.row.startTime | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" width="152" label="服务结束时间">
          <template slot-scope="scope">
            {{scope.row.endTime | dateFormat}}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleServiceSizeChange" @current-change="handleServiceCurrentChange"
          :current-page="serviceParam.searchCondition.page" :page-sizes="[10,20,30, 50]" :page-size="serviceParam.searchCondition.limit"
          layout="total, sizes, prev, pager, next, jumper" :total="serviceDetail.total">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.radio {
  margin-bottom: 10px;
}
</style>


<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      pharmacysLoading: false,
      pharmacyServicesLoading: false,
      serviceDetailLoading: false,
      param: { page: 1, limit: 10, searchCondition: {} },
      dialogVisible: false,
      mObject: {},
      mTitle: "",

      mRenew: {},

      serviceManageDetailId: "",

      cdtTitle: "续费标题",
      cdtUnit: "",

      renewDialogVisible: false,

      serviceDialogVisible: false,

      pharmacyId: "",

      serviceParam: { page: 1, limit: 10, searchCondition: {} }
    };
  },
  filters: {},
  created() {
    this.getPharmacyList();
    this.getPharmacyTypeList();
    this.getPharmacyStatusList();
  },
  computed: mapState({
    pharmacys: state => state.pharmacy.pharmacys,
    pharmacyTypes: state => state.pharmacy.pharmacyTypes,
    pharmacyStatus: state => state.pharmacy.pharmacyStatus,
    pharmacyServices: state => state.pharmacy.pharmacyServices,
    serviceCdt: state => state.pharmacy.serviceCdt,
    serviceDetail: state => state.pharmacy.serviceDetail
  }),
  methods: {
    getPharmacyList() {
      this.pharmacysLoading = true;
      this.$store.dispatch("getPharmacyList", {
        params: this.param,
        callback: () => {
          this.pharmacysLoading = false;
        }
      });
    },
    getPharmacyTypeList() {
      this.$store.dispatch("getPharmacyTypeList");
    },
    getPharmacyStatusList() {
      this.$store.dispatch("getPharmacyStatusList");
    },
    getPharmacyServices(params) {
      this.pharmacyServicesLoading = true;
      this.$store.dispatch("getPharmacyServices", {
        params: params,
        callback: () => {
          this.pharmacyServicesLoading = false;
        }
      });
    },
    getServiceCdt(params) {
      this.$store.dispatch("getServiceCdt", {
        data: { params: params },
        callback: () => {
          for (const cdt of this.serviceCdt) {
            if (cdt.name === "按处方总量") {
              this.$set(cdt, "unit", "元/例");
            } else if (cdt.name === "按处方金额") {
              this.$set(cdt, "unit", "元");
            } else {
              this.$set(cdt, "unit", this.cdtUnit);
            }
          }
        }
      });
    },
    resetSearch() {
      this.param.searchCondition = {};
      this.getPharmacyList();
    },
    handleSizeChange(size) {
      this.param.limit = size;
      this.getPharmacyList();
    },
    handleCurrentChange(page) {
      this.param.page = page;
      this.getPharmacyList();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    handleServiceSizeChange(size) {
      this.serviceParam.limit = size;
      this.getServiceDetail();
    },
    handleServiceCurrentChange(page) {
      this.serviceParam.page = page;
      this.getServiceDetail();
    },
    getServiceDetail() {
      this.serviceDetailLoading = true;
      this.$store.dispatch("getServiceDetail", {
        params: this.serviceParam,
        callback: () => {
          this.serviceDetailLoading = false;
        }
      });
    },
    // 查看服务详情
    edit(row) {
      this.serviceParam.searchCondition.pharmacyId = row.id;
      this.dialogVisible = true;
      this.getServiceDetail();
    },
    openServices(row) {
      this.serviceDialogVisible = true;
      this.pharmacyId = row.id;
      this.getPharmacyServices({ id: row.id });
    },

    renew(row) {
      this.renewDialogVisible = true;
      this.mRenew = {
        feeScaleCode: row.feeScaleCode
      };
      this.serviceManageDetailId = "";
      switch (row.feeScaleCode) {
        case "2":
          this.cdtTitle = "服务续费";
          this.cdtUnit = "元";
          break;
        case "3":
          this.cdtTitle = "短信续费";
          this.cdtUnit = "（元/条）";
          break;
        case "4":
          this.cdtTitle = "佣金续费";
          this.cdtUnit = "";
          break;
        default:
          this.cdtUnit = "元";
          break;
      }
      this.getServiceCdt({ feeScaleCode: row.feeScaleCode });
    },

    submitForm() {
      const pharmacyId = this.pharmacyId;
      let serviceManageId, servicePrice;
      if (!this.serviceManageDetailId) {
        this.$message({
          type: "error",
          message: "请选择类型!",
          duration: 3 * 1000
        });
        return false;
      }
      for (const cdt of this.serviceCdt) {
        if (cdt.id === this.serviceManageDetailId) {
          serviceManageId = cdt.serviceId;
          servicePrice = cdt.price;
        }
      }
      let amountReg = /^(([0-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/;

      if (!amountReg.test(servicePrice)) {
        this.$message({
          type: "error",
          message: "请输入正确金额!",
          duration: 3 * 1000
        });
        return false;
      }

      const pData = {
        pharmacyId: pharmacyId,
        serviceManageId: serviceManageId,
        servicePrice: servicePrice,
        serviceManageDetailId: this.serviceManageDetailId
      };
      this.$store.dispatch("postServiceCdt", {
        data: pData,
        callback: () => {
          this.$message({
            message: "续费成功",
            type: "success",
            duration: 3 * 1000
          });
          this.renewDialogVisible = false;
          this.getPharmacyServices({ id: pharmacyId });
        }
      });
    }
  }
};
</script>
