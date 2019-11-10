<template>
  <div class="app-container">
    <div class="current-pharmacy">
      {{ currentPharmacy.name }} 地址：{{ currentPharmacy.address }} 联系电话：{{ currentPharmacy.leaderTel }} <el-button type="primary" size="mini" @click="charging(currentPharmacy)">更新</el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" @click="resetSearch()" icon="el-icon-refresh">刷新</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeAccountMgts.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection"  width="55"></el-table-column>
      <el-table-column fixed="right" prop="hspName" label="医院"></el-table-column>
      <el-table-column prop="line" label="线路"></el-table-column>
      <el-table-column fixed="right" label="操作" width="216">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteFinanceAccountMgt(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="financeAccountMgts.total">
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
    <!--:before-close="closeDialog"-->
    <el-dialog
      title="修改"
      :close-on-click-modal=false
      :visible.sync="chargingDialogVisible"
      width="800px">
      <el-form :model="mObject" :rules="rules" ref="mCharging" label-width="120px">
        <el-form-item label="药店名称" prop="name">
          <el-input disabled v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="药店图片" prop="img">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadLogoSuccess"
            accept="image/*">
            <img v-if="mObject.img" :src="mObject.img" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="mObject.address"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="leaderTel">
          <el-input v-model="mObject.leaderTel"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chargingDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitPharmacyForm">确 定</el-button>
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
.pic-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.pic-uploader .el-upload:hover {
  border-color: #409eff;
}
.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.logo {
  width: 120px;
  height: 120px;
  display: block;
}
.pharmacy-img {
  width: 120px;
  height: 120px;
  display: block;
}
</style>


<script>
import { mapState } from "vuex";
import { getToken } from "@/utils/auth";
import { getConstants } from "@/utils/constants";
let validateIdCard = (rule, value, callback) => {
  let reg = /^1(3|4|5|6|7|8)\d{9}$/;
  if (!reg.test(value)) {
    return "请输入11位数电话号码"
  } else {
    return true
  }
};
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

      attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
      attachmentUrl: getConstants().ATTACHMENT_URL,

      mCharging: {},
      chargingDialogVisible: false,

      rules: {
        pharmacyId: [
          { required: true, message: "请选择药店", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "请输入账户余额", trigger: "blur" }
        ],
        currencyCode: [
          { required: true, message: "请选择币种", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择账户状态", trigger: "blur" }
        ],
        withdrawable: [
          { required: true, message: "请选择是否可提现", trigger: "blur" }
        ],
        openDate: [
          { required: true, message: "请选择开户时间", trigger: "blur" }
        ],
        creditLine: [
          { required: true, message: "请输入信用额度", trigger: "blur" }
        ]
      },

      chargingRules: {
        chargingAmount: [
          { required: true, message: "请输入充值金额", trigger: "blur" }
        ],
        chargingMemo: [
          { required: true, message: "请输入备注", trigger: "blur" }
        ]
      },

      upLoadData: {
        file_id: 0
      },
      headersData: { Authorization: getToken() }
    };
  },
  filters: {},
  created() {
    this.getFinanceAccountMgtList();
    this.getCurrentPharmacy();
  },
  computed: mapState({
    financeAccountMgts: state => state.financeAccount.financeAccountMgts,
    currentPharmacy: state => state.financeAccount.currentPharmacy
  }),
  methods: {
    getFinanceAccountMgtList() {
      this.listLoading = true;
      this.$store.dispatch("getFinanceAccountMgtList", {
        params: this.param,
        callback: () => {
          this.listLoading = false;
        }
      });
    },
    getCurrentPharmacy() {
      this.$store.dispatch("getCurrentPharmacy", { params: this.param });
    },
    resetSearch() {
      this.param.searchCondition = {};
      this.getFinanceAccountMgtList();
    },
    handleSizeChange(size) {
      this.param.limit = size;
      this.getFinanceAccountMgtList();
    },
    handleCurrentChange(page) {
      this.param.page = page;
      this.getFinanceAccountMgtList();
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    uploadLogoSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.img = this.attachmentUrl + response.data;
      }
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = "编辑";
      this.pharmacySelectDisabled = true;
      if (!row) {
        this.mTitle = "新增";
        this.pharmacySelectDisabled = false;
        row = {
          bankCard: {},
          currencyCode: "CNY",
          withdrawable: false,
          status: true,
          creditLine: 0,
          img: ""
        };
      }
      this.mObject = Object.assign({}, row);
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["mObject"].clearValidate();
      });
    },
    // 删除角色
    deleteFinanceAccountMgt(role) {
      this.$confirm("此操作将永久删除该账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("deleteFinanceAccountMgt", {
          data: role,
          callback: () => {
            this.$message({
              type: "success",
              message: "删除成功!",
              duration: 3 * 1000
            });
            this.getFinanceAccountMgtList();
          }
        });
      });
    },
    // 批量删除角色
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
      this.deleteFinanceAccountMgt({ id: idsArr.join(",") });
    },
    // 提交表单
    submitForm() {
      this.$refs["mObject"].validate(valid => {
        if (valid) {
          if (this.mObject.id) {
            this.$store.dispatch("editFinanceAccountMgt", {
              data: this.mObject,
              callback: () => {
                this.$message({
                  message: "更新成功",
                  type: "success",
                  duration: 3 * 1000
                });
                this.dialogVisible = false;
                this.getFinanceAccountMgtList();
              }
            });
          } else {
            this.$store.dispatch("addFinanceAccount", {
              data: this.mObject,
              callback: () => {
                this.$message({
                  message: "添加成功",
                  type: "success",
                  duration: 3 * 1000
                });
                this.dialogVisible = false;
                this.getFinanceAccountMgtList();
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 提交表单
    submitPharmacyForm() {
      this.$refs["mCharging"].validate(valid => {
        if (valid) {
          let phone = validateIdCard('',this.mObject.leaderTel)
          if(phone !== true){
            return this.$message.error(phone)
          }
          if (this.mObject.id) {
            this.$store.dispatch("editPharmacy", {
              data: {
                id: this.mObject.id,
                img: this.mObject.img,
                address: this.mObject.address,
                leaderTel: this.mObject.leaderTel
              },
              callback: () => {
                this.$message({
                  message: "更新成功",
                  type: "success",
                  duration: 3 * 1000
                });
                this.chargingDialogVisible = false;
                this.getFinanceAccountMgtList();
                this.getCurrentPharmacy();
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    charging(row) {
      console.log(this.mObject,444)
      this.mObject = Object.assign({}, row);
      this.chargingDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["mCharging"].clearValidate();
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
              this.getFinanceAccountMgtList();
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
