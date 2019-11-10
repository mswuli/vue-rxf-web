<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="药店名称">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.tel" class="filter-item" placeholder="联系电话">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.typeCode" placeholder="药店类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in pharmacyTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-select style="width:120px;" v-model="param.searchCondition.verifyStatusCode" placeholder="审核状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in pharmacyStatus"
          :key="item.id"
          :label="item.name"
          :value="item.code">
          </el-option>
      </el-select>
      <el-button class="filter-item" @click="getPharmacyList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
      <el-button type="primary" icon="el-icon-setting" @click="addManager()">设置管理员</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="pharmacys.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="name" width="150" label="药店名称"></el-table-column>
      <el-table-column prop="inUse" label="启用状态">
        <template slot-scope="scope">
          {{scope.row.inUse | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column prop="haveAccount" width="150" label="管理员">
        <template slot-scope="scope">
          <span v-if="scope.row.haveAccount">已设置</span>
          <span v-else>未设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" width="150" label="药店类型"></el-table-column>
      <el-table-column width="150" label="营业时间">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime }}</span> - <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" label="详细地址">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="leader" label="法人"></el-table-column>
      <el-table-column prop="leaderTel" label="联系电话"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.inUse" type="danger" size="mini" @click="stopUse(scope.row)">停用</el-button>
          <el-button v-else type="primary" size="mini" @click="startUse(scope.row)">启用</el-button>
          <el-button type="danger" size="mini" @click="deletePharmacy(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="pharmacys.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="药店名称" prop="name">
          <el-input v-model="mObject.name" placeholder="需要与营业执照上的名字一致"></el-input>
        </el-form-item>
        <el-form-item label="药店简称" prop="shortName">
          <el-input v-model="mObject.shortName" placeholder="药店简称"></el-input>
        </el-form-item>
        <el-form-item label="药店类型" prop="typeCode">
          <el-select v-model="mObject.typeCode" placeholder="药店类型">
            <el-option
              v-for="item in pharmacyTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业时间" prop="beginTime">
          <el-time-select style="width: 120px"
            placeholder="起始时间"
            v-model="mObject.beginTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00'
            }">
          </el-time-select>
          <el-time-select style="width: 120px"
            placeholder="结束时间"
            v-model="mObject.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00',
              minTime: mObject.beginTime
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="inUse">
          <el-select v-model="mObject.inUse" placeholder="请选择启用状态">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="停用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="verifyStatusCode">
          <el-select v-model="mObject.verifyStatusCode" placeholder="请选择审核状态">
            <el-option
              v-for="item in pharmacyStatus"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务星级" prop="level">
          <el-rate
            style="margin-top: 10px"
            v-model="mObject.level"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
        </el-form-item>
        <el-form-item label="省市区" prop="province">
          <a-map :address-obj.sync="mObject" v-if="dialogVisible"></a-map>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <a-map-addrees :address-obj.sync="mObject" v-if="dialogVisible"></a-map-addrees>
        </el-form-item>
        <el-form-item label="药品经营许可证" prop="dblPic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadDblPicSuccess"
            accept="image/*">
            <img v-if="mObject.dblPic" :src="mObject.dblPic" class="dblPic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="GSP证书" prop="gspPic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadGspPicSuccess"
            accept="image/*">
            <img v-if="mObject.gspPic" :src="mObject.gspPic" class="gspPic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="药店LOGO" prop="logoPic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadLogoPicSuccess"
            accept="image/*">
            <img v-if="mObject.logoPic" :src="mObject.logoPic" class="logoPic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="药店主图" prop="masterPic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadMasterPicSuccess"
            accept="image/*">
            <img v-if="mObject.masterPic" :src="mObject.masterPic" class="masterPic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
.logoPic {
  width: 120px;
  height: 120px;
  display: block;
}
.masterPic {
  width: 120px;
  height: 120px;
  display: block;
}
.dblPic {
  width: 120px;
  height: 120px;
  display: block;
}
.gspPic {
  width: 120px;
  height: 120px;
  display: block;
}
</style>


<script>
import { mapState } from 'vuex'
import { getToken } from '@/utils/auth'
import { getConstants } from '@/utils/constants'
import AMap from '@/components/AMap'
import AMapAddrees from '@/components/AMap/address'

