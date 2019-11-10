<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="策略名称">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.statusCode" placeholder="状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in tacticsStatus.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button class="filter-item" @click="getTacticList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="tactics.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="typeName" width="150" label="策略类型"></el-table-column>
      <el-table-column fixed prop="name" width="150" label="策略名称"></el-table-column>
      <el-table-column fixed prop="code" width="150" label="策略code"></el-table-column>
      <el-table-column prop="weight" width="150" label="权重"></el-table-column>
      <el-table-column prop="sort" width="150" label="排序"></el-table-column>
      <el-table-column prop="statusName" width="150" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteTactic(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="tactics.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="策略类型" prop="typeCode">
          <el-select v-model="mObject.typeCode" placeholder="请选择策略类型">
            <el-option
              v-for="item in tacticsType.data"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="策略名称" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="策略code" prop="code">
          <el-input v-model="mObject.code"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="mObject.weight"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="mObject.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statusCode">
          <el-select v-model="mObject.statusCode" placeholder="请选择状态">
            <el-option
              v-for="item in tacticsStatus.data"
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
        typeCode: [
          { required: true, message: '请选择策略类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入策略名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入策略code', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请输入权重', trigger: 'blur' }
        ],
        statusCode: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getTacticList()
    this.getTacticsStatus()
    this.getTacticsType()
  },
  computed: mapState({
    tactics: state => state.tactic.tactics,
    tacticsStatus: state => state.tactic.tacticsStatus,
    tacticsType: state => state.tactic.tacticsType
  }),
  methods: {
    getTacticList() {
      this.listLoading = true
      this.$store.dispatch('getTacticList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getTacticsStatus() {
      this.$store.dispatch('getTacticsStatus', { params: {}})
    },
    getTacticsType() {
      this.$store.dispatch('getTacticsType', { params: {}})
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getTacticList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getTacticList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getTacticList()
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
    deleteTactic(role) {
      this.$confirm('此操作将永久删除该策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteTactic', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getTacticList()
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
      this.deleteTactic({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editTactic', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getTacticList()
            } })
          } else {
            this.$store.dispatch('addTactic', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getTacticList()
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
