<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select style="width:200px;" v-model="param.searchCondition.itemName" placeholder="药品名称"  clearable filterable remote
                 :remote-method="getDrugName" :loading="drugLoading" @change = "search"  @keyup.enter.native="search">
        <el-option
          v-for="item in drugName"
          :key="item.id"
          :label="item.itemName"
          :value="item.itemName">
        </el-option>
      </el-select>
      <el-input style="width: 120px;" v-model="param.searchCondition.brand" class="filter-item" placeholder="品牌">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.goodsBarcode" class="filter-item" placeholder="药品条码">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.approvalNumber" class="filter-item" placeholder="批准文号">
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
      <!--<el-select style="width:120px;" v-model="param.searchCondition.cfPropertyCode" placeholder="处方类型">-->
        <!--<el-option label="全部" :value="null"></el-option>-->
        <!--<el-option-->
          <!--v-for="item in skuTypes"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.code">-->
          <!--</el-option>-->
      <!--</el-select>-->
      <el-select style="width:120px;" v-model="param.searchCondition.statusCode" placeholder="状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in goodsStatus"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-button class="filter-item" @click.native.prevent="search()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="goodsSkus.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="itemName" width="200" label="药品名称"></el-table-column>
      <el-table-column prop="commonName" width="200" label="通用名"></el-table-column>
      <el-table-column prop="brand" width="100" label="品牌"></el-table-column>
      <el-table-column prop="spec" width="90" label="规格"></el-table-column>
      <el-table-column prop="unit" width="50" label="单位"></el-table-column>
      <el-table-column prop="manufacturer" width="120" label="厂家"></el-table-column>
      <el-table-column prop="goodsBarcode" label="药品条码"></el-table-column>
      <el-table-column prop="marketPrice" label="市场价（元）"></el-table-column>
      <!--<el-table-column prop="lotNumber" label="产品批号"></el-table-column>-->
      <el-table-column prop="approvalNumber" label="批准文号"></el-table-column>
      <el-table-column prop="identificationName" label="药品类型"></el-table-column>
      <!--<el-table-column prop="cfPropertyName" label="处方类型"></el-table-column>-->
      <!--<el-table-column prop="smallPicUrl" width="100" label="药品缩略图"></el-table-column>-->
      <el-table-column prop="statusName" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteGoodsSku(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="goodsSkus.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="药品名称" prop="itemName">
          <el-input v-model="mObject.itemName"></el-input>
        </el-form-item>
        <el-form-item label="通用名" prop="commonName">
          <el-input v-model="mObject.commonName"></el-input>
        </el-form-item>
        <el-form-item label="药品基本信息ID" prop="itemDrugBaseId">
          <el-input v-model="mObject.itemDrugBaseId"></el-input>
        </el-form-item>
        <el-form-item label="药品SPU信息ID" prop="spuId">
          <el-input v-model="mObject.spuId"></el-input>
        </el-form-item>
        <el-form-item label="药品缩略图" prop="thumbnailPicUrl">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="imageUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadThumbnailPicSuccess"
            accept="image/*">
            <img v-if="mObject.thumbnailPicUrl" :src="mObject.thumbnailPicUrl" class="thumbnailPicUrl">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="药品小图" prop="smallPicUrl">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="imageUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadSmallPicSuccess"
            accept="image/*">
            <img v-if="mObject.smallPicUrl" :src="mObject.smallPicUrl" class="smallPicUrl">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="药品大图" prop="bigPicUrl">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="imageUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadBigPicSuccess"
            accept="image/*">
            <img v-if="mObject.bigPicUrl" :src="mObject.bigPicUrl" class="bigPicUrl">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="mObject.brand"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="spec">
          <el-input v-model="mObject.spec"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="mObject.unit"></el-input>
        </el-form-item>
        <el-form-item label="药品条码" prop="goodsBarcode">
          <el-input v-model="mObject.goodsBarcode"></el-input>
        </el-form-item>
        <!--<el-form-item label="产品批号" prop="goodsBarcode">-->
          <!--<el-input v-model="mObject.lotNumber"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="批准文号" prop="approvalNumber">
          <el-input v-model="mObject.approvalNumber"></el-input>
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
        <el-form-item label="处方类型" prop="cfPropertyCode">
          <el-select v-model="mObject.cfPropertyCode" placeholder="请选择处方类型">
            <el-option
              v-for="item in skuTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市场价（元）" prop="marketPrice">
          <el-input v-model="mObject.marketPrice"></el-input>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
  .thumbnailPicUrl {
    width: 120px;
    height: 120px;
    display: block;
  }
  .smallPicUrl {
    width: 120px;
    height: 120px;
    display: block;
  }
  .bigPicUrl {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>

<script>
import { mapState } from 'vuex'
import { getConstants } from '@/utils/constants'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      imageUploadUrl: getConstants().IMAGE_UPLOAD_URL,
      imageUrl: getConstants().IMAGE_URL,
      upLoadData: {
        file_id: 0
      },
      headersData: { Authorization: getToken() },
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      mObject: {},
      mTitle: '',
      drugLoading: false,
      drugNameSearch: '',
      rules: {
        itemName: [
          { required: true, message: '请输入药品名称', trigger: 'blur' }
        ],
        itemDrugBaseId: [
          { required: true, message: '药品基本信息ID', trigger: 'blur' }
        ],
        spuId: [
          { required: true, message: '药品SPU信息ID', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '药品单位信息ID', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {},
  created() {
    this.getGoodsSkuList()
    this.getGoodsTypeList()
    this.getSkuTypeList()
    this.getStatusList()
  },
  computed: mapState({
    goodsSkus: state => state.goodsSku.goodsSkus,
    goodsTypes: state => state.goodsSku.goodsTypes,
    skuTypes: state => state.goodsSku.skuTypes,
    goodsStatus: state => state.goodsSku.goodsStatus,
    drugName: state => state.prescription.drugName
  }),
  methods: {
    search() {
      this.param.page = 1
      this.getGoodsSkuList()
    },
    getGoodsSkuList() {
      this.listLoading = true
      this.$store.dispatch('getGoodsSkuList', {
        params: this.param,
        callback: () => {
          this.listLoading = false
        }
      })
    },
    getDrugName(query) {
      this.$store.dispatch('clearDrugName')
      if (query !== '') {
        this.drugLoading = true
        this.$store.dispatch('drugName', {
          drugNameSearch: query,
          callback: () => {
            this.drugLoading = false
          }
        })
      }
    },
    getGoodsTypeList() {
      this.$store.dispatch('getGoodsSkuTypeList')
    },
    getSkuTypeList() {
      this.$store.dispatch('getSkuTypeList')
    },
    getStatusList() {
      this.$store.dispatch('getSkuStatusList')
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getGoodsSkuList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getGoodsSkuList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getGoodsSkuList()
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
    deleteGoodsSku(role) {
      this.$confirm('此操作将永久删除该药品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteGoodsSku', {
          data: role,
          callback: () => {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 3 * 1000
            })
            this.getGoodsSkuList()
          }
        })
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
      this.deleteGoodsSku({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate(valid => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editGoodsSku', {
              data: this.mObject,
              callback: () => {
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.dialogVisible = false
                this.getGoodsSkuList()
              }
            })
          } else {
            this.$store.dispatch('addGoodsSku', {
              data: this.mObject,
              callback: () => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.dialogVisible = false
                this.getGoodsSkuList()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 上传缩略图成功
     * @param response
     * @param file
     * @param fileList
     */
    uploadThumbnailPicSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.thumbnailPicUrl = this.imageUrl + response.data
      }
    },
    /**
     * 上传小图成功
     * @param response
     * @param file
     * @param fileList
     */
    uploadSmallPicSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.smallPicUrl = this.imageUrl + response.data
      }
    },
    /**
     * 上传大图成功
     * @param response
     * @param file
     * @param fileList
     */
    uploadBigPicSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.bigPicUrl = this.imageUrl + response.data
      }
    }
  }
}
</script>
