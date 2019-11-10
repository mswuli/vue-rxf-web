<template>
  <div class="app-container">
    <div id="mapContainer" style="display: none"></div>
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="医院名称">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.type" placeholder="药店类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in hospitalTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-button class="filter-item" @click="getHospitalList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
      <el-button type="primary" icon="el-icon-setting" @click="addManager()">设置管理员</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="hospitals.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="name" width="150" label="医院名称"></el-table-column>
      <el-table-column prop="typeName" width="150" label="医院类型"></el-table-column>
      <el-table-column prop="province" width="200" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" width="150" label="电话"></el-table-column>
      <el-table-column width="152" prop="establishTime" label="创办时间">
        <template slot-scope="scope">
          {{scope.row.establishTime | dateFilter}}
        </template>
      </el-table-column>
      <el-table-column prop="templateId" width="150" label="关联处方模版"></el-table-column>
      <el-table-column prop="creator" width="100" label="管理员账号"></el-table-column>
      <el-table-column fixed="right" width="76" label="科室">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDepartment(scope.row)">管理</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteHospital(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="hospitals.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="医院名称" prop="name">
          <el-input v-model="mObject.name"></el-input>
        </el-form-item>
        <el-form-item label="医院简称" prop="shortName">
          <el-input v-model="mObject.shortName"></el-input>
        </el-form-item>
        <el-form-item label="医疗机构编码" prop="code">
          <el-input v-model="mObject.code"></el-input>
        </el-form-item>
        <el-form-item label="医院类型" prop="type">
          <el-select v-model="mObject.type" placeholder="请选择医院类型">
            <el-option
              v-for="item in hospitalTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省市区" prop="province">
          <a-map :address-obj.sync="mObject" v-if="dialogVisible"></a-map>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <a-map-addrees :address-obj.sync="mObject" v-if="dialogVisible"></a-map-addrees>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="mObject.tel"></el-input>
        </el-form-item>
        <el-form-item label="创办时间" prop="establishTime">
          <el-date-picker
            v-model="mObject.establishTime"
            type="date"
            placeholder="选择创办时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="法人" prop="juridicalPerson">
          <el-input v-model="mObject.juridicalPerson"></el-input>
        </el-form-item>
        <el-form-item label="医院营业执照号码" prop="businessLicenseNumber">
          <el-input v-model="mObject.businessLicenseNumber"></el-input>
        </el-form-item>
        <el-form-item label="医院LOGO" prop="logo">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadLogoSuccess"
            accept="image/*">
            <img v-if="mObject.logo" :src="mObject.logo" class="logo">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="医院主图" prop="img">
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
            <img v-if="mObject.img" :src="mObject.img" class="pharmacy-img">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="医院简介" prop="note">
          <el-input v-model="mObject.note"></el-input>
        </el-form-item>
        <el-form-item label="医院处方模板" prop="templateId">
          <el-select v-model="mObject.templateId" placeholder="请选择医院处方模板">
            <el-option
              v-for="item in rsTemplate"
              :key="item.id"
              :label="item.name"
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
      title="科室管理"
      :close-on-click-modal=false
      :visible.sync="departmentDialogVisible"
      width="90%">
      <div class="filter-container">
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dedit()">新增</el-button>
        <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="ddeleteMulti()">批量删除</el-button>
      </div>
      <tree-table :data="hospitalDepartmentTrees" :selectedRowFunc="selectedRowFunc" :editFunc="dedit" :deleteFunc="ddeleteDepartment" :columns="columns" border></tree-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="departmentDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="dmTitle"
      :close-on-click-modal=false
      :visible.sync="ddialogVisible">
      <el-form :model="dmObject" :rules="dmRules" ref="dmObject" label-width="120px">
        <el-form-item label="上级科室" prop="parentId">
          <el-select v-model="dmObject.parentId" placeholder="请选择上级科室" filterable>
            <el-option
              v-for="item in hospitalDepartments.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科室名称" prop="name">
          <el-input v-model="dmObject.name"></el-input>
        </el-form-item>
        <el-form-item label="科室电话" prop="tel">
          <el-input v-model="dmObject.tel"></el-input>
        </el-form-item>
        <el-form-item label="科室排序" prop="sort">
          <el-input v-model="dmObject.sort"></el-input>
        </el-form-item>
        <el-form-item label="科室人数" prop="num">
          <el-input v-model="dmObject.num"></el-input>
        </el-form-item>
        <el-form-item label="科室负责人" prop="leader">
          <el-input v-model="dmObject.leader"></el-input>
        </el-form-item>
        <el-form-item label="科室描述" prop="description">
          <el-input v-model="dmObject.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dsubmitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="设置管理员"
      :close-on-click-modal=false
      :visible.sync="managerDialogVisible">
      <el-form :model="mManager" :rules="mRules" ref="mManager" label-width="120px">
        <el-form-item label="职称" prop="title">
          <el-input v-model="mManager.title"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="accountName">
          <el-input v-model="mManager.accountName"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-date-picker
            v-model="mManager.birth"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="mManager.sex" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="accountMobile">
          <el-input v-model="mManager.accountMobile"></el-input>
        </el-form-item>
        <el-form-item label="登录用户名" prop="accountUserName">
          <el-input v-model="mManager.accountUserName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="accountPassword">
          <el-input type="password" v-model="mManager.accountPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="managerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitManagerForm">确 定</el-button>
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
import treeTable from '@/components/TreeTable'
import AMap from '@/components/AMap'
import AMapAddrees from '@/components/AMap/address'

