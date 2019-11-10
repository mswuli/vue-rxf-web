<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.itemName" class="filter-item" placeholder="药品名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.brand" class="filter-item" placeholder="品牌">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.goodsBarcode" class="filter-item" placeholder="药品条码">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.approvalNumber" class="filter-item" placeholder="批准文号">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.identificationCode" placeholder="药品类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in goodsTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.cfPropertyCode" placeholder="处方类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in skuTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.statusCode" placeholder="状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in goodsStatus"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-button class="filter-item" @click="getGoodsSkuList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="goodsSkus.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="itemName" width="200" label="药品名称"></el-table-column>
      <el-table-column prop="brand" width="150" label="品牌"></el-table-column>
      <el-table-column prop="spec" width="150" label="规格"></el-table-column>
      <el-table-column prop="unit" width="50" label="单位"></el-table-column>
      <el-table-column prop="goodsBarcode" label="药品条码"></el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号"></el-table-column>
      <el-table-column prop="identificationName" width="80" label="药品类型"></el-table-column>
      <el-table-column prop="cfPropertyName" label="处方类型" width="100"></el-table-column>
      <el-table-column prop="marketPrice" label="市场价（元）" width="70"></el-table-column>
      <el-table-column prop="statusName" label="状态" width="50"></el-table-column>
      <el-table-column fixed="right" label="操作" width="75">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showItem(scope.row)">拆零</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="goodsSkus.total">
      </el-pagination>
    </div>

    <el-dialog
      title="拆零明细"
      :close-on-click-modal=false
      :visible.sync="itemDialogVisible">
      <div class="filter-container">
        <el-button class="filter-item" @click="getItemTinyRate()" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
        <!--<el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>-->
      </div>
      <el-table
        @selection-change="handleSelectionChange"
        :data="itemTinyRatesData"
        :span-method="objectSpanMethod"
        v-loading="itemTinyRatesListLoading"
        border
        style="width: 100%">
        <el-table-column prop="hspSkuRelVO.hspName" label="医院"></el-table-column>
        <el-table-column prop="hspSkuRelVO.hspSkuSpec" label="医院药品规格"></el-table-column>
        <el-table-column prop="hspSkuRelVO.hspSkuUnit" label="医院药品单位" width="50"></el-table-column>
        <el-table-column prop="unitCode" label="单位" width="50"></el-table-column>
        <el-table-column prop="amount" label="最小单位换算比例" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="144">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteTinyRate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="单位" prop="identificationCode">
          <el-input v-model="mObject.unitCode"></el-input>
        </el-form-item>
        <el-form-item label="最小拆零单位换算比例" prop="amount">
          <el-input v-model="mObject.amount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.text {
  font-size: 14px;
}

.item {
  padding: 0px 0;
}
</style>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {} },
      dialogVisible: false,
      itemDialogVisible: false,
      mObject: {},
      mTitle: "",
      itemRow: {},
      itemTinyRatesListLoading: false,
      itemTinyRatesData: null,
      rules: {
        itemName: [
          { required: true, message: "请输入药品名称", trigger: "blur" }
        ]
      }
    };
  },
  filters: {},
  created() {
    this.getGoodsSkuList();
    this.getGoodsTypeList();
    this.getSkuTypeList();
    this.getStatusList();
  },
  computed: mapState({
    goodsSkus: state => state.goodsSku.goodsSkus,
    itemTinyRates: state => state.goodsSku.itemTinyRates,
    itemTinyRateUnits: state => state.goodsSku.itemTinyRateUnits,
    goodsTypes: state => state.goodsSku.goodsTypes,
    skuTypes: state => state.goodsSku.skuTypes,
    goodsStatus: state => state.goodsSku.goodsStatus
  }),
  methods: {
    getGoodsSkuList() {
      this.listLoading = true;
      this.$store.dispatch("getGoodsSkuList", {
        params: this.param,
        callback: () => {
          this.listLoading = false;
        }
      });
    },
    getGoodsTypeList() {
      this.$store.dispatch("getGoodsSkuTypeList");
    },
    getSkuTypeList() {
      this.$store.dispatch("getSkuTypeList");
    },
    getStatusList() {
      this.$store.dispatch("getSkuStatusList");
    },
    resetSearch() {
      this.param.searchCondition = {};
      this.getGoodsSkuList();
    },
    handleSizeChange(size) {
      this.param.limit = size;
      this.getGoodsSkuList();
    },
    handleCurrentChange(page) {
      this.param.page = page;
      this.getGoodsSkuList();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    showItem(row) {
      this.itemDialogVisible = true;
      this.itemRow = row;
      this.getItemTinyRate();
      this.getItemTinyRateUnit();
    },
    getItemTinyRate() {
      this.itemTinyRatesListLoading = true;
      this.$store.dispatch("getItemTinyRate", {
        params: { id: this.itemRow.id },
        callback: () => {
          this.itemTinyRatesData = [];
          for (const item of this.itemTinyRates.data) {
            if (
              item.hspSkuRelVOList != null &&
              item.hspSkuRelVOList.length > 0
            ) {
              let rowspan = item.hspSkuRelVOList.length;
              let colspan = 1;
              for (const hspSkuRelVO of item.hspSkuRelVOList) {
                const newItem = Object.assign({}, item);
                newItem.hspSkuRelVO = hspSkuRelVO;
                newItem.rowspan = rowspan;
                newItem.colspan = colspan;
                rowspan = 0;
                colspan = 0;
                this.itemTinyRatesData.push(newItem);
              }
            } else {
              const newItem = Object.assign({}, item);
              newItem.hspSkuRelVO = null;
              newItem.rowspan = 1;
              newItem.colspan = 1;
              this.itemTinyRatesData.push(newItem);
            }
          }
          this.itemTinyRatesListLoading = false;
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 2) {
        return {
          rowspan: this.itemTinyRatesData[rowIndex].rowspan,
          colspan: this.itemTinyRatesData[rowIndex].colspan
        };
      }
    },
    getItemTinyRateUnit() {
      this.$store.dispatch("getItemTinyRateUnit", { params: {} });
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = "编辑";
      if (!row) {
        this.mTitle = "新增";
        row = {};
      }
      this.mObject = Object.assign({ skuId: this.itemRow.id }, row);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["mObject"].clearValidate();
      });
    },
    // 删除
    deleteTinyRate(role) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("deleteTinyRate", {
          data: role,
          callback: () => {
            this.$message({
              type: "success",
              message: "删除成功!",
              duration: 3 * 1000
            });
            this.getItemTinyRate();
          }
        });
      });
    },
    // 批量删除
    deleteMulti() {
      const idsArr = [];
      for (const row of this.selectedRows) {
        idsArr.push(row.id);
      }
      if (!idsArr.length) {
        this.$message({
          type: "error",
          message: "请先选择需要删除的项!",
          duration: 3 * 1000
        });
        return false;
      }
      this.deleteTinyRate({ id: idsArr.join(",") });
    },
    // 提交表单
    submitForm() {
      this.$refs["mObject"].validate(valid => {
        if (valid) {
          console.log(this.mObject);
          if (this.mObject.id) {
            this.$store.dispatch("editTinyRate", {
              data: this.mObject,
              callback: () => {
                this.$message({
                  message: "更新成功",
                  type: "success",
                  duration: 3 * 1000
                });
                this.dialogVisible = false;
                this.getItemTinyRate();
              }
            });
          } else {
            this.$store.dispatch("addTinyRate", {
              data: this.mObject,
              callback: () => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                  duration: 3 * 1000
                });
                this.dialogVisible = false;
                this.getItemTinyRate();
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
