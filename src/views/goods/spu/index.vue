<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.itemName" class="filter-item" placeholder="名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.brand" class="filter-item" placeholder="品牌">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.statusCode" placeholder="请选择状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in goodsStatus"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-button class="filter-item" @click="getGoodsSpuList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="goodsSpus.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="itemName" label="名称" width="200"></el-table-column>
      <el-table-column fixed prop="brand" label="品牌"></el-table-column>
      <el-table-column prop="spec" width="90" label="规格"></el-table-column>
      <el-table-column prop="manufacturer" width="120" label="厂家"></el-table-column>
      <el-table-column fixed prop="statusName" width="80" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteGoodsSpu(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="goodsSpus.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="名称" prop="itemName">
          <el-input v-model="mObject.itemName"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="mObject.brand"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="statusCode">
          <el-select v-model="mObject.statusCode" placeholder="请选择状态">
            <el-option
              v-for="item in goodsStatus"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="药品基础信息ID" prop="itemDrugBaseId">
          <el-input v-model="mObject.itemDrugBaseId"></el-input>
        </el-form-item>
        <el-form-item label="品牌ID" prop="brandId">
          <el-input v-model="mObject.brandId"></el-input>
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
      mObject: {},
      mTitle: '',

      rules: {
        itemName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        goodsStatus: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        itemDrugBaseId: [
          { required: true, message: '请输入药品基础信息ID', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getGoodsSpuList()
    this.getGoodsStatusList()
  },
  computed: mapState({
    goodsSpus: state => state.goodsSpu.goodsSpus,
    goodsStatus: state => state.goodsSpu.goodsStatus
  }),
  methods: {
    getGoodsSpuList() {
      this.listLoading = true
      this.$store.dispatch('getGoodsSpuList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getGoodsStatusList() {
      this.$store.dispatch('getStatusList', { params: this.param })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getGoodsSpuList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getGoodsSpuList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getGoodsSpuList()
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
    deleteGoodsSpu(role) {
      this.$confirm('此操作将永久删除该药品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteGoodsSpu', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getGoodsSpuList()
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
      this.deleteGoodsSpu({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editGoodsSpu', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getGoodsSpuList()
            } })
          } else {
            this.$store.dispatch('addGoodsSpu', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getGoodsSpuList()
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
