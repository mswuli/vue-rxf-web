<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.userName" class="filter-item" placeholder="账号">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.mobile" class="filter-item" placeholder="手机号">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.sourceCode" placeholder="来源平台">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in accountTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-select style="width:150px;" v-model="param.searchCondition.system" placeholder="是否系统内置">
        <el-option label="全部" value=""></el-option>
        <el-option label="是" value=true></el-option>
        <el-option label="否" value=false></el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.inUse" placeholder="是否启用">
        <el-option label="全部" value=""></el-option>
        <el-option label="是" value=true></el-option>
        <el-option label="否" value=false></el-option>
      </el-select>
      <el-button class="filter-item" @click="getAccountList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" v-if="!!currentPermission.canToSystem" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" v-if="!!currentPermission.canToSystem" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="accounts.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="userName"  width="150" label="账号"></el-table-column>
      <el-table-column prop="mobile" width="150" label="手机号"></el-table-column>
      <el-table-column label="是否启用" width="100">
        <template slot-scope="scope">
          {{scope.row.inUse | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column label="是否系统内置" width="120">
        <template slot-scope="scope">
          {{scope.row.system | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" width="80"></el-table-column>
      <el-table-column prop="updatorName" label="更新人" width="80"></el-table-column>
      <el-table-column prop="sourceName" label="来源平台" width="120"></el-table-column>
      <el-table-column prop="orgName" label="所属机构" width="150"></el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" v-if="!!currentPermission.canToSystem" size="mini" @click="role(scope.row)">角色</el-button>
          <el-button type="primary" v-if="!!currentPermission.canToSystem" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" v-if="!!currentPermission.canToSystem" size="mini" @click="deleteAccount(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="accounts.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="账号" prop="userName">
          <el-input v-model="mObject.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="mObject.mobile"></el-input>
        </el-form-item>
        <el-form-item label="来源平台" prop="sourceCode">
          <el-select :disabled="isEdit" v-model="mObject.sourceCode" placeholder="请选择来源平台">
            <el-option
              v-for="item in accountTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构" prop="orgName">
          <el-input :disabled="isHaveChildrenOrg" @focus="chooseOrg(2)" v-model="mObject.orgName"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="inUse">
          <el-select v-model="mObject.inUse" placeholder="请选择是否启用">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否系统账号" prop="system">
          <el-select :disabled="isCanToSystem" v-model="mObject.system" placeholder="请选择是否系统账号">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="mObject.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="所属机构"
      :close-on-click-modal=false
      :visible.sync="orgDialogVisible">
      <el-tree
        :data="roleOrganizations"
        :check-strictly="true"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :default-expand-all="true"
        highlight-current
        node-key="id"
        ref="chooseOrgTree"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChooseOrg()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="账号角色"
      :close-on-click-modal=false
      width="80%"
      :visible.sync="roleDialogVisible">
      <el-table
        :data="accountRoles.data"
        v-loading="roleListLoading"
        highlight-current-row
        border
        style="width: 100%">
        <el-table-column fixed prop="name" label="角色名称" width="120"></el-table-column>
        <el-table-column prop="code" label="角色编码"></el-table-column>
        <el-table-column prop="typeName" label="角色分类" width="100"></el-table-column>
        <el-table-column prop="orgName" label="所属机构" width="150"></el-table-column>
        <el-table-column label="是否启用" width="80">
          <template slot-scope="scope">
            {{scope.row.inUse | yesOrNo}}
          </template>
        </el-table-column>
        <el-table-column prop="system" width="120" label="是否系统账号">
          <template slot-scope="scope">
            {{scope.row.system | yesOrNo}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="unbindUser(scope.row)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">关闭</el-button>
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
      roleListLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      mObject: {},
      currentRow: {},
      mTitle: '',
      isEdit: false,
      isCanToSystem: false, // 默认"是否系统角色"选择框不可用
      isHaveChildrenOrg: false, // 默认"所属"选择框不可用
      orgType: '',
      orgDialogVisible: false,
      roleDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },

      rules: {
        userName: [
          { required: true, message: '请输入5-20位字母,数字或下划线组合,首字符必须为字母', trigger: 'blur' },
          { pattern: /^[a-zA-Z]\w{4,19}$/, message: '请输入5-20位字母,数字或下划线组合,首字符必须为字母', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入11位手机号', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        sourceCode: [
          { required: true, message: '请选择来源平台', trigger: 'blur' }
        ],
        inUse: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ],
        system: [
          { required: true, message: '请选择是否系统账号', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getAccountList()
    // this.getAccountTypeList()
    // this.getRoleOrganizationList()
    this.getCurrentAccountAdminPermission()
  },
  computed: mapState({
    accounts: state => state.account.accounts,
    accountRoles: state => state.role.accountRoles,
    accountTypes: state => state.account.accountTypes,
    roleOrganizations: state => state.role.roleOrganizations,
    ...mapGetters([
      'isUse'
    ])
  }),
  methods: {
    getCurrentAccountAdminPermission() {
      this.listLoading = true
      this.$store.dispatch('getCurrentAccountAdminPermission', {}).then(response => {
        this.currentPermission = response.data
        if (!!response.data.canSelectSource) {
          this.getAccountTypeList()
        } else {
          this.isEdit = true
        }
      })
    },
    getAccountList() {
      this.listLoading = true
      this.$store.dispatch('getAccountList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getAccountRoleList(row) {
      this.roleListLoading = true
      this.$store.dispatch('getAccountRoleList', { id: row.id, callback: () => {
        this.roleListLoading = false
      } })
    },
    getAccountTypeList() {
      this.$store.dispatch('getAccountTypeList', { params: this.param })
    },
    getRoleOrganizationList() {
      this.$store.dispatch('getRoleOrganizationList', { params: this.param })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getAccountList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getAccountList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getAccountList()
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
          sourceCode: this.currentPermission.sourceCode,
          orgId: this.currentPermission.currentOrg.id,
          orgName: this.currentPermission.currentOrg.name,
          typeName: this.currentPermission.sourceName,
          system: false,
          inUse: true
        }
      }else {
        this.currentRow = row
      }
      this.mObject = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 删除角色
    deleteAccount(role) {
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteAccount', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getAccountList()
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
      this.deleteAccount({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            if (this.currentRow.password === this.mObject.password) {
              this.mObject.password = null
            }
            this.$store.dispatch('editAccount', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getAccountList()
            } })
          } else {
            this.$store.dispatch('addAccount', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getAccountList()
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
    },
    saveChooseOrg() {
      this.orgDialogVisible = false
      const nodes = this.$refs.chooseOrgTree.getCurrentNode()
      if (this.orgType === 1) {
        this.param.searchCondition.orgId = nodes.id
        this.param.searchCondition.orgName = nodes.name
      } else if (this.orgType === 2) {
        this.mObject.orgId = nodes.id
        this.mObject.orgName = nodes.name
      }
    },
    // 账号下的角色
    role(row) {
      this.currentRow = row
      this.roleDialogVisible = true
      this.getAccountRoleList(row)
    },
    // 解绑用户
    unbindUser(row) {
      console.log(this.currentRow.id+"-----"+ row.id)
      this.$confirm('此操作将永久解绑该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('unbindUser', { data: { roleId: row.id, selectItemIds: this.currentRow.id }, callback: () => {
          this.$message({
            message: '解绑成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.getAccountRoleList(this.currentRow)
        } })
      })
    }
  }
}
</script>
