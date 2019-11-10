<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 120px;" v-model="param.searchCondition.name" class="filter-item" placeholder="日志标题">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.uri" class="filter-item" placeholder="请求地址">
      </el-input>
      <el-input style="width: 120px;" v-model="param.searchCondition.operaAdmin" class="filter-item" placeholder="操作用户">
      </el-input>
      <el-select style="width:120px;" v-model="param.searchCondition.methodCode" placeholder="请求方式">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in types"
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
      <el-button class="filter-item" @click="getSysLogsList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="sysLogs.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column prop="name" label="日志标题"></el-table-column>
      <el-table-column prop="uri" label="请求地址"></el-table-column>
      <el-table-column prop="methodName" label="请求方式"></el-table-column>
      <el-table-column prop="typeName" label="请求类型"></el-table-column>
      <el-table-column prop="httpStatusCode" label="状态码"></el-table-column>
      <el-table-column prop="timeConsuming" label="请求耗时"></el-table-column>
      <el-table-column prop="operaAdmin" label="操作用户"></el-table-column>
      <el-table-column width="300" prop="paramData" label="提交的数据"></el-table-column>
      <el-table-column width="300" label="返回数据"></el-table-column>
      <el-table-column width="152" prop="returnTime" label="请求返回时间">
        <template slot-scope="scope">
          {{scope.row.returnTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="clientIp" label="客户端请求IP"></el-table-column>
      <el-table-column prop="sessionId" label="唯一标识"></el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
        layout="total, sizes, prev, pager, next, jumper" :total="sysLogs.total">
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
      param: { page: 1, limit: 10, searchCondition: {}},
      daterange: null
    }
  },
  filters: {
  },
  created() {
    this.getSysLogsList()
    this.getTypeList()
  },
  computed: mapState({
    sysLogs: state => state.sysLogs.sysLogs,
    types: state => state.sysLogs.types
  }),
  methods: {
    getSysLogsList() {
      if (this.daterange) {
        this.param.searchCondition['returnTimeStart'] = moment(this.daterange[0]).format('YYYY-MM-DD')
        this.param.searchCondition['returnTimeEnd'] = moment(this.daterange[1]).format('YYYY-MM-DD')
      }
      this.listLoading = true
      this.$store.dispatch('getSysLogsList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getTypeList() {
      this.$store.dispatch('getSysLogsTypeList', { params: this.param })
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
