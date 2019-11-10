<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.creatorName" class="filter-item" placeholder="操作人">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.operateType" placeholder="操作类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in operateTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button class="filter-item" @click="getBindRecordsList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="bindRecords.records"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column prop="creator" label="操作人"></el-table-column>
      <el-table-column width="152" prop="uploadTime" label="上传时间">
        <template slot-scope="scope">
          {{scope.row.uploadTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="operateType" label="操作类型"></el-table-column>
      <el-table-column prop="totalNum" label="操作总条数"></el-table-column>
      <el-table-column prop="successNum" label="成功数"></el-table-column>
      <el-table-column prop="failNum" label="失败数"></el-table-column>
      <el-table-column prop="operateResult" label="操作结果">
        <template slot-scope="scope">
          {{scope.row.operateResult | yesOrNo}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="197">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="down(scope.row)">下载上传文件下载错误记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="bindRecords.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      listLoading: false,
      param: { page: 1, limit: 10, searchCondition: { operateType: '2' }},
      daterange: null
    }
  },
  filters: {
  },
  created() {
    this.getBindRecordsList()
    this.getOperateTypeList()
  },
  computed: mapState({
    bindRecords: state => state.sysFileUploadRecord.bindRecords,
    operateTypes: state => state.sysFileUploadRecord.operateTypes
  }),
  methods: {
    getBindRecordsList() {
      if (this.daterange) {
        this.param.searchCondition['uploadTimeStart'] = moment(this.daterange[0]).format('YYYY-MM-DD')
        this.param.searchCondition['uploadTimeEnd'] = moment(this.daterange[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getBindRecordsList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getOperateTypeList() {
      this.$store.dispatch('getOperateTypeList')
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.daterange = null
      this.getBindRecordsList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getBindRecordsList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getBindRecordsList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    }
  }
}
</script>
