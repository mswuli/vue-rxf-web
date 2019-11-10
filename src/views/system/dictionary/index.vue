<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="类型名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.code" class="filter-item" placeholder="类型编码">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.typeCode" placeholder="字典类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in dictionaryTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.use" placeholder="是否启用">
        <el-option label="全部" value="null"></el-option>
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
      <el-button class="filter-item" @click="getDictionaryList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="dictionarys.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="name" label="类型名称"></el-table-column>
      <el-table-column prop="code" label="类型编码"></el-table-column>
      <el-table-column label="是否启用">
        <template slot-scope="scope">
          {{scope.row.use | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="字典类型"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteDictionary(scope.row)">删除</el-button>
          <el-button type="primary" size="mini" @click="items(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="dictionarys.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" prop="code">
          <el-input v-model="mObject.code"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="use">
          <el-select v-model="mObject.use" placeholder="请选择是否启用">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典类型" prop="typeCode">
          <el-select v-model="mObject.typeCode" placeholder="请选择字典类型">
            <el-option
              v-for="item in dictionaryTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="mObject.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="数据字典详情"
      :close-on-click-modal=false
      :visible.sync="itemDialogVisible">
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="editItem()">新增</el-button>
        <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteItemMulti()">批量删除</el-button>
      </div>
      <el-table
        @selection-change="handleItemSelectionChange"
        :data="dictionaryItems.data"
        v-loading="itemListLoading"
        border
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="typeCode" label="字典类型编码"></el-table-column>
        <el-table-column prop="name" label="字典名称"></el-table-column>
        <el-table-column prop="code" label="字典键值"></el-table-column>
        <el-table-column prop="sort" label="排序号"></el-table-column>
        <el-table-column prop="remark" label="字典描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editItem(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="itemDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="mItemTitle"
      :close-on-click-modal=false
      :visible.sync="itemEditDialogVisible">
      <el-form :model="mItem" :rules="itemRules" ref="mItem" label-width="120px">
        <el-form-item label="字典类型编码" prop="typeCode">
          <el-input v-model="mItem.typeCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="mItem.name"></el-input>
        </el-form-item>
        <el-form-item label="字典键值" prop="code">
          <el-input v-model="mItem.code"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="sort">
          <el-input v-model="mItem.sort"></el-input>
        </el-form-item>
        <el-form-item label="字典描述" prop="remark">
          <el-input v-model="mItem.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitItemForm">确 定</el-button>
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
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入类型编码', trigger: 'blur' }
        ],
        typeCode: [
          { required: true, message: '请选择字典类型', trigger: 'blur' }
        ],
        use: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ]
      },
      itemRules: {
        typeCode: [
          { required: true, message: '请输入字典类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入字典键值', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getDictionaryList()
    this.getDictionaryTypeList()
  },
  computed: mapState({
    dictionarys: state => state.dictionary.dictionarys,
    dictionaryTypes: state => state.dictionary.dictionaryTypes,
    dictionaryItems: state => state.dictionary.dictionaryItems,
    ...mapGetters([
      'isUse'
    ])
  }),
  methods: {
    getDictionaryList() {
      this.listLoading = true
      if(this.param.searchCondition.name == ''){
        this.param.searchCondition.name = null
      }
      if(this.param.searchCondition.code == ''){
        this.param.searchCondition.code = null
      }
      this.$store.dispatch('getDictionaryList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getDictionaryTypeList() {
      this.$store.dispatch('getTypeList', { params: this.param })
    },
    getDictionaryItemList() {
      this.itemListLoading = true
      this.$store.dispatch('getDictionaryItemList', { type: this.mCode, callback: () => {
        this.itemListLoading = false
      } })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getDictionaryList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getDictionaryList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getDictionaryList()
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
    deleteDictionary(role) {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteDictionary', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getDictionaryList()
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
      this.deleteDictionary({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editDictionary', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getDictionaryList()
            } })
          } else {
            this.$store.dispatch('addDictionary', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getDictionaryList()
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
    },
    // 数据字典详情
    items(row) {
      if (row) {
        this.mCode = row.code
      }
      this.itemDialogVisible = true
      this.getDictionaryItemList()
    },
    // 编辑/新增
    editItem(row) {
      this.mItemTitle = '编辑'
      if (!row) {
        this.mItemTitle = '新增'
        row = {
          typeCode: this.mCode
        }
      }
      this.mItem = Object.assign({}, row)
      this.itemEditDialogVisible = true
      this.$nextTick(() => {
        this.$refs['mItem'].clearValidate()
      })
    },
    // 删除角色
    deleteItem(role) {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteDictionaryItem', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getDictionaryItemList()
        } })
      })
    },
    // 批量删除角色
    deleteItemMulti() {
      const idsArr = []
      for (const row of this.selectedItemRows) {
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
      this.deleteItem({ id: idsArr.join(',') })
    },
    // 提交表单
    submitItemForm() {
      this.$refs['mItem'].validate((valid) => {
        if (valid) {
          console.log(this.mItem)
          if (this.mItem.id) {
            this.$store.dispatch('editDictionaryItem', { data: this.mItem, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.itemEditDialogVisible = false
              this.getDictionaryItemList()
            } })
          } else {
            this.$store.dispatch('addDictionaryItem', { data: this.mItem, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.itemEditDialogVisible = false
              this.getDictionaryItemList()
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
