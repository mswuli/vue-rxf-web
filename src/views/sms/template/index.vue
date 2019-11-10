<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.smsCode" class="filter-item" placeholder="业务代码">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.templateCode" class="filter-item" placeholder="模板代码">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.providerCodeName" placeholder="服务商代码">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in providerCodes.data"
          :key="item.id"
          :label="item.companyName"
          :value="item.companyCode">
        </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.templateTypeName" placeholder="模版类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in templateTypes.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button class="filter-item" @click="getSMSTemplateList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="smsTemplates.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="smsCode" label="业务代码"></el-table-column>
      <el-table-column prop="templateCode" label="模板代码"></el-table-column>
      <el-table-column prop="providerCodeName" label="服务商代码"></el-table-column>
      <el-table-column prop="templateTypeName" label="模板类型"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteSMSTemplate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="smsTemplates.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="业务代码" prop="smsCode">
          <el-input v-model="mObject.smsCode"></el-input>
        </el-form-item>
        <el-form-item label="模版代码" prop="templateCode">
          <el-input v-model="mObject.templateCode"></el-input>
        </el-form-item>
        <el-form-item label="服务商代码" prop="providerCode">
          <el-select v-model="mObject.providerCode" placeholder="请选择服务商">
            <el-option
              v-for="item in providerCodes.data"
              :key="item.id"
              :label="item.companyName"
              :value="item.companyCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模版" prop="content">
          <el-input type="textarea" autosize v-model="mObject.content"></el-input>
        </el-form-item>
        <el-form-item label="连接超时" prop="connectTimeout">
          <el-input v-model="mObject.connectTimeout"></el-input>
        </el-form-item>
        <el-form-item label="读取超时" prop="readTimeout">
          <el-input v-model="mObject.readTimeout"></el-input>
        </el-form-item>
        <el-form-item label="模版类型" prop="templateTypeName">
          <el-select v-model="mObject.templateTypeName" placeholder="请选择模版类型">
            <el-option
              v-for="item in templateTypes.data"
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
        smsCode: [
          { required: true, message: '请输入业务代码', trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: '请输入模版代码', trigger: 'blur' }
        ],
        providerCodeName: [
          { required: true, message: '请选择服务商代码', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入模版', trigger: 'blur' }
        ],
        templateTypeName: [
          { required: true, message: '请选择模版类型', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getSMSTemplateList()
    this.getProviderCodeList()
    this.getTemplateTypeList()
  },
  computed: mapState({
    smsTemplates: state => state.smsTemplate.smsTemplates,
    providerCodes: state => state.smsProvider.providerCodes,
    templateTypes: state => state.smsTemplate.templateTypes
  }),
  methods: {
    getSMSTemplateList() {
      this.listLoading = true
      this.$store.dispatch('getSMSTemplateList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getProviderCodeList() {
      this.$store.dispatch('getProviderCodeList', { params: this.param })
    },
    getTemplateTypeList() {
      this.$store.dispatch('getTemplateTypeList', { params: this.param })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getSMSTemplateList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getSMSTemplateList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getSMSTemplateList()
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
    deleteSMSTemplate(role) {
      this.$confirm('此操作将永久删除该短信模版, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteSMSTemplate', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getSMSTemplateList()
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
      this.deleteSMSTemplate({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editSMSTemplate', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSMSTemplateList()
            } })
          } else {
            this.$store.dispatch('addSMSTemplate', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSMSTemplateList()
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
