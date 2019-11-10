<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.couponName" class="filter-item" placeholder="券名称">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.statusCode" placeholder="领取状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in cashStatusCode.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.useStatusCode" placeholder="使用状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in cashUseStatusCode.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button class="filter-item" @click="getCashList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
      <el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="cashs.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="couponName" width="150" label="券名称"></el-table-column>
      <el-table-column prop="couponNumber" label="编码"></el-table-column>
      <el-table-column prop="couponCode" label="激活码"></el-table-column>
      <el-table-column prop="couponTypeName" width="150" label="类型"></el-table-column>
      <el-table-column prop="denomination" width="100" label="面额（元）"></el-table-column>
      <el-table-column prop="caption" width="150" label="使用规则"></el-table-column>
      <el-table-column prop="description" width="150" label="描述"></el-table-column>
      <el-table-column width="152" prop="startTime" label="有效期开始时间">
        <template slot-scope="scope">
          {{scope.row.startTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column width="152" prop="endTime" label="有效期结束时间">
        <template slot-scope="scope">
          {{scope.row.endTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="statusName" label="领取状态"></el-table-column>
      <el-table-column prop="useStatusName" label="使用状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <template v-if="scope.row.statusName === '未领取'&&scope.row.useStatusName === '未使用'">
          <el-button type="danger" size="mini" @click="deleteCash(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="cashs.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="券名称" prop="couponName">
          <el-input v-model="mObject.couponName"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="couponNumber">
          <el-input v-model="mObject.couponNumber"></el-input>
        </el-form-item>
        <el-form-item label="激活码" prop="couponCode">
          <el-input v-model="mObject.couponCode"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="couponType">
          <el-select v-model="mObject.couponType" placeholder="请选择类型">
            <el-option
              v-for="item in cashCouponType.data"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面额（元）" prop="denomination">
          <el-input v-model="mObject.denomination"></el-input>
        </el-form-item>
        <el-form-item label="使用规则" prop="caption">
          <el-input v-model="mObject.caption"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="mObject.description"></el-input>
        </el-form-item>
        <el-form-item label="有效期开始时间" prop="startTime">
          <el-date-picker
            v-model="mObject.startTime"
            type="date"
            placeholder="请选择时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效期结束时间" prop="endTime">
          <el-date-picker
            v-model="mObject.endTime"
            type="date"
            placeholder="请选择时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="领取状态" prop="statusCode">
          <el-select v-model="mObject.statusCode" placeholder="请选择领取状态">
            <el-option
              v-for="item in cashStatusCode.data"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态" prop="useStatusCode">
          <el-select v-model="mObject.useStatusCode" placeholder="请选择使用状态">
            <el-option
              v-for="item in cashUseStatusCode.data"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { download } from '@/utils/export'

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      mTitle: '',
      mObject: {
      },
      rules: {
        couponName: [
          { required: true, message: '请输入券名称', trigger: 'blur' }
        ],
        couponNumber: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        couponCode: [
          { required: true, message: '请输入激活码', trigger: 'blur' }
        ],
        couponType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        denomination: [
          { required: true, message: '请输入面额', trigger: 'blur' }
        ],
        statusCode: [
          { required: true, message: '请选择领取状态', trigger: 'blur' }
        ],
        useStatusCode: [
          { required: true, message: '请选择使用状态', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择有效期开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择有效期结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getCashList()
    this.getCashStatus()
    this.getCashUseStatus()
    this.getCashCouponType()
  },
  computed: mapState({
    cashs: state => state.cash.cashs,
    cashStatusCode: state => state.cash.cashStatusCode,
    cashUseStatusCode: state => state.cash.cashUseStatusCode,
    cashCouponType: state => state.cash.cashCouponType
  }),
  methods: {
    getCashList() {
      this.listLoading = true
      this.$store.dispatch('getCashList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getCashStatus() {
      this.$store.dispatch('getCashStatus', { params: {}})
    },
    getCashUseStatus() {
      this.$store.dispatch('getCashUseStatus', { params: {}})
    },
    getCashCouponType() {
      this.$store.dispatch('getCashCouponType', { params: {}})
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getCashList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getCashList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getCashList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '编辑'
      if (!row) {
        this.mTitle = '新增'
        row = {
          statusCode: '未领取',
          useStatusCode: '未使用'
        }
      }
      this.mObject = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 删除角色
    deleteCash(role) {
      this.$confirm('此操作将永久删除该现金券, 是否继续?', '提示（只有未领取，未使用的方可删除）', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteCash', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getCashList()
        } })
      })
    },
    // 批量删除角色
    deleteMulti() {
      const idsArr = []
      for (const row of this.selectedRows) {
        idsArr.push(row.id)
      }
      if (!idsArr.length) {
        this.$message({
          type: 'error',
          message: '请先选择需要删除的项!',
          duration: 3 * 1000
        })
        return false
      }
      this.deleteCash({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      let amountReg = /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/
      if (!amountReg.test(this.mObject.denomination)) {
        this.$message({
          type: 'error',
          message: '请输入正确的面额!',
          duration: 3 * 1000
        })
        return false
      }
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editCash', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getCashList()
            } })
          } else {
            this.$store.dispatch('addCash', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getCashList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    exportFile() {
      const url = '/business/promotion/promotionCashCoupon/export'
      download(url, this.param, '现金券')
    }
  }
}
</script>
