<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select style="width:120px;" v-model="param.searchCondition.hspid" placeholder="医院名称" filterable remote
                 :remote-method="getHospitalList" :loading="hspLoading">
        <el-option
          v-for="item in hospitals.data"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-input style="width: 120px;" v-model="param.searchCondition.itemName" class="filter-item" placeholder="药品名称">
      </el-input>
      <el-button class="filter-item" @click="getHspSkuRelList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-upload" @click="upload()">导入</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="hspSkuRels.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="hspName" label="医院名称" width="100"></el-table-column>
      <el-table-column prop="hspTypeName" label="医院类型" width="100"></el-table-column>
      <el-table-column prop="itemSkuBaseInfoVO.itemName" label="药品名称" width="200"></el-table-column>
      <el-table-column prop="itemSkuBaseInfoVO.commonName" label="通用名称"></el-table-column>
      <el-table-column prop="itemSkuBaseInfoVO.manufacturer" label="厂商"></el-table-column>
      <el-table-column prop="itemSkuBaseInfoVO.spec" label="规格"></el-table-column>
      <el-table-column prop="hspSkuSpec" label="医院规格"></el-table-column>
      <el-table-column prop="itemSkuBaseInfoVO.goodsBarcode" label="条形码"></el-table-column>
      <el-table-column prop="itemSkuBaseInfoVO.approvalNumber" label="批准文号"></el-table-column>
      <el-table-column prop="itemSkuBaseInfoVO.dosageForms" label="剂型"></el-table-column>
      <el-table-column prop="hspSkuId" label="医院药品ID"></el-table-column>
      <el-table-column prop="skuId" label="药品ID"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHspSkuRel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="hspSkuRels.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="200px">
        <el-form-item label="医院名称" prop="hspId">
          <el-select v-model="mObject.hspId" placeholder="请输入医院名称" filterable remote
                     :remote-method="getHospitalList" :loading="hspLoading">
            <el-option
              v-for="item in hospitals.data"
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
        <el-form-item label="医院药品id" prop="hspSkuId">
          <el-input v-model="mObject.hspSkuId"></el-input>
        </el-form-item>
        <el-form-item label="医院药品规格" prop="hspSkuSpec">
          <el-input v-model="mObject.hspSkuSpec"></el-input>
        </el-form-item>
        <el-form-item label="医院药品单位" prop="hspSkuUnit">
          <el-input v-model="mObject.hspSkuUnit"></el-input>
        </el-form-item>
        <el-form-item label="最小拆零单位换算" prop="itemTinyRateId">
          <el-select v-model="mObject.itemTinyRateId" placeholder="请选择" >
            <el-option label="无" :value="null"></el-option>
            <el-option
              v-for="item in itemTinyRates.data"
              :key="item.id"
              :label="unitCodeAmount(item)"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="导入"
      :close-on-click-modal=false
      :visible.sync="uDialogVisible">
      <el-form :model="uObject" :rules="uRules" ref="uObject" label-width="120px">
        <el-form-item label="模板下载" prop="file">
          <el-button size="small" class="filter-item" type="primary" icon="el-icon-download" @click="downloadFile()">模版下载</el-button>
        </el-form-item>
        <el-form-item label="导入文件" prop="file">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="fileUploadUrl()"
            :on-change="handleChange"
            :data="uObject"
            :headers="headersData"
            :beforeUpload="uploadBefore"
            :onSuccess="uploadHspskurelSuccess"
            :multiple="false"
            :auto-upload="false"
            :file-list="fileList">
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="uploadFile()">上 传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { download } from '@/utils/export'
import { getConstants } from '@/utils/constants'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      hspLoading: false,
      skuLoading: false,
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      uDialogVisible: false,
      mTitle: '',
      mObject: {
      },
      uObject: {
      },
      skuId: null,
      headersData: { Authorization: getToken() },
      attachmentUrl: getConstants().ATTACHMENT_URL,
      fileList: [],
      rules: {
        hspId: [
          { required: true, message: '请选择医院', trigger: 'blur' }
        ],
        skuId: [
          { required: true, message: '请选择药品', trigger: 'blur' }
        ],
        hspSkuId: [
          { required: true, message: '请输入医院药品ID', trigger: 'blur' }
        ],
        hspSkuSpec: [
          { required: true, message: '请输入医院药品规格', trigger: 'blur' }
        ],
        hspSkuUnit: [
          { required: true, message: '请输入医院药品单位', trigger: 'blur' }
        ]
      },
      uRules: {
      }
    }
  },
  filters: {
  },
  created() {
    this.getHspSkuRelList()
    this.$store.dispatch('clearHospitalList')
    this.$store.dispatch('clearGoodsSkuList')
  },
  computed: mapState({
    hspSkuRels: state => state.hspSkuRel.hspSkuRels,
    hospitals: state => state.hospital.hospitals,
    goodsSkus: state => state.goodsSku.goodsSkus,
    itemTinyRates: state => state.goodsSku.itemTinyRates
  }),
  methods: {
    getHspSkuRelList() {
      this.listLoading = true
      this.$store.dispatch('getHspSkuRelList', { params: this.param, callback: () => {
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
    getGoodsSkuList(query) {
      this.$store.dispatch('clearGoodsSkuList')
      if (query !== '') {
        this.skuLoading = true
        this.$store.dispatch('getGoodsSkuList', { params: { page: 0, limit: 10, searchCondition: { itemName: query }}, callback: () => {
          this.skuLoading = false
        } })
      }
    },
    getItemTinyRate() {
      this.$store.dispatch('getItemTinyRate', { params: { id: this.skuId }, callback: () => {
      } })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.$store.dispatch('clearHospitalList')
      this.$store.dispatch('clearGoodsSkuList')
      this.getHspSkuRelList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getHspSkuRelList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getHspSkuRelList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    handleSkuChange(val) {
      this.skuId = val
      this.getItemTinyRate()
      const list = this.goodsSkus.data
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        if (item.id === val) {
          // this.mObject.skuId = item.id
          this.mObject.skuSpec = item.spec
          this.mObject.skuUnit = item.unit
          this.mObject.manufacturer = item.manufacturer
          return
        }
      }
      // this.skuId = val
    },
    unitCodeAmount(item) {
      return item.unitCode + ':' + item.amount
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '编辑'
      if (!row) {
        this.mTitle = '新增'
        this.mObject = {}
      } else {
        this.mObject = Object.assign({}, row)
        this.$store.dispatch('setHospitalList', { data: [{ id: row.hspId, name: row.hspName }] })
        this.$store.dispatch('setGoodsSkuList', { data: [{ id: row.skuId, itemName: row.itemSkuBaseInfoVO.itemName }] })
        this.skuId = row.skuId
        this.getItemTinyRate()
        this.mObject.skuId = row.skuId
        this.mObject.skuSpec = row.itemSpec
        this.mObject.skuUnit = row.itemUnit
        this.mObject.manufacturer = row.manufacturer
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 导入
    upload(row) {
      if (!row) {
        row = {}
      }
      this.uObject = Object.assign({}, row)
      this.uDialogVisible = true
      this.$nextTick(() => {
        this.$refs['uObject'].clearValidate()
      })
    },
    // 删除角色
    deleteHspSkuRel(role) {
      this.$confirm('此操作将永久删除该医院品种, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteHspSkuRel', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getHspSkuRelList()
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
      this.deleteHspSkuRel({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          if (this.mObject.id) {
            this.$store.dispatch('editHspSkuRel', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getHspSkuRelList()
            } })
          } else {
            this.$store.dispatch('addHspSkuRel', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getHspSkuRelList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    downloadFile() {
      const url = '/business/hospital/hspSkuRel/exportModel'
      download(url, null, '医院药品导入模版')
    },
    uploadBefore(file) {
      this.fileList.push(file)
    },
    uploadHspskurelSuccess(response, file, fileList) {
      if (response.success) {
        this.uDialogVisible = false
        this.fileList = fileList
        this.getHspSkuRelList()
      }
    },
    fileUploadUrl() {
      return getConstants().HSPSKUREL_UPLOAD_URL
    },
    uploadFile() {
      this.$refs.upload.submit()
    }
  }
}
</script>
