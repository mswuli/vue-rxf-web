<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="getResList()">刷新</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <tree-table :data="ress" :editFunc="edit" :selectedRowFunc="selectedRowFunc" :deleteFunc="deleteRes" :columns="columns" v-loading="listLoading" border></tree-table>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="资源图标" prop="icon">
          <el-input v-model="mObject.icon"></el-input>
        </el-form-item>
        <el-form-item label="上级" prop="parentId">
          <el-select v-model="mObject.parentId" placeholder="请选择上级">
            <el-option
              v-for="item in menus.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="mObject.type" placeholder="请选择类型">
            <el-option
              v-for="item in resourceType.data"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源链接" prop="url">
          <el-input v-model="mObject.url"></el-input>
        </el-form-item>
        <el-form-item label="图标名称" prop="vueIcon">
          <el-input v-model="mObject.vueIcon"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="vueName">
          <el-input v-model="mObject.vueName"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="mObject.sort"></el-input>
        </el-form-item>
        <el-form-item label="资源编码" prop="code">
          <el-input v-model="mObject.code"></el-input>
        </el-form-item>
        <el-form-item label="方法" prop="function">
          <el-input v-model="mObject.function"></el-input>
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
import treeTable from '@/components/TreeTable'

export default {
  components: { treeTable },
  data() {
    return {
      listLoading: false,
      param: { order: 'asc' },
      role_type_code_search: '',
      create_role_inUse: '',
      dialogVisible: false,
      mObject: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      mTitle: '',
      selectedRows: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        function: [
          { required: true, message: '请输入方法', trigger: 'blur' }
        ]
      },
      columns: [
        {
          text: '名称',
          value: 'name',
          width: 200
        },
        {
          text: '类型',
          value: 'typeName'
        },
        {
          text: '图标名称',
          value: 'vueIcon'
        },
        {
          text: '链接',
          value: 'vueName'
        },
        {
          text: '排序',
          value: 'sort'
        }
      ]
    }
  },
  filters: {
  },
  created() {
    this.getResList()
    this.getMenuList()
    this.getResourceType()
  },
  computed: mapState({
    ress: state => state.resourceManage.ress,
    menus: state => state.resourceManage.menus,
    resourceType: state => state.resourceManage.resourceType
  }),
  methods: {
    getResList() {
      this.listLoading = true
      this.$store.dispatch('getResList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getMenuList() {
      this.$store.dispatch('getMenuList')
    },
    getResourceType() {
      this.$store.dispatch('getResourceType')
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '编辑'
      if (!row) {
        this.mTitle = '新增'
        row = {}
      }
      this.mObject = Object.assign({}, {
        id: row.id,
        name: row.name,
        icon: row.icon,
        parentId: row.parentId,
        type: row.type,
        url: row.url,
        vueIcon: row.vueIcon,
        vueName: row.vueName,
        sort: row.sort,
        code: row.code,
        function: row.function
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
    deleteRes(role) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteRes', { data: { id: role.id }, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getResList()
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
      this.deleteRes({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editRes', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getResList()
            } })
          } else {
            this.$store.dispatch('addRes', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getResList()
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
