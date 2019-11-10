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
      <el-select style="width:120px;" v-model="param.searchCondition.type" placeholder="医院类型">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in hospitalTypes"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button class="filter-item" @click="getAiHspList()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="aiHsps.data"
      v-loading="listLoading"
      border
      row-key="id"
      :expand-row-keys="expands"
      @row-click="rowClick"
      @expand-change="handleExpandChange"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <table class="has-gutter" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-top: 1px solid #ebeef5; border-left: 1px solid #ebeef5;">
            <thead>
              <th><div class="cell">药店名称</div></th>
              <th><div class="cell">药店类型</div></th>
              <th><div class="cell">详细地址</div></th>
              <th><div class="cell">法人</div></th>
              <th><div class="cell">联系电话</div></th>
              <th style="width: 72px;"><div class="cell">操作</div></th>
            </thead>
            <tbody>
              <tr v-for="b in binds.data" v-bind:key="b.id">
                <td><div class="cell">{{ b.name }}</div></td>
                <td><div class="cell">{{ b.typeName }}</div></td>
                <td><div class="cell" style="width: 200px;">{{ b.province }}{{ b.city }}{{ b.area }}{{ b.address }}</div></td>
                <td><div class="cell">{{ b.leader }}</div></td>
                <td><div class="cell">{{ b.tel }}</div></td>
                <td>
                  <div class="cell" style="width: 168px;">
                    <el-button type="primary" size="mini" @click="znInfo(b)">智能信息</el-button>
                    <el-button type="danger" size="mini" @click="deleteBind(b)">解约</el-button>
                  </div>
                </td>
              </tr>
              <tr v-if="!binds.data || !binds.data.length"><td colspan="6" style="text-align: center;">暂无数据</td></tr>
            </tbody>
          </table>
        </template>
      </el-table-column>
      <el-table-column prop="name" width="150" label="医院名称"></el-table-column>
      <el-table-column prop="typeName" width="150" label="医院类型"></el-table-column>
      <el-table-column prop="province" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" width="150" label="电话"></el-table-column>
      <el-table-column width="152" prop="createTime" label="创办时间">
        <template slot-scope="scope">
          {{scope.row.createTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="setPharmacy(scope.row)">服务药店</el-button>
          <el-button type="danger" size="mini" @click="setRules(scope.row)">智能规则</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[5, 10, 20, 30]" :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="aiHsps.total">
      </el-pagination>
    </div>

    <el-dialog
      title="选择服务药店"
      :close-on-click-modal=false
      :visible.sync="unbindDialogVisible"
      width="90%">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="tit">已选择药店列表：</div>
          <div class="con">
            <div v-for="bind in unbindSelectedList" v-bind:key="bind.id" class="item">{{ bind.name }} <i @click="removeSelect(bind)" class="el-icon-close"></i></div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="filter-container">
            <el-input style="width: 200px;" v-model="unbindParam.searchCondition.name" class="filter-item" placeholder="药店名称">
            </el-input>
            <el-button class="filter-item" @click="getUnBinds()" type="primary" icon="el-icon-search">搜索</el-button>
            <el-button class="filter-item" @click="resetUnbindSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
          </div>
          <el-table
            @selection-change="handleUnbindSelectionChange"
            :data="unbinds.data"
            v-loading="bindsLoading"
            border
            ref="unbindTable"
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="药店名称"></el-table-column>
            <el-table-column prop="typeName" width="80" label="药店类型"></el-table-column>
            <el-table-column prop="province" width="220" label="详细地址">
              <template slot-scope="scope">
                <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="leader" width="80" label="法人"></el-table-column>
            <el-table-column prop="tel" width="120" label="联系电话"></el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleUnbindSizeChange" @current-change="handleUnbindCurrentChange"
                          :current-page="unbindParam.page" :page-sizes="[5, 10, 20, 30]" :page-size="unbindParam.limit"
                          layout="total, sizes, prev, pager, next, jumper" :total="unbinds.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="unbindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="unbindSubmitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="智能药店策略"
      :close-on-click-modal=false
      :visible.sync="tacticsDialogVisible"
      >
      <div id="tacticList">
        <div v-for="t in tactics.data" v-bind:key="t.id" class="tactic-item" :class="t.inUse ? 'use' : ''">
          <div class="t">{{ t.tacticsName }}</div>
          <div class="d">{{ t.createTime | dateFormat }}</div>
          <el-button v-if="t.inUse" class="b" type="danger" size="mini" @click="t.inUse = !t.inUse">禁用</el-button>
          <el-button v-else class="b" type="primary" size="mini" @click="t.inUse = !t.inUse">启用</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tacticsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="tacticsSubmitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="智能药店信息"
      :close-on-click-modal=false
      :visible.sync="znDialogVisible">
      <el-form :model="mObject" :rules="rules" ref="aiPharmacyRel" label-width="120px" style="width: 70%">
        <el-form-item label="路线规划" prop="line">
          <el-input v-model="aiPharmacyRel.line"></el-input>
        </el-form-item>
        <el-form-item label="步行距离" prop="distance">
          <el-input v-model="aiPharmacyRel.distance"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="znDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitZnForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.con {
  padding: 3px 0;
}
.item {
  padding: 3px 20px 3px 0;
  position: relative;
  .el-icon-close {
    display: none;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -7px;
    cursor: pointer;
    &:hover {
      background: rgba(0,0,0,0.8);
      border-radius: 50%;
      color: #fff;
    }
  }
  &:hover .el-icon-close{
    display: block;
  }
}
.tactic-item {
  background: #FAFAFB;
  border: 1px solid #e7eaec;
  border-left: 3px solid #ed5565;
  margin: 0px 0 10px 0;
  padding: 10px;
  border-radius: 2px;
  position: relative;
  &.use {
    border-left: 3px solid #3a8ee6;
  }
  &:hover {
    cursor: move;
    background: #fff;
  }
  .d {
    font-size: 12px;
    color: #999;
  }
  .b {
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -14px;
  }
}
</style>

<script>
import { mapState } from 'vuex'
import Sortable from 'sortablejs'

export default {
  data() {
    return {
      hspLoading: false,
      listLoading: false,
      bindsLoading: false,
      param: { page: 1, limit: 5, searchCondition: {}},
      bindParam: { order: 'asc' },
      unbindParam: { page: 1, limit: 5, searchCondition: {}},
      unbindDialogVisible: false,
      mTitle: '',
      currentRow: {},
      unbindSelectedList: [],

      tacticsDialogVisible: false,

      znDialogVisible: false,

      tacticsForm: {},

      mObject: {
      },
      rules: {
      },
      expands: []
    }
  },
  filters: {
  },
  created() {
    this.getAiHspList()
    this.getHospitalTypeList()
  },
  computed: mapState({
    aiHsps: state => state.hspAiPharmacy.aiHsps,
    aiPharmacyRel: state => state.hspAiPharmacy.aiPharmacyRel,
    hospitals: state => state.hospital.hospitals,
    hospitalTypes: state => state.hospital.hospitalTypes,
    binds: state => state.hspAiPharmacy.binds,
    unbinds: state => state.hspAiPharmacy.unbinds,
    tactics: state => state.hspAiPharmacy.tactics
  }),
  methods: {
    getAiHspList() {
      this.listLoading = true
      this.$store.dispatch('getAiHspList', { params: this.param, callback: () => {
        this.listLoading = false
      } })
    },
    getHospitalTypeList() {
      this.$store.dispatch('getHospitalTypeList')
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
    getBinds() {
      this.listLoading = true
      this.$store.dispatch('getBindList', { params: this.bindParam, callback: () => {
        this.listLoading = false
      } })
    },
    getUnBinds() {
      this.bindsLoading = true
      this.$store.dispatch('getUnBindList', { data: { params: this.unbindParam }, callback: () => {
        this.bindsLoading = false
        this.$nextTick(() => {
          setTimeout(() => {
            if (this.unbindSelectedList && this.unbindSelectedList.length) {
              this.unbindSelectedList.forEach(row => {
                this.unbinds.data.forEach(item => {
                  if (row.id === item.id) {
                    this.$refs.unbindTable.toggleRowSelection(item, true)
                  }
                })
              })
            }
          }, 500)
        })
      } })
    },
    resetSearch() {
      this.param.searchCondition = {}
      this.getAiHspList()
    },
    handleSizeChange(size) {
      this.param.limit = size
      this.getAiHspList()
    },
    handleCurrentChange(page) {
      this.param.page = page
      this.getAiHspList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    resetUnbindSearch() {
      this.unbindParam.page = 1
      this.unbindParam.limit = 5
      this.unbindParam.searchCondition = {}
      this.getUnBinds()
    },
    handleUnbindSizeChange(size) {
      this.unbindParam.limit = size
      this.getUnBinds()
    },
    handleUnbindCurrentChange(page) {
      this.unbindParam.page = page
      this.getUnBinds()
    },
    removeSelect(row) {
      if (this.unbindSelectedList.length) {
        this.unbindSelectedList.forEach((item, index) => {
          if (item.id === row.id) {
            this.unbindSelectedList.splice(index, 1)
          }
        })
      }
      if (this.unbinds.data.length) {
        this.unbinds.data.forEach((item, index) => {
          if (item.id === row.id) {
            this.$refs.unbindTable.toggleRowSelection(row, false)
          }
        })
      }
    },
    handleUnbindSelectionChange(val) {
      const isInArray = (item, arr, attr) => {
        let isIn = false
        for (const a of arr) {
          if (a[attr] === item[attr]) {
            isIn = true
            break
          }
        }
        return isIn
      }
      this.$nextTick(() => {
        if (!this.unbindSelectedList.length) {
          this.unbindSelectedList = val
        } else {
          if (this.unbinds.data && this.unbinds.data.length) {
            const selectedArr = []
            for (const s of this.unbindSelectedList) {
              if (!isInArray(s, this.unbinds.data, 'id')) {
                selectedArr.push(s)
              }
            }
            this.unbindSelectedList = selectedArr
            if (val.length) {
              if (!this.unbindSelectedList.length) {
                this.unbindSelectedList = val
              } else {
                for (const v of val) {
                  if (!isInArray(v, this.unbindSelectedList, 'id')) {
                    this.unbindSelectedList.push(v)
                  }
                }
              }
            }
          }
        }
      })
    },
    handleExpandChange(row, expandedRows) {
      this.rowClick(row)
    },
    rowClick(row, event, column) {
      this.currentRow = row
      if (column && column.label === '操作') {
        return false
      }
      if (row.id !== this.expands[0]) {
        this.expands = [row.id]
        this.bindParam.id = row.id
        this.getBinds()
      } else {
        this.expands = []
      }
    },
    deleteBind(row) {
      this.$confirm('解约后【' + this.currentRow.name + '】的处方将无法流转至该药店，请谨慎操作！', '提示', {
        confirmButtonText: '解约',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteBind', { data: { hid: this.currentRow.id, pid: row.id }, callback: () => {
          this.$message({
            type: 'success',
            message: '解约成功!',
            duration: 3 * 1000
          })
          this.getBinds()
        } })
      })
    },
    znInfo(row) {
      this.znDialogVisible = true
      this.$store.dispatch('getAipharmacyRel', { hid: this.currentRow.id, pid: row.id })
    },
    submitZnForm(row) {
      this.znDialogVisible = true
      this.$store.dispatch('editAiPharmacyRel', this.aiPharmacyRel).then(response => {
        this.znDialogVisible = false
        this.$message({
          type: 'success',
          message: '更新成功!',
          duration: 3 * 1000
        })
      })
    },
    setPharmacy(row) {
      this.unbindSelectedList = []
      this.unbindDialogVisible = true
      this.unbindParam = { page: 1, limit: 5, searchCondition: {}}
      this.unbindParam.id = row.id
      this.getUnBinds()
    },
    unbindSubmitForm() {
      const bindIds = []
      if (this.unbindSelectedList.length) {
        for (const bind of this.unbindSelectedList) {
          bindIds.push(bind.id)
        }
      } else {
        this.$message({
          type: 'error',
          message: '请选择药店!',
          duration: 3 * 1000
        })
        return false
      }
      const hspAiPharmacyIdArrayStr = bindIds.join(',')
      this.$store.dispatch('editBind', { data: { id: this.unbindParam.id, hspAiPharmacyIdArrayStr: hspAiPharmacyIdArrayStr }, callback: () => {
        this.unbindDialogVisible = false
      } })
    },
    setRules(row) {
      this.tacticsForm.id = row.id
      this.tacticsDialogVisible = true
      this.$store.dispatch('getPharmacyTacticList', { data: { id: row.id }, callback: () => {
        this.$nextTick(() => {
          this.createSort()
        })
      } })
    },
    createSort() {
      const el = document.getElementById('tacticList')
      this.sortable = Sortable.create(el, {
        setData: dataTransfer => {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tactics.data.splice(evt.oldIndex, 1)[0]
          this.tactics.data.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    tacticsSubmitForm() {
      this.tacticsForm.list = []
      for (const d of this.tactics.data) {
        this.tacticsForm.list.push({
          hspId: d.hspId,
          inUse: d.inUse,
          tacticsId: d.tacticsId
        })
      }
      this.$store.dispatch('editTacticList', { data: this.tacticsForm, callback: () => {
        this.$message({
          type: 'success',
          message: '设置成功!',
          duration: 3 * 1000
        })
        this.tacticsDialogVisible = false
      } })
    }
  }
}
</script>
