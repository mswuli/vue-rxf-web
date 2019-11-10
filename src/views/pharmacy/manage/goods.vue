<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.itemName" class="filter-item" placeholder="药品名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.pharmacyName" class="filter-item"
                placeholder="药店名称">
      </el-input>
      <div style="width: 174px;" class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange">
        <!--<input  style="width: 72px;" v-model="param.searchCondition.storeMin" placeholder="库存" name=""-->
               <!--class="el-range-input">-->
        <el-input-number class="store" style="width: 72px;"   v-model="param.searchCondition.storeMin" :min="0" :controls="false"  ></el-input-number>
        <span class="el-range-separator">-</span>
        <!--<input id="store" style="width: 72px;" v-model.number="param.searchCondition.storeMax" placeholder="库存" name=""-->
               <!--class="el-range-input">-->
        <el-input-number class="store"  style="width: 72px;" v-model="param.searchCondition.storeMax" :min="0" :controls="false"  ></el-input-number>
      </div>
      <div style="width: 174px;" class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange">
        <el-input-number class="store" style="width: 72px;"   v-model="param.searchCondition.priceMin" :min="0" :controls="false"  ></el-input-number>
        <!--<input style="width: 72px;" v-model="param.searchCondition.priceMin" placeholder="价格" name=""-->
               <!--class="el-range-input" >-->
        <span class="el-range-separator">-</span>
        <!--<input  style="width: 72px;" v-model="param.searchCondition.priceMax" placeholder="价格" name=""-->
               <!--class="el-range-input">-->
        <el-input-number class="store" style="width: 72px;"   v-model="param.searchCondition.priceMax" :min="0" :controls="false"  ></el-input-number>
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
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-delete" @click="multiMarketableGoods(1)">批量上架
      </el-button>
      <el-button class="filter-item" type="info" icon="el-icon-delete" @click="multiMarketableGoods(0)">批量下架</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-upload" @click="edit()">导入</el-button>
      <el-button class="filter-item" @click="exportFile()" type="primary" icon="el-icon-download">导出</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="pharmacyGoods.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="pharmacyName" width="150" label="药店名称"></el-table-column>
      <el-table-column prop="itemName" width="200" label="药品名称"></el-table-column>
      <!--<el-table-column prop="medical"  label="医保药">-->
        <!--<template slot-scope="scope">{{scope.medical ? '是':'否'}}</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="marketable" label="上架状态">
        <template slot-scope="scope">
          <div v-if="scope.row.marketable === true">
            上架
          </div>
          <div v-else>
            下架
          </div>
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
      <el-table-column prop="store" label="库存">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="300"
            v-model="scope.row.storevisible">
            <el-form class="pop-form" :inline="true">
              <el-input class="input" v-model="restore"></el-input>
              <el-button class="btn" @click="savePop(scope.row, 'store')" size="mini" type="primary">保存</el-button>
              <el-button class="btn" @click="hidePop(scope.row, 'store')" size="mini">取消</el-button>
            </el-form>
            <span class="show-text" @click="showPop(scope.row, 'store')"
                  slot="reference">{{ scope.row.store || 0 }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tinyStore" label="散装库存">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="300"
            v-model="scope.row.tinyStorevisible">
            <el-form class="pop-form" :inline="true">
              <el-input class="input" v-model="restore"></el-input>
              <el-button class="btn" @click="savePop(scope.row, 'tinyStore')" size="mini" type="primary">保存</el-button>
              <el-button class="btn" @click="hidePop(scope.row, 'tinyStore')" size="mini">取消</el-button>
            </el-form>
            <span class="show-text" @click="showPop(scope.row, 'tinyStore')" slot="reference">{{ scope.row.tinyStore || 'Empty' }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="itemTinyRateId" label="拆零换算">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="300"
            v-model="scope.row.itemTinyRateIdvisible">
            <el-form class="pop-form" :inline="true">
              <el-select v-model="restore" placeholder="请选择">
                <el-option label="无" :value=null></el-option>
                <el-option
                  v-for="item in itemTinyRates.data"
                  :key="item.id"
                  :label="unitCodeAmount(item)"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button class="btn" @click="savePop(scope.row, 'itemTinyRateId')" size="mini" type="primary">保存
              </el-button>
              <el-button class="btn" @click="hidePop(scope.row, 'itemTinyRateId')" size="mini">取消</el-button>
            </el-form>
            <span class="show-text" @click="showPop(scope.row, 'itemTinyRateId')" slot="reference">{{ scope.row.itemTinyRateUnit || '无' }}</span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deletePharmacyGoods(scope.row)">删除</el-button>
          <el-button v-if="scope.row.marketable" type="info" size="mini" @click="marketableGoods(scope.row, 0)">下架
          </el-button>
          <el-button v-else type="success" size="mini" @click="marketableGoods(scope.row, 1)">上架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]"
                     :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="pharmacyGoods.total">
      </el-pagination>
    </div>

    <!--新增-->
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="addDialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="200px">
        <el-form-item label="药店名称" prop="pharmacyId">
          <el-select v-model="mObject.pharmacyId" placeholder="请输入药店名称" filterable remote
                     :remote-method="getPharmacyByNameList" :loading="pharmacyLoading">
            <el-option
              v-for="item in pharmacys.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="药品名称" prop="skuId">
          <el-select v-model="mObject.skuId" placeholder="请输入药品名称" filterable remote
                     :remote-method="getGoodsSkuList" :loading="skuLoading" @change="handleSkuChange">
            <el-option
              v-for="item in goodsSkus.data"
              :key="item.id"
              :label="item.itemName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="药品厂家" prop="manufacturer">
          <el-input v-model="mObject.manufacturer" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="药品规格" prop="skuSpec">
          <el-input v-model="mObject.skuSpec" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="药品单位" prop="skuUnit">
          <el-input v-model="mObject.skuUnit" :disabled="true"></el-input>
        </el-form-item>
        <!--<el-form-item label="医保药" prop="medical">-->
          <!--<el-input v-model="mObject.medical" :disabled="true"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="成本价" prop="basePrice">
          <!--<el-input v-model="mObject.basePrice"></el-input>-->
          <el-input-number v-model="mObject.basePrice" :min="0" :controls="false" controls-position="left"></el-input-number>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <!--<el-input v-model="mObject.price"></el-input>-->
          <el-input-number v-model="mObject.price" :min="0" :controls="false" controls-position="left"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="store">
          <!--<el-input v-model="mObject.store"></el-input>-->
          <el-input-number v-model="mObject.store" :min="0" :controls="false" controls-position="left"></el-input-number>
        </el-form-item>
        <el-form-item label="散装库存" prop="tinyStore">
          <!--<el-input v-model="mObject.tinyStore"></el-input>-->
          <el-input-number v-model="mObject.tinyStore" :min="0" :controls="false" controls-position="left"></el-input-number>
        </el-form-item>
        <el-form-item label="最小拆零单位换算" prop="itemTinyRateId">
          <el-select v-model="mObject.itemTinyRateId" placeholder="请选择">
            <el-option label="无" :value="null"></el-option>
            <el-option
              v-for="item in itemTinyRates.data"
              :key="item.id"
              :label="unitCodeAmount(item)"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态" prop="marketable">
          <el-select style="width:120px;" v-model="mObject.marketable">
            <el-option label="上架" :value="true"></el-option>
            <el-option label="下架" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--导入-->
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="模板下载" prop="file">
          <el-button size="small" class="filter-item" type="primary" icon="el-icon-download" @click="downloadFile()">
            模版下载
          </el-button>
        </el-form-item>
        <el-form-item label="导入文件" prop="logo">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="fileUploadUrl()"
            :data="mObject"
            :headers="headersData"
            :beforeUpload="uploadBefore"
            :onSuccess="uploadGoodsSuccess"
            :multiple="false"
            :auto-upload="false"
            :file-list="fileList">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="uploadFile()">上 传</el-button>
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

  .pop-form {
    .input {
      width: auto;
    }
    .el-input__inner {
      padding: 0 10px;
      width: 148px;
      height: 28px;
      line-height: 28px;
    }
  }

  .show-text {
    cursor: pointer;
    color: #0088cc;
    border-bottom: 1px dashed #0088cc;
  }
  .el-input__suffix .el-select__caret.el-input__icon:before {
    content: "\E605";
}
  .el-input-number{
    display:block;
    width:100%;
  }
  .el-input-number .el-input__inner{
    padding:0;
    text-align: left;
  }
  .store{
    .el-input__inner{
      border:none;
      height: 38px;
    }
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
        pharmacyLoading: false,
        skuLoading: false,
        listLoading: false,
        skuId: null,
        param: { page: 1, limit: 10, searchCondition: {} },
        addDialogVisible: false,
        dialogVisible: false,
        mTitle: '',
        marketableTime: '',
        attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
        attachmentUrl: getConstants().ATTACHMENT_URL,
        importGoodsUrl: '',
        fileList: [],
        restore: 0,
        mObject: {
          pharmacyId: null
        },
        headersData: { Authorization: getToken() },

        rules: {
          itemName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        }
      }
    },
    filters: {},
    created() {
      this.getPharmacyGoodsList()
    },
    computed: mapState({
      pharmacyGoods: state => state.pharmacyGoods.pharmacyGoods,
      pharmacys: state => state.pharmacy.pharmacys,
      goodsSkus: state => state.goodsSku.goodsSkus,
      itemTinyRates: state => state.goodsSku.itemTinyRates
    }),
    mounted(){
      let a = document.querySelectorAll('.store input')
      console.log(a)
      for(let i = 0;i < a.length;i++){
        if(i<2){
          a[i].placeholder = '库存'
        }else {
          a[i].placeholder = '价格'
        }
      }
    },
    methods: {
      showPop(row, key) {
        if (key === 'itemTinyRateId') {
          this.getItemTinyRate(row)
        }
        console.log(row[key])
        row[key + 'visible'] = true
        this.restore = row[key]
        let flag = true;
        this.$nextTick(()=>{
          let element = document.querySelectorAll('body>.el-popover')
          for (let i = 0;i<element.length;i++ ){
            if ( flag && element[i].style.display != 'none') {
              flag = false
            }else if(!flag){
              element[i].style.display = 'none'
            }
          }
        })
      },
      hidePop(row, key) {
        row[key + 'visible'] = false
      },
      savePop(row, key) {
        row[key + 'visible'] = false
        row[key] = this.restore
        this.updPharmacyItemStore(row, key)
      },
      updPharmacyItemStore(row, key) {
        this.$store.dispatch('updPharmacyItemStore', row).then(() => {
          row[key] = this.restore
          if (key === 'itemTinyRateId') {
            this.getPharmacyGoodsList()
          }
        })
      },
      getItemTinyRate(row) {
        if (row) {
          this.skuId = row.skuId
        }
        this.$store.dispatch('getItemTinyRate', {
          params: { id: this.skuId }, callback: () => {
          }
        })
      },
      unitCodeAmount(item) {
        return item.unitCode + ':' + item.amount
      },
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
        this.$store.dispatch('getPharmacyGoodsList', {
          params: this.param, callback: () => {
            this.listLoading = false
          }
        })
      },
      resetSearch() {
        this.param.page = 1
        this.param.searchCondition = {}
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
      /**
       * 新增药店药品
       * @param row
       */
      add() {
        this.mTitle = '新增'
        this.addDialogVisible = true
      },
      /**
       * 输入名称查询药店
       * @param query
       */
      getPharmacyByNameList(query) {
        this.$store.dispatch('clearPharmacyList')
        if (query && query !== '') {
          this.pharmacyLoading = true
          this.$store.dispatch('getPharmacyList', {
            params: { page: 0, limit: 100, searchCondition: { name: query }}, callback: () => {
              this.pharmacyLoading = false
            }
          })
        }
      },
      getGoodsSkuList(query) {
        this.$store.dispatch('clearGoodsSkuList')
        if (query && query !== '') {
          this.skuLoading = true
          this.$store.dispatch('getGoodsSkuList', {
            params: { page: 0, limit: 10, searchCondition: { itemName: query }}, callback: () => {
              this.skuLoading = false
            }
          })
        }
      },
      handleSkuChange(val) {
        this.skuId = val
        this.getItemTinyRate()
        const list = this.goodsSkus.data
        for (let index = 0; index < list.length; index++) {
          const item = list[index]
          if (item.id === val) {
            this.mObject.skuSpec = item.spec
            this.mObject.skuUnit = item.unit
            this.mObject.manufacturer = item.manufacturer
            return
          }
        }
        // this.skuId = val
      },
      /**
       * 提交表单
       */
      submitForm() {
        this.$refs['mObject'].validate((valid) => {
          if (valid) {
            this.$store.dispatch('addPharmacyGoods', {
              data: this.mObject, callback: () => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.addDialogVisible = false
                this.getPharmacyGoodsList()
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 导入
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
      deletePharmacyGoods(role) {
        this.$confirm('此操作将永久删除该药店药品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deletePharmacy', {
            data: role, callback: () => {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 3 * 1000
              })
              this.getPharmacyGoodsList()
            }
          })
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
        this.deletePharmacyGoods({ id: idsArr.join(',') })
      },
      // 上下架
      marketableGoods(row, m) {
        row.marketable = m
        this.$confirm('此操作将上/下架该药店, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('marketableGoods', row).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!',
              duration: 3 * 1000
            })
            this.getPharmacyGoodsList()
          })
        })
      },
      // 批量上下架
      multiMarketableGoods(m) {
        const idsArr = []
        for (const row of this.selectedRows) {
          idsArr.push(row.id)
        }
        if (!idsArr.length) {
          this.$message({
            type: 'error',
            message: '请先选择需要操作的项!',
            duration: 3 * 1000
          })
          return false
        }
        this.marketableGoods({ id: idsArr.join(','), marketable: m }, m)
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
      exportFile() {
        if (!this.param.searchCondition.pharmacyName || this.param.searchCondition.pharmacyName === '') {
          this.$message({
            type: 'error',
            message: '请先填写药店名称!',
            duration: 3 * 1000
          })
          return
        }
        const url = '/business/pharmacy/pharmacyItemInfo/export/' + this.param.searchCondition.pharmacyName
        download(url, this.param, '药店药品盘点')
      }
    }
  }
</script>
