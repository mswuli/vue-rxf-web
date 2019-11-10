<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.code" class="filter-item" placeholder="规则code">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="规则name">
      </el-input>
      <el-select style="width:200px;" v-model="param.searchCondition.hspId" placeholder="医院" filterable remote
                 :remote-method="getHospitalList" :loading="hspLoading">
        <el-option
          v-for="item in hospitals.data"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" @click="getRuleDictionaryList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="hspRuleDictionarys.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="hspName" label="医院名称"></el-table-column>
      <el-table-column prop="hspTypeName" label="医院类型"></el-table-column>
      <el-table-column prop="code" label="规则code"></el-table-column>
      <el-table-column prop="name" label="规则name"></el-table-column>
      <el-table-column prop="value" label="规则value"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteRuleDictionary(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="hspRuleDictionarys.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="医院" prop="hspName">
          <el-select style="width:300px;" v-model="mObject.hspName" placeholder="请输入医院名称" filterable remote
                     :remote-method="getHospitalList" :loading="hspLoading" @change="changeSelect()">
            <el-option
              v-for="item in hospitals.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则code" prop="code">
          <el-input v-model="mObject.code"></el-input>
        </el-form-item>
        <el-form-item label="规则name" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="规则value" prop="value">
          <el-input v-model="mObject.value"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="mObject.remark"></el-input>
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
        hspName: [
          { required: true, message: '请选择医院', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入规则code', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入规则name', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入规则value', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getRuleDictionaryList()
  },
  computed: mapState({
    hspRuleDictionarys: state => state.hspRuleDictionary.hspRuleDictionarys,
    hospitals: state => state.hospital.hospitals
  }),
  methods: {
    getRuleDictionaryList() {
      this.listLoading = true
      this.$store.dispatch('getRuleDictionaryList', { params: this.param, callback: () => {
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
    changeSelect() {
      this.mObject.hspId = this.mObject.hspName
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getRuleDictionaryList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getRuleDictionaryList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getRuleDictionaryList()
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
    // 删除
    deleteRuleDictionary(role) {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteRuleDictionary', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getRuleDictionaryList()
        } })
      })
    },
    // 批量删除
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
      this.deleteRuleDictionary({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          if (this.mObject.id) {
            this.$store.dispatch('editRuleDictionary', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getRuleDictionaryList()
            } })
          } else {
            this.$store.dispatch('addRuleDictionary', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getRuleDictionaryList()
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
