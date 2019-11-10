<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.mobile" class="filter-item" placeholder="电话">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.typeName" placeholder="类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in templateTypes.data"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-input style="width: 120px;" v-model="param.searchCondition.companyCode" class="filter-item" placeholder="短信平台">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.status" class="filter-item" placeholder="短信发送状态">
      </el-input>
      <el-button class="filter-item" @click="getSMSRecordList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <!--  <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>  -->
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="smsRecords.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <!--  <el-table-column type="selection" width="55"></el-table-column>  -->
        <el-table-column fixed prop="mobile" width="150" label="电话"></el-table-column>
        <el-table-column fixed prop="typeName" width="150" label="类型"></el-table-column>
        <el-table-column prop="companyCode" width="150" label="短信平台"></el-table-column>
        <el-table-column prop="status" width="150" label="短信发送状态"></el-table-column>
        <el-table-column prop="returnMsg" label="返回内容"></el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)">查看</el-button>
            <!--<el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>-->
            <!--<el-button type="danger" size="mini" @click="deleteSMSRecord(scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="smsRecords.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="电话" prop="mobile">
          <!--{{ mObject.mobile }}-->
          <el-input v-model="mObject.mobile" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="typeName">
          <el-select v-model="mObject.typeName" placeholder="请选择类型" :disabled="true">
            <el-option
              v-for="item in templateTypes.data"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!--{{ mObject.content }}-->
          <el-input type="textarea" autosize v-model="mObject.content" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="短信平台" prop="companyCode">
          <el-input v-model="mObject.companyCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="短信发送状态" prop="status">
          <el-input v-model="mObject.status" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="短信异常消息" prop="msg">
          <el-input v-model="mObject.msg" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="返回内容" prop="returnMsg">
          <el-input v-model="mObject.returnMsg" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="返回id" prop="smsId">
          <el-input v-model="mObject.smsId" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
      -->
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
      mObject: {
      },
      mTitle: '',

      rules: {
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        typeName: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        companyCode: [
          { required: true, message: '请输入短信平台', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入短信发送状态', trigger: 'blur' }
        ],
        msg: [
          { required: true, message: '请输入短信异常消息', trigger: 'blur' }
        ],
        returnMsg: [
          { required: true, message: '请输入返回内容', trigger: 'blur' }
        ],
        smsId: [
          { required: true, message: '请输入返回id', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
  },
  created() {
    this.getSMSRecordList()
    this.getTemplateTypeList()
  },
  computed: mapState({
    smsRecords: state => state.smsRecord.smsRecords,
    templateTypes: state => state.smsTemplate.templateTypes
  }),
  methods: {
    getSMSRecordList() {
      this.listLoading = true
      this.$store.dispatch('getSMSRecordList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getTemplateTypeList() {
      this.$store.dispatch('getTemplateTypeList', { params: this.param })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getSMSRecordList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getSMSRecordList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getSMSRecordList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 编辑/新增
    edit(row) {
      this.mTitle = '详情'
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
    deleteSMSRecord(role) {
      this.$confirm('此操作将永久删除该短信, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteSMSRecord', { data: role, callback: () => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 3 * 1000
          })
          this.getSMSRecordList()
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
      this.deleteSMSRecord({ id: idsArr.join(',') })
    },
    // 提交表单
    submitForm() {
      this.$refs['mObject'].validate((valid) => {
        if (valid) {
          console.log(this.mObject)
          if (this.mObject.id) {
            this.$store.dispatch('editSMSRecord', { data: this.mObject, callback: () => {
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSMSRecordList()
            } })
          } else {
            this.$store.dispatch('addSMSRecord', { data: this.mObject, callback: () => {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 3 * 1000
              })
              this.dialogVisible = false
              this.getSMSRecordList()
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
