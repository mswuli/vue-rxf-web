<template>
  <div class="app-container">
    <div class="top">
      <h1>导诊台</h1>
    </div>
    <div class="filter-container">
      就诊卡号：<el-input style="width: 200px;" v-model="code" class="filter-item" placeholder="请输入就诊卡号">
      </el-input>
      <el-button class="filter-item" @click="getPrescriptionInfoList()" type="primary" icon="el-icon-search">提取</el-button>
    </div>
    <div v-if="prescriptionInfos.data == null || prescriptionInfos.data == ''">
      </div>
    <div v-else>
      <el-table
        ref="table"
        @selection-change="handleSelectionChange"
        :data="prescriptionInfos.data"
        v-loading="listLoading"
        border
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="处方信息">
          <template slot-scope="scope">
            <table style="width: 100%">
              <tr>
                <td>姓名：{{ scope.row.patientName }}</td>
                <td>性别：{{ scope.row.patientSexName }}</td>
                <td>年龄：{{ scope.row.patientAge }}</td>
                <td>身份证号：{{ scope.row.patientIdCard }}</td>
              </tr>
              <tr>
                <td>就诊卡号：{{ scope.row.patientVisitCard }}</td>
                <td>医院：{{ scope.row.hspName }}</td>
                <td>科室：{{ scope.row.departName }}</td>
              </tr>
              <tr>
                <td>医生姓名：{{ scope.row.doctorName }}</td>
                <td>处方类型：{{ scope.row.prescriptionTypeName }}</td>
                <td>处方编号：{{ scope.row.prescriptionCode }}</td>
                <td>处方日期：{{ scope.row.prescriptionTime | dateFormat }}</td>
              </tr>
            </table>
            <div>病情诊断：{{ scope.row.tentativeDiagnosis }}</div>
            <div align="center">提取码：<span style="color: red">{{ scope.row.pickCode }}</span></div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="bottom" align="center">
        <el-button type="primary" @click="printPrescriptionInfo()" icon="el-icon-printer">打印</el-button>
      </div>
    </div>

    <el-dialog
      title="提示"
      :close-on-click-modal=false
      :close-on-press-escape = false
      :show-close = false
      :visible.sync="printDialogVisible">
      {{ printHint }}
      <div slot="footer" class="dialog-footer"  v-if="showFooter === true">
        <el-button type="primary" @click="resetData">返回首页</el-button>
        <el-button @click="closeDialog">停留当前页</el-button>
      </div>
    </el-dialog>

    <div v-if = "selectedRow != null" id="printDiv" ref="print">
      <div style="width: 50mm;">
        <div style="padding: 2mm 2mm 2mm 2mm; text-align: center">
          <div style="padding: 5px 0;font-size: 16px; margin-bottom: 2px;">{{ selectedRow.hspName }}</div>
          <div style="padding: 15px 0;" align="center">
            <span style="font-size: 8px;width: auto" align="left">提取码</span>
            <span style="font-size: 25px;color: red;position: relative;" align="center">{{ selectedRow.pickCode }}</span>
          </div>
        </div>
        <div style="padding: 2mm 0; border-top: 1px dashed #333;">
          <div style="line-height: 20px; font-size: 12px; color: #333;">&nbsp;&nbsp;&nbsp;&nbsp;{{ selectedRow.pharmacyInfo }}
          </div>
        </div>
        <div style="padding: 5px 0;">
          <div style="font-size: 12px; text-align: center">{{ selectedRow.prescriptionTime | dateFormat }}</div>
        </div>
        <div style="line-height: 8px; text-align: center;font-size: 12px; ">
          - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - - - - - - - - - - - - - - - - -
        </div>
        <div style="padding: 5mm 0;font-size:10px;color: #333;">
          此单据只可提取一次，遗失后请返回导医台重新办理。
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getLodop } from '@/utils/LodopFuncs'

export default {
  data() {
    return {
      code: '',
      prescriptionDetailLoading: false,
      printDialogVisible: false,
      dialogVisible: false,
      listLoading: false,
      selectedRows: [],
      selectedRow: null,
      printHint: '',
      showFooter: false
    }
  },
  filters: {
  },
  created() {
  },
  computed: mapState({
    prescriptionInfos: state => state.reception.prescriptionInfos
  }),
  methods: {
    resetSearch() {
      this.param.searchCondition = {}
      this.getPrescriptionInfoList()
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    getPrescriptionInfoList() {
      if (this.code == null || this.code == '') {
        this.$message({
          message: "就诊卡号不能为空",
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        this.listLoading = true
        this.$store.dispatch('getPrescriptionInfoList', { code: this.code, callback: () => {
          this.listLoading = false
          if(this.prescriptionInfos.data.length == 0){
            this.$message({
              type: 'error',
              message: '该就诊卡暂无处方信息!',
              duration: 3 * 1000
            })
          }
        } })
      }
    },

    printItem() {
      const LODOP = getLodop()
      const html = this.$refs.print.innerHTML
      LODOP.ADD_PRINT_HTM('', '', '100%', '100%', html)
      LODOP.SET_PRINTER_INDEX('小票打印机')
      LODOP.SET_PRINT_PAGESIZE(3, '58mm', '100%', '') // 这里3表示纵向打印且纸高“按内容的高度”；纸宽58mm；页底空白6mm
      LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Width:100%;Height:100%')
      LODOP.PRINT()
    },
    //打印
    async printPrescriptionInfo() {
      const idsArr = []
      let printNum = 0
      for (const row of this.selectedRows) {
        idsArr.push(row.id)
        printNum ++
        this.selectedRow = row
        this.printDialogVisible = true
        this.printHint = '正在打印中，当前打印第'+ printNum +'张，共'+ this.selectedRows.length +'页！'
        //延时0.5s
        await this.sleep(0.5*1000)
        this.printItem()
        //延时2s
        await this.sleep(2*1000)
      }

      if (idsArr.length == 0) {
        this.$message({
          type: 'error',
          message: '请先选择需要打印的项!',
          duration: 3 * 1000
        })
      } else {
        //提示是否继续停留
        this.showFooter = true
        for (let i = 5; i>0; i--){
          this.printHint = '打印完成，窗口将在'+ i +'秒后关闭!'
          await this.sleep(1000)
          if(this.printDialogVisible == false){
            break
          }else if(i == 1){
            this.resetData()
          }
        }
      }
    },
    sleep(d) {
      return new Promise((resolve) => setTimeout(resolve, d))
    },
    resetData() {
      this.closeDialog()
      this.code = ''
      this.$store.dispatch('clearPrescriptionInfoList')
    },
    closeDialog() {
      this.printDialogVisible = false
      this.selectedRows = []
      this.selectedRow = null
      this.printHint = ''
      this.showFooter = false
      this.$refs.table.clearSelection()
    }
  }
}
</script>
<style lang="scss" scoped>
  .top {
    height: 44px;
    line-height: 44px;
    background: #f3f3f3;
    padding: 0 15px;
    color: #333;
    margin-bottom: 30px;
  }
  .bottom {
    padding: 15px 15px;
  }
  #printDiv {
    background: #eaeaea;
    width: 58mm;
    display: none;
  }
</style>
