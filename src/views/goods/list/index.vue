<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.productName" class="filter-item" placeholder="产品名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.productEngName" class="filter-item" placeholder="英文名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.approvalNumber" class="filter-item" placeholder="批准文号">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.manufacturer" class="filter-item" placeholder="生产厂家">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.identificationCode" placeholder="药品类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in goodsTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-button class="filter-item" @click="getGoodsList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="goods.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="productName" width="150" label="产品名称"></el-table-column>
      <!--<el-table-column prop="medical" label="医保药">-->
        <!--<template slot-scope="scope">{{scope.medical ? '是':'否'}}</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="productEngName" label="英文名称"></el-table-column>
      <el-table-column prop="approvalNumber" width="150" label="批准文号"></el-table-column>
      <el-table-column prop="itemName" width="200" label="药品名"></el-table-column>
      <el-table-column prop="spec" label="规格"></el-table-column>
      <el-table-column prop="manufacturer" width="250" label="生产厂家"></el-table-column>
      <el-table-column prop="approvalData" label="批准日期"></el-table-column>
      <el-table-column prop="identificationName" label="药品类型"></el-table-column>
      <el-table-column prop="brief" width="250" label="简介"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteGoods(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="goods.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="mObject.productName"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="productEngName">
          <el-input v-model="mObject.productEngName"></el-input>
        </el-form-item>
        <el-form-item label="批准文号" prop="approvalNumber">
          <el-input v-model="mObject.approvalNumber"></el-input>
        </el-form-item>
        <el-form-item label="药品名" prop="itemName">
          <el-input v-model="mObject.itemName"></el-input>
        </el-form-item>
        <!--<el-form-item label="医保药" prop="medical">-->
          <!--<el-select v-model="mObject.medical" placeholder="请选择医保药">-->
            <!--<el-option value="是" label="是"></el-option>-->
            <!--<el-option value="否" label="否"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="剂型" prop="dosageForms">
          <el-input v-model="mObject.dosageForms"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="mObject.spec"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="mObject.manufacturer"></el-input>
        </el-form-item>
        <el-form-item label="生产地址" prop="manufacturerAddr">
          <el-input v-model="mObject.manufacturerAddr"></el-input>
        </el-form-item>
        <el-form-item label="产品类别" prop="productTypeCode">
          <el-select v-model="mObject.productTypeCode" placeholder="请选择产品类别">
            <el-option
              v-for="item in productTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="批准日期" prop="approvalData">
          <el-date-picker
            v-model="mObject.approvalData"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="原批准文号" prop="oldApprovalNum">
          <el-input v-model="mObject.oldApprovalNum"></el-input>
        </el-form-item>
        <el-form-item label="药品本位码" prop="standardCode">
          <el-input v-model="mObject.standardCode"></el-input>
        </el-form-item>
        <el-form-item label="药品类型" prop="identificationCode">
          <el-select v-model="mObject.identificationCode" placeholder="请选择药品类型">
            <el-option
              v-for="item in goodsTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input v-model="mObject.brief"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍" prop="intro">
          <el-input v-model="mObject.intro" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="药品本位码备注" prop="standardCodeNote">
          <el-input v-model="mObject.standardCodeNote" type="textarea"></el-input>
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
import moment from 'moment'

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      mObject: {},
      mTitle: '',

      rules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        identificationCode: [
          { required: true, message: '请选择药品类型', trigger: 'blur' }
        ],
        medical: [
          { required: true, message: '请选择医保药', trigger: 'blur' }
        ],
      }
    }
  },
  filters: {
  },
  created() {
    this.getGoodsList()
    this.getGoodsTypeList()
    this.getProductTypeList()
  },
  computed: mapState({
    goods: state => state.goods.goods,
    goodsTypes: state => state.goods.goodsTypes,
    productTypes: state => state.goods.productTypes,
    ...mapGetters([
      'isUse'
    ])
  }),
  methods: {
    getGoodsList() {
      this.listLoading = true
      this.$store.dispatch('getGoodsList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getGoodsTypeList() {
      this.$store.dispatch('getGoodsTypeList', { params: this.param })
    },
    getProductTypeList() {
      this.$store.dispatch('getProductTypeList', { params: this.param })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getGoodsList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getGoodsList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getGoodsList()
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
      row.approvalData = moment(row.approvalData).format('YYYY-MM-DD')
      this.mObject = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 删除角色
    deleteGoods(role) {
      this.$confirm('此操作将永久删除该药品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteGoods', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getGoodsList()
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
      this.deleteGoods({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editGoods', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getGoodsList()
            } })
          } else {
            this.$store.dispatch('addGoods', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getGoodsList()
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
