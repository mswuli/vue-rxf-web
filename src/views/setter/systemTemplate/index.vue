<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.code" class="filter-item" placeholder="编码">
      </el-input>
      <el-select v-model="param.searchCondition.manager" placeholder="是否管理角色">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.sourceCode" placeholder="来源平台">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in accountTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-button class="filter-item" @click="getSystemTemplateList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="systemTemplates.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="name" label="名称"></el-table-column>
      <el-table-column fixed prop="code" label="编码"></el-table-column>
      <el-table-column prop="manager" label="是否管理角色">
        <template slot-scope="scope">
          {{scope.row.manager | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="sourceName" label="来源平台"></el-table-column>
      <el-table-column fixed="right" label="操作" width="144">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteSystemTemplate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="systemTemplates.total">
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
        <el-form-item label="编码" prop="code">
          <el-input v-model="mObject.code"></el-input>
        </el-form-item>
        <el-form-item label="是否管理角色" prop="manager">
          <el-select v-model="mObject.manager" placeholder="请选择是否管理角色">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源平台" prop="sourceCode">
          <el-select v-model="mObject.sourceCode" placeholder="来源平台">
            <el-option
              v-for="item in accountTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单权限" prop="resourceNames">
          <el-input @focus="chooseOrg(2)" v-model="mObject.resourceNames"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="菜单权限"
      :close-on-click-modal=false
      :visible.sync="orgDialogVisible">
      <el-tree
        :data="resources"
        default-expand-all
        show-checkbox
        :expand-on-click-node="false"
        check-on-click-node
        node-key="id"
        ref="chooseOrgTree"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChooseOrg()">确 定</el-button>
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

      orgDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },

      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请输入选择是否管理员', trigger: 'blur' }
        ],
        sourceCode: [
          { required: true, message: '请选择来源平台', trigger: 'blur' }
        ],
        resourceIds: [
          { required: true, message: '请选择菜单权限', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getSystemTemplateList()
    this.getAccountTypeList()
    this.getSysResourceList()
  },
  computed: mapState({
    systemTemplates: state => state.systemTemplate.systemTemplates,
    accountTypes: state => state.account.accountTypes,
    resources: state => state.systemTemplate.resources
  }),
  methods: {
    getSystemTemplateList() {
      this.listLoading = true
      this.$store.dispatch('getSystemTemplateList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getAccountTypeList() {
      this.$store.dispatch('getAccountTypeList', { params: this.param })
    },
    getSysResourceList() {
      this.$store.dispatch('getSysResourceList', { params: this.param })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getSystemTemplateList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getSystemTemplateList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getSystemTemplateList()
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
    deleteSystemTemplate(role) {
      this.$confirm('此操作将永久删除该策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteSystemTemplate', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getSystemTemplateList()
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
      this.deleteSystemTemplate({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editSystemTemplate', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSystemTemplateList()
            } })
          } else {
            this.$store.dispatch('addSystemTemplate', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSystemTemplateList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    chooseOrg(type) {
      this.orgDialogVisible = true
      this.orgType = type
      setTimeout(() => {
        if (this.mObject.resourceIds) {
          const resourceIdArr = this.mObject.resourceIds.split(',')
          const selectedResource = []
          for (const res of resourceIdArr) {
            const node = this.$refs.chooseOrgTree.getNode(res)
            if (node.isLeaf) {
              selectedResource.push(res)
            }
          }
          this.$refs.chooseOrgTree.setCheckedKeys(selectedResource)
        } else {
          this.$refs.chooseOrgTree.setCheckedKeys([])
        }
      }, 1000)
    },
    saveChooseOrg() {
      this.orgDialogVisible = false
      const nodes = this.$refs.chooseOrgTree.getHalfCheckedNodes()
      const checkedNodes = this.$refs.chooseOrgTree.getCheckedNodes()
      const keys = []
      const names = []
      for (const n of nodes) {
        keys.push(n.id)
        names.push(n.name)
      }
      for (const n of checkedNodes) {
        keys.push(n.id)
        names.push(n.name)
      }
      this.mObject.resourceIds = keys.join(',')
      this.mObject.resourceNames = names.join(',')
    }
  }
}
</script>
