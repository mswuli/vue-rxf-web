<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.itemName" class="filter-item" placeholder="药品名称">
      </el-input>
      <div style="width: 174px;" class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange">
        <input style="width: 72px;" v-model="param.searchCondition.storeMin" placeholder="库存" name="" class="el-range-input">
        <span class="el-range-separator">-</span>
        <input style="width: 72px;" v-model="param.searchCondition.storeMax" placeholder="库存" name="" class="el-range-input">
      </div>
      <div style="width: 174px;" class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange">
        <input style="width: 72px;" v-model="param.searchCondition.priceMin" placeholder="价格" name="" class="el-range-input">
        <span class="el-range-separator">-</span>
        <input style="width: 72px;" v-model="param.searchCondition.priceMax" placeholder="价格" name="" class="el-range-input">
      </div>
      <el-date-picker
        v-model="marketableTime"
        type="daterange"
        range-separator="-"
        start-placeholder="上架开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-select style="width:120px;" v-model="param.searchCondition.marketable" placeholder="上架状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="已上架" :value="true"></el-option>
        <el-option label="已下架" :value="false"></el-option>
      </el-select>
      <el-button class="filter-item" @click="search()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="pharmacyGoods.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="skuId" width="80" label="药品ID"></el-table-column>
      <el-table-column fixed prop="itemName" width="200" label="药品名称"></el-table-column>
      <el-table-column prop="pharmacyName" width="150" label="药店名称"></el-table-column>
      <el-table-column prop="goodsBarcode" width="150" label="商品编码"></el-table-column>
      <el-table-column prop="marketable" label="上架状态">
        <template slot-scope="scope">
          {{scope.row.marketable | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="marketableTime" width="152" label="上架时间">
        <template slot-scope="scope">
          {{scope.row.marketableTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="basePrice" width="100" label="成本价(元)"></el-table-column>
      <el-table-column prop="price" width="80" label="价格(元)"></el-table-column>
      <el-table-column prop="spec" label="规格"></el-table-column>
      <el-table-column prop="manufacturer" width="300" label="厂家"></el-table-column>
      <el-table-column prop="store" label="库存"></el-table-column>
      <el-table-column fixed="right" label="操作" width="115">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showItem(scope.row)">拆零明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="pharmacyGoods.total">
      </el-pagination>
    </div>
    <el-dialog
      title="拆零明细"
      :close-on-click-modal=false
      :visible.sync="itemDialogVisible">
      <el-table
        @selection-change="handleSelectionChange"
        :data="itemTinyRates.data"
        v-loading="listLoading"
        border
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="unitCode" label="单位"></el-table-column>
        <el-table-column prop="amount" label="数量"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.pic-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.pic-uploader .el-upload:hover {
  border-color: #409EFF;
}
.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
</style>

<script>
import { mapState } from 'vuex'
import { getConstants } from '@/utils/constants'
import { download } from '@/utils/export'
import { getToken } from '@/utils/auth'
import moment from 'moment'

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: { pharmacyId: -1 }},
      dialogVisible: false,
      mTitle: '',
      marketableTime: '',
      attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
      importGoodsUrl: '',
      fileList: [],
      itemRow: {},
      mObject: {
        pharmacyId: null
      },
      headersData: { Authorization: getToken() },

      itemDialogVisible: false,

      rules: {
        itemName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getPharmacyGoodsList()
  },
  computed: mapState({
    pharmacyGoods: state => state.pharmacyGoods.pharmacyGoods,
    pharmacys: state => state.pharmacy.pharmacys,
    itemTinyRates: state => state.goodsSku.itemTinyRates
  }),
  methods: {
    search() {
      this.param.page = 1
      this.getPharmacyGoodsList()
    },
    getPharmacyGoodsList() {
      if (this.marketableTime) {
        this.param.searchCondition.marketableTimeStart = moment(this.marketableTime[0]).format('YYYY-MM-DD')
        this.param.searchCondition.marketableTimeEnd = moment(this.marketableTime[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getPharmacyGoodsList', { params: this.param }).then(() => {
        this.listLoading = false
      })
    },
    getPharmacyList() {
      this.$store.dispatch('getPharmacyList', { params: { page: 1, limit: 1000, searchCondition: {}}})
    },
    resetSearch() {
      this.param.page = 1
      this.param.searchCondition = { pharmacyId: -1 }
      this.getPharmacyGoodsList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getPharmacyGoodsList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getPharmacyGoodsList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    downloadFile() {
      const url = '/business/pharmacy/pharmacyItemInfo/exportModel'
      download(url, null, '药店药品导入模版')
    },
    uploadBefore(file) {
      this.fileList.push(file)
    },
    uploadGoodsSuccess(response, file, fileList) {
      if (response.success) {
        this.dialogVisible = false
        this.fileList = fileList
        this.getPharmacyGoodsList()
      }
    },
    fileUploadUrl() {
      return getConstants().IMPORT_GOODS_URL
    },
    uploadFile() {
      this.$refs.upload.submit()
    },
    showItem(row) {
      this.itemDialogVisible = true
      this.itemRow = row
      this.getItemTinyRate()
    },
    getItemTinyRate() {
      this.$store.dispatch('getItemTinyRate', { params: { id: this.itemRow.id }, callback: () => {
      } })
    }
  }
}
</script>
