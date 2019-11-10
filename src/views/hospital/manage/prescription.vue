<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="10">
        <h3>处方笺信息</h3>
        <el-form class="cf-info el-row" ref="form" :rules="rules" :model="mObject.prescription">
          <div class="f-item">
            <el-form-item label="处方编号" prop="code">
              <el-input v-model="mObject.prescription.code"></el-input>
            </el-form-item>
          </div>
          <div class="f-item">
            <el-form-item label="处方类型" prop="prescriptionTypeCode">
              <el-input v-model="mObject.prescription.prescriptionTypeCode" placeholder="普通门诊处方" disabled></el-input>
              <!--<el-select style="width: 100%" v-model="mObject.prescription.prescriptionTypeCode" placeholder="请选择处方类型">-->
              <!--<el-option label="普通门诊处方" value="NOMAL_PRESCRIPTION"></el-option>-->
              <!--<el-option label="专家门诊处方" value="EXPERT_PRESCRIPTION"></el-option>-->
              <!--<el-option label="专科门诊处方" value="OUTPATIENT_PRESCRIPTION"></el-option>-->
              <!--</el-select>-->
            </el-form-item>
          </div>
          <div class="f-item">
            <el-form-item label="患者姓名" prop="name">
              <el-input v-model="mObject.prescription.name"></el-input>
            </el-form-item>
          </div>
          <div class="f-item">
            <el-form-item label="性别" prop="sexCode">
              <el-input v-model="mObject.prescriptionPatient.sexCode" placeholder="男" disabled></el-input>
            </el-form-item>
          </div>
          <div class="f-item">
            <el-form-item label="出生日期">
              <el-date-picker
                style="width: 100%"
                v-model="mObject.prescriptionPatient.birth"
                type="date"
                placeholder="选择出生日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="f-item">
            <el-form-item label="手机号" prop="tel">
              <el-input v-model="mObject.prescription.tel" autocomplete="on"></el-input>
            </el-form-item>
          </div>
          <div class="f-item f-item1">
            <el-form-item label="就诊卡号">
              <el-input-number v-model="mObject.prescriptionPatient.visitCard" :min="0" :controls="false"
                               controls-position="left" disabled></el-input-number>
              <!--<el-input v-model.number="mObject.prescriptionPatient.visitCard" type="number"></el-input>-->
            </el-form-item>
          </div>
          <div class="f-item f-item1">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="mObject.prescriptionPatient.idCard" disabled></el-input>
            </el-form-item>
          </div>
          <div class="f-item f-item1">
            <el-form-item label="病情诊断">
              <el-input v-model="mObject.prescription.tentativeDiagnosis" type="textarea"></el-input>
            </el-form-item>
          </div>
          <div class="f-item f-item1">
            <el-form-item label="诊查费（元）">
              <!--<el-input v-model.number="mObject.prescription.diagnosticAmount" type="number"></el-input>-->
              <el-input-number v-model="mObject.prescription.diagnosticAmount" :min="0" :controls="false"
                               controls-position="left"></el-input-number>
            </el-form-item>
          </div>
        </el-form>
        <h4>Rp:</h4>
        <div>
          <el-table
            @selection-change="handleSelectionChange"
            :data="mObject.prescriptionItemList"
            border
            style="width: 100%">
            <el-table-column prop="goodsBarcode" label="药品编码"></el-table-column>
            <el-table-column prop="name" label="药品名称"></el-table-column>
            <el-table-column prop="specifications" label="规格">
            </el-table-column>
            <el-table-column prop="numTotal" label="总量">
              <template slot-scope="scope">
                <!--<el-button type="text" @click="showPop(scope.row, 'numTotal')">{{ scope.row.numTotal }}</el-button>-->
                <el-popover
                  placement="top"
                  width="300"
                  v-model="scope.row.numTotalvisible"
                >
                  <el-form class="pop-form" :inline="true">
                    <el-input class="input" v-model="scope.row.numTotal"></el-input>
                    <el-button class="btn" @click="savePop(scope.row, 'numTotal')" size="mini" type="primary">保存
                    </el-button>
                    <el-button class="btn" @click="hidePop(scope.row, 'numTotal')" size="mini">取消</el-button>
                  </el-form>
                  <span class="show-text" @click="showPop(scope.row, 'numTotal')" slot="reference">{{ scope.row.numTotal }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="300"
                  v-model="scope.row.unitvisible">
                  <el-form class="pop-form" :inline="true">
                    <el-input class="input" v-model="scope.row.unit"></el-input>
                    <el-button class="btn" @click="savePop(scope.row, 'unit')" size="mini" type="primary">保存</el-button>
                    <el-button class="btn" @click="hidePop(scope.row, 'unit')" size="mini">取消</el-button>
                  </el-form>
                  <span class="show-text" @click="showPop(scope.row, 'unit')"
                        slot="reference">{{ scope.row.unit }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="总价">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="300"
                  v-model="scope.row.pricevisible">
                  <el-form class="pop-form" :inline="true">
                    <el-input class="input" v-model="scope.row.price"></el-input>
                    <el-button class="btn" @click="savePop(scope.row, 'price')" size="mini" type="primary">保存
                    </el-button>
                    <el-button class="btn" @click="hidePop(scope.row, 'price')" size="mini">取消</el-button>
                  </el-form>
                  <span class="show-text" @click="showPop(scope.row, 'price')"
                        slot="reference">{{ scope.row.price }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="usage" label="用法">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="300"
                  v-model="scope.row.usagevisible">
                  <el-form class="pop-form" :inline="true">
                    <el-input class="input" v-model="scope.row.usage"></el-input>
                    <el-button class="btn" @click="savePop(scope.row, 'usage')" size="mini" type="primary">保存
                    </el-button>
                    <el-button class="btn" @click="hidePop(scope.rowoperResult, 'usage')" size="mini">取消</el-button>
                  </el-form>
                  <span class="show-text" @click="showPop(scope.row, 'usage')"
                        slot="reference">{{ scope.row.usage }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="frequency" label="频率">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="300"
                  v-model="scope.row.frequencyvisible">
                  <el-form class="pop-form" :inline="true">
                    <el-input class="input" v-model="scope.row.frequency"></el-input>
                    <el-button class="btn" @click="savePop(scope.row, 'frequency')" size="mini" type="primary">保存
                    </el-button>
                    <el-button class="btn" @click="hidePop(scope.row, 'frequency')" size="mini">取消</el-button>
                  </el-form>
                  <span class="show-text" @click="showPop(scope.row, 'frequency')" slot="reference">{{ scope.row.frequency }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="用量">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="300"
                  v-model="scope.row.numvisible">
                  <el-form class="pop-form" :inline="true">
                    <el-input class="input" v-model="scope.row.num"></el-input>
                    <el-button class="btn" @click="savePop(scope.row, 'num')" size="mini" type="primary">保存</el-button>
                    <el-button class="btn" @click="hidePop(scope.row, 'num')" size="mini">取消</el-button>
                  </el-form>
                  <span class="show-text" @click="showPop(scope.row, 'num')" slot="reference">{{ scope.row.num }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger" @click="removeItem(scope.$index)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="filter-container" style="margin-top: 20px; text-align: right;">
          <el-button class="filter-item" @click="submitPrescription()" type="primary">提 交</el-button>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="filter-container">
          <el-select style="width:300px;" v-model="param.searchCondition.hspName" placeholder="华中科技大学同济医学院附属同济医院"
                     filterable
                     remote
                     :remote-method="getHospitalList" :loading="hspLoading" disabled>
            <el-option
              v-for="item in hospitals.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input style="width:200px;" class="input" v-model="param.searchCondition.itemName"
                    placeholder="药品名称"></el-input>
          <el-button class="filter-item" @click="getHspSkuRelList()" type="primary" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
        </div>
        <el-table
          @selection-change="handleSelectionChange"
          :data="hspSkuRels.data"
          v-loading="listLoading"
          border
          style="width: 100%">
          <el-table-column fixed label="操作" width="75">
            <template slot-scope="scope">
              <el-button type="primary" @click="chooseItem(scope.row)" size="mini">选择</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="itemSkuBaseInfoVO.itemName" width="150" label="药品名称"></el-table-column>
          <el-table-column prop="itemSkuBaseInfoVO.commonName" label="通用名称"></el-table-column>
          <el-table-column prop="itemSkuBaseInfoVO.manufacturer" width="150" label="厂商"></el-table-column>
          <el-table-column prop="hspSkuSpec" width="100" label="规格"></el-table-column>
          <el-table-column prop="hspSkuUnit" width="50" label="单位"></el-table-column>
          <el-table-column prop="itemSkuBaseInfoVO.marketPrice" width="100" label="单价"></el-table-column>
          <el-table-column prop="itemSkuBaseInfoVO.dosageForms" width="100" label="剂型"></el-table-column>
          <el-table-column prop="itemSkuBaseInfoVO.itemDrugBaseId" width="80" label="药品ID"></el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="param.page" :page-sizes="[5, 10, 20, 30]" :page-size="param.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="hspSkuRels.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
  h3 {
    font-size: 18px;
    text-align: center;
    padding-bottom: 15px;
    font-weight: normal;
    border-bottom: 1px dashed #ddd;
  }

  h4 {
    padding-top: 10px;
    border-top: 1px dashed #ddd;
  }
</style>
<style lang="scss">
  .cf-info {
    padding-right: 20px;
    .el-form-item__label {
      line-height: 24px;
    }
    .el-form-item {
      margin-bottom: 12px;
    }
    .f-item {
      width: 50%;
      float: left;
      padding-right: 10px;
      &.f-item1 {
        width: 100%;
      }
    }
  }

  .pop-form {
    .input {
      width: auto;
    }
    .el-input__inner {
      padding: 0 10px;
      width: 148px;
      height: 28px;
      line-height: 28px;
    }
  }

  .show-text {
    cursor: pointer;
    color: #0088cc;
    border-bottom: 1px dashed #0088cc;
  }

  .null {
    width: 50%;
  }

  .el-dialog__headerbtn {
    display: none;
  }

  .el-dialog__header {
    padding: 0;
  }

  .el-dialog__body {
    padding: 20px 20px;
  }

  .el-input-number {
    display: block;
    width: 100%;
  }

  .el-input-number .el-input__inner {
    padding: 0;
    text-align: left;
  }
</style>
<script>
  import { mapState } from 'vuex'
  import moment from 'moment'

  const validateIdCard = (rule, value, callback) => {
    const reg = /^\d{15}|\d{}18$/
    if (!reg.test(value)) {
      return '请输入正确的18位数身份证号码'
      // callback(new Error("请输入正确的身份证号码"));
    } else {
      return true
      // callback();
    }
  }
  export default {
    data() {
      const validateCellphone = (rule, value, callback) => {
        const reg = /^1(3|4|5|6|7|8)\d{9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
      const validateCode = (rule, value, callback) => {
        const reg = /^[0-9]*$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的处方编号'))
        } else {
          callback()
        }
      }
      return {
        hspLoading: false,
        listLoading: false,
        bindsLoading: false,
        param: { page: 1, limit: 10, searchCondition: { hspId: '1111111111111111111', itemName: '感冒' }},
        mTitle: '',
        currentRow: {},
        unbindSelectedList: [],

        visible2: false,

        tacticsDialogVisible: false,

        tacticsForm: {},

        mObject: {
          prescription: {
            code: moment().format('HHmmss'), name: '张三',
            tentativeDiagnosis: '上呼吸道感染',
            diagnosticAmount: 5,
            prescriptionTypeCode: '普通门诊处方'
          },
          prescriptionItemList: [],
          prescriptionPatient: {
            sexCode: '男',
            birth: '1980-04-03',
            visitCard: '342212',
            idCard: '342127198004031515'
          }
        },
        rules: {
          code: [{ required: true, message: '请输入处方编号', trigger: 'blur' },
            { required: true, message: '请输入数字处方编号', trigger: 'blur', validator: validateCode }
          ],
          sexCode: [
            // { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          prescriptionTypeCode: [
            { required: true, message: '请选择处方类型', trigger: 'change' }
          ],
          name: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
          tel: [
            { required: true, message: '请输入正确的手机号', trigger: 'blur', validator: validateCellphone }
          ]
        },
        expands: []
      }
    },
    filters: {},
    created() {
      this.getHspSkuRelList()
      this.getHspSkuRelList()
    },
    computed: mapState({
      hspSkuRels: state => state.hospital.hspSkuRels,
      hospitals: state => state.hospital.hospitals
    }),
    methods: {
      getHspSkuRelList() {
        this.$store.dispatch('getHspSkuRelList', {
          params: this.param
        })
      },
      resetSearch() {
        this.param.searchCondition = { hspId: '1111111111111111111', itemName: '感冒'  }
        this.getHspSkuRelList()
      },
      getHospitalList(query) {
        this.$store.dispatch('clearHospitalList')
        if (query !== '') {
          this.hspLoading = true
          this.$store.dispatch('getHospitalList', {
            params: { page: 0, limit: 10, searchCondition: { name: query }},
            callback: () => {
              this.hspLoading = false
            }
          })
        }
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
      isInList(skuId) {
        let itemTemp
        for (const item of this.mObject.prescriptionItemList) {
          console.log(item.id)
          console.log(skuId)
          if (item.id === skuId) {
            itemTemp = item
            break
          }
        }
        return itemTemp
      },
      chooseItem(item) {
        const itemTemp = this.isInList(item.skuId)
        if (itemTemp) {
          itemTemp.numTotal += 1
        } else {
          this.mObject.prescriptionItemList.push({
            itemTinyRateId: item.itemTinyRateId,
            skuId: item.skuId,
            usage: '口服',
            frequency: '一日一次',
            num: '一次一片',
            reusage: '口服',
            usagevisible: false,
            refrequency: '一日一次',
            frequencyvisible: false,
            renum: '一次一片',
            numvisible: false,
            name: item.itemSkuBaseInfoVO.itemName,
            goodsBarcode: item.itemSkuBaseInfoVO.goodsBarcode,
            specifications: item.itemSkuBaseInfoVO.spec,
            hspSkuSpec: item.hspSkuSpec,
            price: item.itemSkuBaseInfoVO.marketPrice,
            reprice: item.itemSkuBaseInfoVO.marketPrice,
            numTotal: 1,
            renumTotal: 1,
            unit: item.hspSkuUnit,
            reunit: item.itemSkuBaseInfoVO.unit,
            numTotalvisible: false,
            unitvisible: false,
            pricevisible: false
          })
        }
      },
      showPop(row, key) {
        row[key + 'visible'] = true
        let flag = true
        this.$nextTick(() => {
          const element = document.querySelectorAll('body>.el-popover')
          for (let i = 0; i < element.length; i++) {
            if (flag && element[i].style.display != 'none') {
              flag = false
            } else if (!flag) {
              element[i].style.display = 'none'
            }
          }
        })
        // console.log(row);
      },
      hidePop(row, key) {
        row[key + 'visible'] = false
        row[key] = row['re' + key]
      },
      savePop(row, key) {
        row[key + 'visible'] = false
        row['re' + key] = row[key]
      },
      removeItem(index) {
        this.mObject.prescriptionItemList.splice(index, 1)
      },
      submitPrescription() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            const card = validateIdCard('', this.mObject.prescriptionPatient.idCard)
            if (card !== true) {
              return this.$message.error(card)
            }

            this.mObject.prescriptionPatient.name = this.mObject.prescription.name
            this.mObject.prescriptionPatient.tel = this.mObject.prescription.tel

            const itemArr = []
            if (!this.mObject.prescriptionItemList.length) {
              this.$message({
                message: '请先选择药品',
                type: 'error',
                duration: 3 * 1000
              })
              return false
            } else {
              for (const item of this.mObject.prescriptionItemList) {
                itemArr.push({
                  frequency: item.frequency,
                  num: item.num,
                  numTotal: item.numTotal,
                  price: item.price,
                  unit: item.unit,
                  skuId: item.skuId,
                  itemTinyRateId: item.itemTinyRateId,
                  usage: item.usage,
                  specifications: item.specifications,
                  hspSkuSpec: item.hspSkuSpec
                })
              }
            }

            const obj = {
              prescription: {
                code: this.mObject.prescription.code,
                hspId: '1111111111111111111',
                prescriptionTypeCode: 'NOMAL_PRESCRIPTION',
                diagnosticAmount: this.mObject.prescription.diagnosticAmount,
                tentativeDiagnosis: this.mObject.prescription.tentativeDiagnosis
              },
              prescriptionItemList: itemArr,
              prescriptionPatient: {
                birth: this.mObject.prescriptionPatient.birth,
                idCard: this.mObject.prescriptionPatient.idCard,
                visitCard: this.mObject.prescriptionPatient.visitCard,
                name: this.mObject.prescriptionPatient.name,
                sexCode: '1',
                tel: this.mObject.prescriptionPatient.tel
              }
            }
            this.$store.dispatch('addHospitalPrescription', {
              data: obj,
              callback: (response) => {
                if (response.success) {
                  this.$message({
                    message: response.msg,
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.mObject.prescription.code = moment().format('HHmmss')
                } else {
                  this.$message.error(response.msg)
                }
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
