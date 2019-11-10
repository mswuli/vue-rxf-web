<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="getOrganizationList()">刷新</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <tree-table :data="organizations" :editFunc="edit" :selectedRowFunc="selectedRowFunc" :deleteFunc="deleteOrganization" :columns="columns" v-loading="listLoading" border ></tree-table>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="上级机构" prop="parentName">
          <el-input v-model="mObject.parentName" @focus="chooseOrg(2, mObject.parentId)"></el-input>
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="机构代码" prop="code">
          <el-input v-model="mObject.code"></el-input>
        </el-form-item>
        <el-form-item label="机构全称" prop="fullName">
          <el-input v-model="mObject.fullName"></el-input>
        </el-form-item>
        <el-form-item label="排序编号" prop="sort">
          <el-input v-model="mObject.sort"></el-input>
        </el-form-item>
        <hr/>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="mObject.orgInfo.leader"></el-input>
        </el-form-item>
        <el-form-item label="办公电话" prop="phone">
          <el-input v-model="mObject.orgInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="mObject.orgInfo.address"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="mObject.orgInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="zipCode">
          <el-input v-model="mObject.orgInfo.zipCode"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="mObject.orgInfo.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="上级机构"
      :close-on-click-modal=false
      :visible.sync="orgDialogVisible">
      <el-tree
        :data="roleOrganizations"
        v-loading="roleOrganizationsLoading"
        :check-strictly="true"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :default-expand-all="false"
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import treeTable from '@/components/TreeTable'

export default {
  components: { treeTable },
  data() {
    return {
      listLoading: false,
      roleOrganizationsLoading: false,
      param: { order: 'asc' },
      role_type_code_search: '',
      create_role_inUse: '',
      dialogVisible: false,
      mObject: {
        orgInfo: {
        }
      },
      mTitle: '',
      selectedRows: [],

      orgDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        parentName: [
          { required: true, message: '请输入上级机构' }
        ],
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入机构代码', trigger: 'blur' }
        ],
        sort: [
          { pattern: /[0-9]+$/, message: '请输入数字', trigger: 'blur' }
        ]
      },
      columns: [
        {
          text: '机构名称',
          value: 'name',
          width: 200
        },
        {
          text: '机构全称',
          value: 'fullName'
        },
        {
          text: '排序',
          value: 'sort'
        },
        {
          text: '更新时间',
          value: 'updateTime'
        },
        {
          text: '备注',
          value: ''
        }
      ]
    }
  },
  filters: {
  },
  created() {
    this.getOrganizationList()
  },
  computed: mapState({
    organizations: state => state.organization.organizations,
    roleOrganizations: state => state.role.roleOrganizations
  }),
  methods: {
    getOrganizationList() {
      this.listLoading = true
      this.$store.dispatch('getOrganizationList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getRoleOrganizationList(callback) {
      this.roleOrganizationsLoading = true
      this.$store.dispatch('getRoleOrganizationList', { params: this.param, callback: () => {
        this.roleOrganizationsLoading = false
        callback && callback()
      } })
    },
    getOrgInfo(row) {
      const rowId = row.id
      row = {
        id: row.id,
        name: row.name,
        parentId: row.parentId,
        parentName: row.parentName,
        code: row.code,
        fullName: row.fullName,
        sort: row.sort,
        orgInfo: {}
      }
      this.mObject = Object.assign({}, row)
      this.$store.dispatch('getOrgInfo', { data: { code: rowId }, callback: (res) => {
        this.mObject.orgInfo = res.data
      } })
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '编辑'
      if (!row) {
        this.mTitle = '新增'
        row = {}
      } else {
        this.getOrgInfo(row)
      }
      row.orgInfo = {}
      this.mObject = Object.assign({}, {
        code: row.code,
        fullName: row.fullName,
        id: row.id,
        name: row.name,
        orgInfo: row.orgInfo,
        parentId: row.parentId,
        parentName: row.parentName,
        sort: row.sort
      })
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    selectedRowFunc(val) {
      this.selectedRows = val
    },
    // 删除
    deleteOrganization(role) {
      console.log(role,2)
      this.$confirm('此操作将永久删除该机构, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteOrganization', { data: { id: role.id }, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getOrganizationList()
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
      console.log(idsArr)
      this.deleteOrganization({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editOrganization', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getOrganizationList()
            } })
          } else {
            this.$store.dispatch('addOrganization', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getOrganizationList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    chooseOrg(type, nodeKey) {
      this.orgDialogVisible = true
      this.orgType = type
      this.getRoleOrganizationList(() => {
        setTimeout(() => {
          this.$refs.chooseOrgTree.setCurrentKey(nodeKey || null)
        }, 500)
      })
    },
    saveChooseOrg() {
      this.orgDialogVisible = false
      const nodes = this.$refs.chooseOrgTree.getCurrentNode()
      this.mObject.parentId = nodes.id
      this.mObject.parentName = nodes.name
    }
  }
}
</script>