export default {
  components: { AMap, AMapAddrees },
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: {}},
      dialogVisible: false,
      mObject: {},
      mTitle: '',
      attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
      attachmentUrl: getConstants().ATTACHMENT_URL,

      managerDialogVisible: false,
      mManager: {},
      selectedRows: [],

      rules: {
        name: [
          { required: true, message: '请输入药店名称', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '请输入药店简称', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择省市区', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        // businessLicenseNumber: [
        //   { required: true, message: '请输入药店营业执照号码', trigger: 'blur' }
        // ],
        beginTime: [
          { required: true, message: '请选择营业开始时间', trigger: 'blur' }
        ],
        endTime:[
          { required: true, message: '请选择营业结束时间', trigger: 'blur' }
        ],
        typeCode: [
          { required: true, message: '请选择药店类型', trigger: 'blur' }
        ],
        inUse: [
          { required: true, message: '请选择启用状态', trigger: 'blur' }
        ],
        verifyStatusCode: [
          { required: true, message: '请选择审核状态', trigger: 'blur' }
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
          { required: true, message: '请输入登录用户名', trigger: 'blur' }
        ],
        accountPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },

      upLoadData: {
        file_id: 0
      },
      headersData: { Authorization: getToken() }
    }
  },
  filters: {
  },
  created() {
    this.getPharmacyList()
    this.getPharmacyTypeList()
    this.getPharmacyStatusList()
  },
  computed: mapState({
    pharmacys: state => state.pharmacy.pharmacys,
    pharmacyTypes: state => state.pharmacy.pharmacyTypes,
    pharmacyStatus: state => state.pharmacy.pharmacyStatus
  }),
  methods: {
    getPharmacyList() {
      this.listLoading = true
      this.$store.dispatch('getPharmacyList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getPharmacyTypeList() {
      this.$store.dispatch('getPharmacyTypeList')
    },
    getPharmacyStatusList() {
      this.$store.dispatch('getPharmacyStatusList')
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getPharmacyList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getPharmacyList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getPharmacyList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 停用
    stopUse(row) {
      this.$confirm('此操作将停用该药店, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.inUse = false
        this.$store.dispatch('editPharmacy', { data: row, callback: () => {
          this.$message({
            message: '停用成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.getPharmacyList()
        } })
      })
    },
    // 启用
    startUse(row) {
      this.$confirm('此操作将启用该药店, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.inUse = true
        this.$store.dispatch('editPharmacy', { data: row, callback: () => {
          this.$message({
            message: '启用成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.getPharmacyList()
        } })
      })
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '编辑'
      if (!row) {
        this.mTitle = '新增'
        row = {
          inUse: true,
          verifyStatusCode: '1',
          masterPic: '',
          logoPic: '',
          dblPic: '',
          gspPic: ''
        }
      }
      this.mObject = Object.assign({}, row)
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['mObject'].clearValidate()
      })
    },
    // 删除
    deletePharmacy(role) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deletePharmacy', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getPharmacyList()
        } })
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
      this.deletePharmacy({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editPharmacy', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getPharmacyList()
            } })
          } else {
            this.$store.dispatch('addPharmacy', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getPharmacyList()
            } })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    uploadLogoPicSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.logoPic = this.attachmentUrl + response.data
        console.log(this.mObject)
      }
    },
    uploadMasterPicSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.masterPic = this.attachmentUrl + response.data
      }
    },
    uploadDblPicSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.dblPic = this.attachmentUrl + response.data
      }
    },
    uploadGspPicSuccess(response, file, fileList) {
      if (response.success) {
        this.mObject.gspPic = this.attachmentUrl + response.data
      }
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
      if (this.selectedRows[0].haveAccount) {
        this.$message({
          type: 'warning',
          message: '该药店已经设置了管理员',
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
      this.$store.dispatch('setAdmin', { data: this.mManager, callback: () => {
        this.$message({
          message: '设置成功',
          type: 'success',
          duration: 3 * 1000
        })
        this.managerDialogVisible = false
        this.getPharmacyList()
      } })
    }
  }
}
</script>
