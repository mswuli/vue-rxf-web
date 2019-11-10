<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="服务名称">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.statusCode" placeholder="服务状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in serviceStatus.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.feeScaleCode" placeholder="收费标准">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in serviceFee.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button class="filter-item" @click="getSettingServiceList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="settingServices.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="name" width="150" label="服务名称"></el-table-column>
      <el-table-column fixed prop="description" label="服务描述"></el-table-column>
      <el-table-column fixed prop="statusName" label="服务状态"></el-table-column>
      <el-table-column fixed prop="feeScaleName" label="收费标准"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteSettingService(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="settingServices.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="服务分类" prop="classify">
          <el-input v-model="mObject.classify"></el-input>
        </el-form-item>
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="服务描述" prop="description">
          <el-input v-model="mObject.description"></el-input>
        </el-form-item>
        <el-form-item label="服务状态" prop="statusCode">
          <el-select v-model="mObject.statusCode" placeholder="请选择服务状态">
            <el-option
              v-for="item in serviceStatus.data"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收费标准" prop="feeScaleCode">
          <el-select v-model="mObject.feeScaleCode" placeholder="请选择收费标准">
            <el-option
              v-for="item in serviceFee.data"
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

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      mObject: {
      },
      mTitle: '',

      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入模板内容', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getSettingServiceList()
    this.getServiceStatus()
    this.getServiceFee()
  },
  computed: mapState({
    settingServices: state => state.settingService.settingServices,
    serviceStatus: state => state.settingService.serviceStatus,
    serviceFee: state => state.settingService.serviceFee
  }),
  methods: {
    getSettingServiceList() {
      this.listLoading = true
      this.$store.dispatch('getSettingServiceList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getServiceStatus() {
      this.$store.dispatch('getServiceStatus', { params: this.param })
    },
    getServiceFee() {
      this.$store.dispatch('getServiceFee', { params: this.param })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getSettingServiceList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getSettingServiceList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getSettingServiceList()
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
      }
      this.mObject = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 删除角色
    deleteSettingService(role) {
      this.$confirm('此操作将永久删除该服务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteSettingService', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getSettingServiceList()
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
      this.deleteSettingService({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editSettingService', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSettingServiceList()
            } })
          } else {
            this.$store.dispatch('addSettingService', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSettingServiceList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
