<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.companyName" class="filter-item" placeholder="公司名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.companyCode" class="filter-item" placeholder="公司code">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.inUse" placeholder="是否启用">
        <el-option label="全部" value=""></el-option>
        <el-option label="是" value="1"></el-option>
        <el-option label="否" value="0"></el-option>
      </el-select>
      <el-input style="width: 120px;" v-model="param.searchCondition.companyPeople" class="filter-item" placeholder="责任人">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.signing" placeholder="是否签约公司">
        <el-option label="全部" value=""></el-option>
        <el-option label="是" value="1"></el-option>
        <el-option label="否" value="0"></el-option>
      </el-select>
      <el-input style="width: 120px;" v-model="param.searchCondition.product" class="filter-item" placeholder="产品名称">
      </el-input>
      <el-button class="filter-item" @click="getSMSProviderList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="providers.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="companyName" width="150" label="公司名称"></el-table-column>
      <el-table-column prop="companyCode" width="150" label="公司code"></el-table-column>
      <el-table-column label="是否启用" width="100">
        <template slot-scope="scope">
          {{scope.row.inUse | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="companyPeople" width="150" label="责任人"></el-table-column>
      <el-table-column prop="mobile" width="150" label="责任人电话"></el-table-column>
      <el-table-column label="是否签约公司" width="150">
        <template slot-scope="scope">
          {{scope.row.signing | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="signName" width="120" label="短信签名"></el-table-column>
      <el-table-column prop="product" width="120" label="产品名称"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteSMSProvider(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="providers.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="mObject.companyName"></el-input>
        </el-form-item>
        <el-form-item label="公司code" prop="companyCode">
          <el-input v-model="mObject.companyCode"></el-input>
        </el-form-item>
        <el-form-item label="calssService路径" prop="classPath">
          <el-input v-model="mObject.classPath"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="inUse">
          <el-select v-model="mObject.inUse" placeholder="请选择是否启用">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="companyPeople">
          <el-input v-model="mObject.companyPeople"></el-input>
        </el-form-item>
        <el-form-item label="责任人电话" prop="mobile">
          <el-input v-model="mObject.mobile"></el-input>
        </el-form-item>
        <el-form-item label="是否签约公司" prop="signing">
          <el-select v-model="mObject.signing" placeholder="请选择是否签约公司">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信签名" prop="signName">
          <el-input v-model="mObject.signName"></el-input>
        </el-form-item>
        <el-form-item label="key" prop="accessKeyId">
          <el-input v-model="mObject.accessKeyId"></el-input>
        </el-form-item>
        <el-form-item label="secret" prop="accessKeySecret">
          <el-input v-model="mObject.accessKeySecret"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="product">
          <el-input v-model="mObject.product"></el-input>
        </el-form-item>
        <el-form-item label="产品域名" prop="domain">
          <el-input v-model="mObject.domain"></el-input>
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
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        companyCode: [
          { required: true, message: '请输入公司code', trigger: 'blur' }
        ],
        classPath: [
          { required: true, message: '请输入calssService路径', trigger: 'blur' }
        ],
        inUse: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ],
        companyPeople: [
          { required: true, message: '请输入责任人', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入责任人电话', trigger: 'blur' }
        ],
        signing: [
          { required: true, message: '请选择是否签约公司', trigger: 'blur' }
        ],
        signName: [
          { required: true, message: '请输入短信签名', trigger: 'blur' }
        ],
        accessKeyId: [
          { required: true, message: '请输入key', trigger: 'blur' }
        ],
        accessKeySecret: [
          { required: true, message: '请输入secret', trigger: 'blur' }
        ],
        product: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        domain: [
          { required: true, message: '请输入产品域名', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getSMSProviderList()
  },
  computed: mapState({
    providers: state => state.smsProvider.providers
  }),
  methods: {
    getSMSProviderList() {
      this.listLoading = true
      this.$store.dispatch('getSMSProviderList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getSMSProviderList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getSMSProviderList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getSMSProviderList()
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
    deleteSMSProvider(role) {
      this.$confirm('此操作将永久删除该服务商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteSMSProvider', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getSMSProviderList()
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
      this.deleteSMSProvider({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editSMSProvider', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSMSProviderList()
            } })
          } else {
            this.$store.dispatch('addSMSProvider', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSMSProviderList()
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
