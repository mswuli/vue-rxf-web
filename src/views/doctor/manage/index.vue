<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="医生姓名">
      </el-input>
      <el-select style="width:250px;" v-model="param.searchCondition.hspId" placeholder="请选择医院" filterable>
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in hospitals.data"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      <el-button class="filter-item" @click="getDoctorList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="doctors.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="name" width="120" label="医生姓名"></el-table-column>
      <el-table-column prop="hspName" width="150" label="医院名称"></el-table-column>
      <el-table-column prop="sexName" width="72" label="性别"></el-table-column>
      <el-table-column prop="hspDepartName" width="150" label="所在科室"></el-table-column>
      <el-table-column prop="titleName" width="150" label="职称"></el-table-column>
      <el-table-column prop="skillful" width="150" label="专业专长"></el-table-column>
      <el-table-column prop="qualificationsName" width="150" label="学历"></el-table-column>
      <el-table-column prop="accountUserName" width="150" label="账号"></el-table-column>
      <el-table-column prop="hisId" width="150" label="对应His账号"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteDoctor(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="doctors.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="医生姓名" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="所在医院" prop="hspId">
          <el-select style="width:250px;" v-model="mObject.hspId" placeholder="请选择医院" filterable
          @change="changeHospital()">
            <el-option
              v-for="item in hospitals.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在科室" prop="hspDepartId">
          <el-select style="width:250px;" v-model="mObject.hspDepartId" placeholder="请选择科室">
            <el-option
              v-for="item in hospitalDepartments.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sexCode">
          <el-select style="width:120px;" v-model="mObject.sexCode" placeholder="请选择性别">
            <el-option
              v-for="item in sexTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="titleCode">
          <el-select style="width:250px;" v-model="mObject.titleCode" placeholder="请选择职称">
            <el-option
              v-for="item in doctorTitles"
              :key="item.id"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行政职务" prop="titleAdmin">
          <el-input v-model="mObject.titleAdmin"></el-input>
        </el-form-item>
        <el-form-item label="教学职称" prop="titleTeach">
          <el-select style="width:250px;" v-model="mObject.titleTeachCode" placeholder="请选择教学职务">
            <el-option
              v-for="item in titleTeachTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业专长" prop="skillful">
          <el-input v-model="mObject.skillful"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-date-picker
            v-model="mObject.birth"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学历" prop="qualifications">
          <el-select style="width:250px;" v-model="mObject.qualificationsCode" placeholder="请选择学历">
            <el-option
              v-for="item in educationBackgrounds"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毕业院校" prop="universities">
          <el-input v-model="mObject.universities"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="img">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadImgSuccess"
            accept="image/*">
            <img v-if="mObject.img" :src="mObject.img" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="个人简介" prop="resume">
          <el-input v-model="mObject.resume"></el-input>
        </el-form-item>
        <el-form-item label="出诊信息" prop="visit">
          <el-input v-model="mObject.visit"></el-input>
        </el-form-item>
        <el-form-item label="科室电话" prop="telClassify">
          <el-input v-model="mObject.telClassify"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="mObject.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="mObject.email"></el-input>
        </el-form-item>
        <el-form-item label="电子签名" prop="sign">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadSignSuccess"
            accept="image/*">
            <img v-if="mObject.sign" :src="mObject.sign" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="His账号" prop="hisId">
          <el-input v-model="mObject.hisId"></el-input>
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
.logo {
  width: 120px;
  height: 120px;
  display: block;
}
.pharmacy-img {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<script>
import { mapState } from 'vuex'
import { getToken } from '@/utils/auth'
import { getConstants } from '@/utils/constants'

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      mObject: {
      },
      mTitle: '',

      attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
      attachmentUrl: getConstants().ATTACHMENT_URL,
      upLoadData: {
        file_id: 0
      },
      headersData: { Authorization: getToken() },

      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 10, message: '名称长度不能超过10个字', trigger: 'blur' }
        ],
        hspId: [
          { required: true, message: '请选择医院', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getDoctorList()
    this.getSexList()
    this.getDoctorTitleList()
    this.getHospitalList()
    this.getTitleTeachTypeList()
    this.getEducationBackgroundList()
  },
  computed: mapState({
    doctors: state => state.doctor.doctors,
    hospitals: state => state.hospital.hospitals,
    hospitalDepartments: state => state.hospital.hospitalDepartments,
    sexTypes: state => state.doctor.sexTypes,
    doctorTitles: state => state.doctor.doctorTitles,
    titleTeachTypes: state => state.doctor.titleTeachTypes,
    educationBackgrounds: state => state.doctor.educationBackgrounds
  }),
  methods: {
    getDoctorList() {
      this.listLoading = true
      this.$store.dispatch('getDoctorList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getSexList() {
      this.$store.dispatch('getSexList', { params: {}})
    },
    getDoctorTitleList() {
      this.$store.dispatch('getDoctorTitleList', { params: {}})
    },
    getTitleTeachTypeList() {
      this.$store.dispatch('getTitleTeachTypeList', { params: {}})
    },
    getEducationBackgroundList() {
      this.$store.dispatch('getEducationBackgroundList', { params: {}})
    },
    getHospitalList() {
      this.$store.dispatch('getHospitalList', { params: { page: 0, limit: 10000, searchCondition: {}}})
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getDoctorList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getDoctorList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getDoctorList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    getHospitalDepartmentList(hspId) {
      if (hspId) {
        this.$store.dispatch('getHospitalDepartmentList', { id: hspId })
      }
    },
    changeHospital() {
      console.log('change hospital')
      this.getHospitalDepartmentList(this.mObject.hspId)
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '编辑'
      if (!row) {
        this.mTitle = '新增'
        row = {
          sign: '',
          img: ''
        }
      }
      this.mObject = Object.assign({}, row)
      this.getHospitalDepartmentList(this.mObject.hspId)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 删除角色
    deleteDoctor(role) {
      this.$confirm('此操作将永久删除该医生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteDoctor', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getDoctorList()
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
      this.deleteDoctor({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editDoctor', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getDoctorList()
            } })
          } else {
            this.$store.dispatch('addDoctor', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getDoctorList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    uploadSignSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.sign = this.attachmentUrl + response.data
      }
    },
    uploadImgSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.img = this.attachmentUrl + response.data
      }
    }
  }
}
</script>
