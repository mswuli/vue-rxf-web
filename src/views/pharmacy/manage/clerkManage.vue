<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="名字">
      </el-input>
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="-"
        start-placeholder="生日开始时间"
        end-placeholder="生日结束时间"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-select style="width:120px;" v-model="param.searchCondition.sexCode" placeholder="性别">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in sexTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <br/><br/>
      <!--<el-input style="width: 120px;" v-model="param.searchCondition.title" class="filter-item" placeholder="职位">-->
      <!--</el-input>-->
      <el-input style="width: 150px;" v-model="param.searchCondition.mobile" class="filter-item" placeholder="联系方式">
      </el-input>
      <el-input style="width: 180px;" v-model="param.searchCondition.idCard" class="filter-item" placeholder="身份证号">
      </el-input>

      <el-select style="width:120px;" v-model="param.searchCondition.statusCode" placeholder="状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in pharmacyAssistantStatus.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button class="filter-item" @click="getPharmacyAssistantList()" type="primary" icon="el-icon-search">搜索
      </el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="pharmacyAssistants.data"
      v-loading="pharmacyAssistantLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="pharmacyName" width="150" label="关联药店"></el-table-column>
      <el-table-column prop="account" width="120" label="关联账号"></el-table-column>
      <el-table-column prop="name" width="80" label="姓名"></el-table-column>
      <el-table-column prop="titleName" width="150" label="职位"></el-table-column>
      <el-table-column prop="birth" width="160" label="生日">
        <template slot-scope="scope">
          {{scope.row.birth | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="sexName" width="80" label="性别"></el-table-column>
      <el-table-column prop="mobile" width="150" label="联系方式"></el-table-column>
      <el-table-column prop="idCard" width="180" label="身份证号"></el-table-column>
      <el-table-column prop="statusName" width="150" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="214">
        <template slot-scope="scope">
          <el-button v-if="scope.row.statusCode < 0" type="primary" size="mini" @click="registAssistant(scope.row)">
            提交审核
          </el-button>
          <el-button v-else type="primary" disabled size="mini" @click="registAssistant(scope.row)"> 提交审核</el-button>

          <el-button v-if="scope.row.statusCode < 0" type="primary" size="mini" @click="edit(scope.row)">编辑店员
          </el-button>
          <el-button v-else type="primary" disabled size="mini" @click="edit(scope.row)">编辑店员</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]"
                     :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="pharmacyAssistants.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">

        <el-form-item label="姓名" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-date-picker
            v-model="mObject.birth"
            type="date"
            placeholder="请选择生日"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sexCode">
          <el-select v-model="mObject.sexCode" placeholder="请选择性别">
            <el-option
              v-for="item in sexTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="title">
          <el-select v-model="mObject.title" placeholder="请选择职位" @change="handlePharmacyTitleChange">
            <el-option
              v-for="item in pharmacyTitleList"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="mobile">
          <el-input v-model="mObject.mobile"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="mObject.idCard"></el-input>
        </el-form-item>
        <el-form-item label="身份证正面" prop="idCardHead">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadIdcardHeadSuccess"
            accept="image/*">
            <img v-if="mObject.idCardHead" :src="mObject.idCardHead" class="idCardHead">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证反面" prop="idCardTail">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadIdcardTailSuccess"
            accept="image/*">
            <img v-if="mObject.idCardTail" :src="mObject.idCardTail" class="idCardTail">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="药师证" prop="licensedPharmacist" v-if="pharmacyLicense">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadLicensedPharmacistSuccess"
            accept="image/*">
            <img v-if="mObject.licensedPharmacist" :src="mObject.licensedPharmacist" class="licensedPharmacist">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .radio {
    margin-bottom: 10px;
  }

  .pic-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .pic-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .logo-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .idCardHead {
    width: 120px;
    height: 120px;
    display: block;
  }

  .idCardTail {
    width: 120px;
    height: 120px;
    display: block;
  }

  .licensedPharmacist {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import { getToken } from '@/utils/auth'
  import { getConstants } from '@/utils/constants'
  import moment from 'moment'

  export default {
    data() {
      return {
        pharmacyLicense: false,
        pharmacyAssistantLoading: false,
        param: { page: 1, limit: 10, searchCondition: {} },
        mObject: {},
        mTitle: '',
        daterange: null,
        dialogVisible: false,
        attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
        attachmentUrl: getConstants().ATTACHMENT_URL,
        upLoadData: {
          file_id: 0
        },
        headersData: { Authorization: getToken() },
        rules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          birth: [{ required: true, message: '请选择生日', trigger: 'blur' }],
          sexCode: [{ required: true, message: '请选择性别', trigger: 'blur' }],
          title: [{ required: true, message: '请输入职位', trigger: 'blur' }],
          mobile: [
            { required: true, message: '请输入联系方式', trigger: 'blur' }
          ],
          idCard: [
            { required: true, message: '请输入身份证号', trigger: 'blur' }
          ],
          idCardHead: [
            { required: false, message: '请上传身份证正面', trigger: 'blur' }
          ],
          idCardTail: [
            { required: false, message: '请上传身份证反面', trigger: 'blur' }
          ],
          licensedPharmacist: [
            { required: this.pharmacyLicense, message: '请上传药师证', trigger: 'blur' }
          ]
        }
      }
    },
    filters: {},
    created() {
      this.getSexList()
      this.getPharmacyTitleList()
      this.getPharmacyAssistantList()
      this.getPharmacyAssistantStatusList()
    },
    computed: mapState({
      sexTypes: state => state.doctor.sexTypes,
      pharmacyTitleList: state => state.pharmacy.pharmacyTitleList,
      pharmacyAssistants: state => state.clerkManage.pharmacyAssistants,
      pharmacyAssistantStatus: state => state.clerkManage.pharmacyAssistantStatus
    }),
    methods: {
      getPharmacyAssistantList() {
        if (this.daterange) {
          this.param.searchCondition['birthStart'] = moment(
            this.daterange[0]
          ).format('YYYY-MM-DD')
          this.param.searchCondition['birthEnd'] = moment(
            this.daterange[1]
          ).format('YYYY-MM-DD')
        }
        this.pharmacyAssistantLoading = true
        this.$store.dispatch('getPharmacyAssistantList', {
          params: this.param,
          callback: () => {
            this.pharmacyAssistantLoading = false
          }
        })
      },
      getPharmacyAssistantStatusList() {
        this.$store.dispatch('getPharmacyAssistantStatusList')
      },
      getSexList() {
        this.$store.dispatch('getSexList')
      },
      getPharmacyTitleList() {
        this.$store.dispatch('getPharmacyTitleList')
      },
      handlePharmacyTitleChange(val) {
        this.pharmacyLicense = val === 'LICENSED'
      },
      resetSearch() {
        this.param.searchCondition = {}
        this.daterange = null
        this.getPharmacyAssistantList()
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getPharmacyAssistantList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getPharmacyAssistantList()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      // 编辑/新增
      edit(row) {
        this.mTitle = '编辑'
        if (!row) {
          this.pharmacyLicense = false
          this.mTitle = '新增'
          row = {
            idCardHead: '',
            idCardTail: '',
            licensedPharmacist: ''
          }
        }
        this.mObject = Object.assign({}, row)
        if (this.mObject.birth != null) {
          this.mObject.birth = moment(this.mObject.birth).format('YYYY-MM-DD')
        }
        this.pharmacyLicense = this.mObject.title === 'LICENSED'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['mObject'].clearValidate()
        })
      },
      uploadIdcardHeadSuccess(response, file, fileList) {
        if (response.success) {
          this.mObject.idCardHead = this.attachmentUrl + response.data
        }
      },
      uploadIdcardTailSuccess(response, file, fileList) {
        if (response.success) {
          this.mObject.idCardTail = this.attachmentUrl + response.data
        }
      },
      uploadLicensedPharmacistSuccess(response, file, fileList) {
        if (response.success) {
          this.mObject.licensedPharmacist = this.attachmentUrl + response.data
        }
      },
      registAssistant(row) {
        this.$confirm('您确定要提交审核吗?', '提示', {
          confirmButtonText: '提交审核',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('registAssistant', {
            data: { id: row.id, statusCode: 0 },
            callback: () => {
              this.$message({
                type: 'success',
                message: '提交成功!',
                duration: 3 * 1000
              })
              this.getPharmacyAssistantList()
            }
          })
        })
      },
      // 提交表单
      submitForm() {
        if (this.mObject.title === 'LICENSED') {
          if (!this.mObject.licensedPharmacist) {
            this.$message({
              message: '执业药师请上传药师证',
              type: 'error',
              duration: 3 * 1000
            })
            return false
          }
        }
        this.$refs['mObject'].validate(valid => {
          if (valid) {
            console.log(this.mObject)
            if (this.mObject.id) {
              this.$store.dispatch('editPharmacyAssistant', {
                data: this.mObject,
                callback: () => {
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.dialogVisible = false
                  this.getPharmacyAssistantList()
                }
              })
            } else {
              this.$store.dispatch('addPharmacyAssistant', {
                data: this.mObject,
                callback: () => {
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.dialogVisible = false
                  this.getPharmacyAssistantList()
                }
              })
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
