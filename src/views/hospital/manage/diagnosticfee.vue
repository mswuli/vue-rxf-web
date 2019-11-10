<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="名称">
      </el-input>
      <el-select style="width:200px;" v-model="param.searchCondition.hospitalId" placeholder="医院" filterable remote
                 :remote-method="getHospitalList" :loading="hspLoading">
        <el-option
          v-for="item in hospitals.data"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" @click="getDiagnosticFeeList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="diagnosticFees.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="name" label="名称"></el-table-column>
      <el-table-column prop="hospitalName" label="医院"></el-table-column>
      <el-table-column prop="doctorName" label="医生"></el-table-column>
      <el-table-column prop="fee" label="诊查费(元)"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteDiagnosticFee(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="diagnosticFees.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="医院" prop="hospitalName">
          <el-select style="width:300px;" v-model="mObject.hospitalName" placeholder="请输入医院名称" filterable remote
                     :remote-method="getHospitalList" :loading="hspLoading" @change="changeHsp()">
            <el-option
              v-for="item in hospitals.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医生" prop="doctorName">
          <el-select style="width:300px;" v-model="mObject.doctorName" placeholder="请选择医生">
            <el-option
              v-for="item in hospitalDoctors.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诊查费(元)" prop="fee">
          <el-input v-model="mObject.fee"></el-input>
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
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      listLoading: false,
      itemListLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      itemDialogVisible: false,
      itemEditDialogVisible: false,
      mObject: {},
      mItem: {},
      mCode: '',
      mTitle: '',
      mItemTitle: '',

      rules: {
        hospitalName: [
          { required: true, message: '请选择医院', trigger: 'blur' }
        ],
        doctorName: [
          { required: true, message: '请选择医生', trigger: 'blur' }
        ],
        fee: [
          { required: true, message: '请输入诊查费', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getDiagnosticFeeList()
  },
  computed: mapState({
    diagnosticFees: state => state.diagnosticFee.diagnosticFees,
    hospitals: state => state.hospital.hospitals,
    hospitalDoctors: state => state.hospital.hospitalDoctors
  }),
  methods: {
    getDiagnosticFeeList() {
      this.listLoading = true
      this.$store.dispatch('getDiagnosticFeeList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getHospitalList(query) {
      this.$store.dispatch('clearHospitalList')
      if (query !== '') {
        this.hspLoading = true
        this.$store.dispatch('getHospitalList', { params: { page: 0, limit: 10, searchCondition: { name: query }}, callback: () => {
          this.hspLoading = false
        } })
      }
    },
    changeHsp() {
      this.mObject.hospitalId = this.mObject.hospitalName
      this.getDoctorsByHospital(this.mObject.hospitalId)
    },
    getDoctorsByHospital(hspId) {
      this.$store.dispatch('getDoctorsByHospital', { params: {id: hspId}})
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getDiagnosticFeeList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getDiagnosticFeeList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getDiagnosticFeeList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '编辑'
      if (!row) {
        this.mTitle = '新增'
        row = {}
      } else {
        this.getDoctorsByHospital(row.hospitalId)
      }
      this.mObject = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 删除角色
    deleteDiagnosticFee(role) {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteDiagnosticFee', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getDiagnosticFeeList()
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
      this.deleteDiagnosticFee({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editDiagnosticFee', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getDiagnosticFeeList()
            } })
          } else {
            this.$store.dispatch('addDiagnosticFee', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getDiagnosticFeeList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleItemSelectionChange(val) {
      this.selectedItemRows = val
    }
  }
}
</script>