export default {
  components: { treeTable, AMap, AMapAddrees },
  data() {
    let validateUsername = (rule, value, callback) => {
      let reg = /^1(3|4|5|6|7|8)\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };
    let validatename = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_-]{5,16}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      mObject: {},
      mTitle: '',

      dparam: { page: 1, limit: 10, searchCondition: {}},
      departmentDialogVisible: false,
      dmObject: {},
      dmTitle: '',
      dSelectedRows: [],
      selectedRows: [],
      ddialogVisible: false,

      attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
      attachmentUrl: getConstants().ATTACHMENT_URL,
      upLoadData: {
        file_id: 0
      },
      headersData: { Authorization: getToken() },
      hspId: '',
      managerDialogVisible: false,
      mManager: {},
      rules: {
        name: [
          { required: true, message: '请输入医院名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请选择医院机构编码', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择医院类型', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择地址', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur'},
          { trigger: 'blur',  validator: validateUsername }
        ],
        establishTime: [
          { required: true, message: '请选择创办时间', trigger: 'blur' }
        ],
        juridicalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' }
        ],
        businessLicenseNumber: [
          { required: true, message: '请输入医院营业执照号码', trigger: 'blur' }
        ]
      },
      dmRules: {
        name: [
          { required: true, message: '请输入医院名称', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { trigger: 'blur',  validator: validateUsername }
        ]
      },
      mRules: {
        title: [
          { required: true, message: '请输入职称', trigger: 'blur' }
        ],
        accountName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        accountMobile: [
          { required: true, message: '请输入11位手机号', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        accountUserName: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' },
          { trigger: 'blur',  validator: validatename }
        ],
        accountPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { trigger: 'blur',  validator: validatePass }
        ]
      },
      columns: [
        {
          text: '科室名称',
          value: 'name',
          width: 200
        },
        {
          text: '排序',
          value: 'sort'
        },
        {
          text: '科室人数',
          value: 'num'
        },
        {
          text: '科室电话',
          value: 'tel'
        },
        {
          text: '科室负责人',
          value: 'leader'
        },
        {
          text: '科室简介',
          value: 'description'
        }
      ]
    }
  },
  filters: {
  },
  created() {
    this.getHospitalList()
    this.getHospitalTypeList()
    this.getRsTemplateList()
  },
  computed: mapState({
    hospitals: state => state.hospital.hospitals,
    hospitalTypes: state => state.hospital.hospitalTypes,
    hospitalDepartmentTrees: state => state.hospital.hospitalDepartmentTrees,
    hospitalDepartments: state => state.hospital.hospitalDepartments,
    rsTemplate: state => state.hospital.rsTemplate
  }),
  methods: {
    getHospitalList() {
      this.listLoading = true
      this.$store.dispatch('getHospitalList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getHospitalTypeList() {
      this.$store.dispatch('getHospitalTypeList')
    },
    getRsTemplateList() {
      this.$store.dispatch('getRsTemplateList')
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getHospitalList()
    },
    resetDepartmentSearch() {
      this.dparam.searchCondition = {}
      this.getHospitalDepartmentList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getHospitalList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getHospitalList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '编辑'
      if (!row) {
        this.mTitle = '新增'
        row = {
          logo: '',
          img: ''
        }
      }
      this.mObject = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 删除角色
    deleteHospital(role) {
      this.$confirm('此操作将永久删除该医院, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteHospital', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getHospitalList()
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
      this.deleteHospital({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editHospital', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getHospitalList()
            } })
          } else {
            this.$store.dispatch('addHospital', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getHospitalList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    uploadLogoSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.logo = this.attachmentUrl + response.data
      }
    },
    uploadImgSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.img = this.attachmentUrl + response.data
      }
    },

    getHospitalDepartmentList() {
      this.$store.dispatch('getHospitalDepartmentTreeList', { id: this.hspId })
    },
    showDepartment(row) {
      this.departmentDialogVisible = true
      this.hspId = row.id
      this.getHospitalDepartmentList()
    },
    dhandleSizeChange(size) {
      this.dparam.limit = size
      this.getHospitalDepartmentList()
    },
    dhandleCurrentChange(page) {
      this.dparam.page = page
      this.getHospitalDepartmentList()
    },
    dhandleSelectionChange(val) {
      this.dSelectedRows = val
    },
    selectedRowFunc(val) {
      this.dSelectedRows = val
    },
    // 编辑/新增
    dedit(row) {
      this.dmTitle = '编辑'
      if (!row) {
        this.dmTitle = '新增'
        row = {}
      }
      console.log(row)
      this.dmObject = Object.assign({}, row)
      this.dmObject.hspId = this.hspId
      this.ddialogVisible = true
      this.$nextTick(() => {
        this.$refs['dmObject'].clearValidate()
      })
    },
    // 删除角色
    ddeleteDepartment(role) {
      this.$confirm('此操作将永久删除该科室, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteDepartment', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getHospitalDepartmentList()
        } })
      })
    },
    // 批量删除角色
    ddeleteMulti() {
      const idsArr = []
      for (const row of this.dSelectedRows) {
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
      this.ddeleteDepartment({ id: idsArr.join(',') })
    },
    // 提交表单
    dsubmitForm() {
      this.$refs['dmObject'].validate((valid) => {
        if (valid) {
          if (this.dmObject.id) {
            this.$store.dispatch('editDepartment', { data: this.dmObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.ddialogVisible = false
              this.getHospitalDepartmentList()
            } })
          } else {
            this.dmObject.hspId = this.hspId
            this.$store.dispatch('addDepartment', { data: this.dmObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.ddialogVisible = false
              this.getHospitalDepartmentList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 设置管理员
    addManager() {
      if (!this.selectedRows.length) {
        this.$message({
          type: 'warning',
          message: '请先选择操作项',
          duration: 3 * 1000
        })
        return false
      }
      if (this.selectedRows.length !== 1) {
        this.$message({
          type: 'warning',
          message: '只能选择一个操作项',
          duration: 3 * 1000
        })
        return false
      }
      if (this.selectedRows[0].orgId) {
        this.$message({
          type: 'warning',
          message: '该医院已经设置了管理员',
          duration: 3 * 1000
        })
        return false
      }
      this.mManager = Object.assign({}, this.selectedRows[0])
      this.mManager.pharmacyId = this.mManager.id
      this.managerDialogVisible = true
      this.$nextTick(() => {
        this.$refs['mManager'].clearValidate()
      })
    },
    submitManagerForm() {
      this.$store.dispatch('setHospitalAdmin', { data: this.mManager, callback: () => {
        this.$message({
          message: '设置成功',
          type: 'success',
          duration: 3 * 1000
        })
        this.managerDialogVisible = false
        this.getHospitalList()
      } })
    }
  }
}
</script>
