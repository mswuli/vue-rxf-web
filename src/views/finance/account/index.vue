<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select style="width:120px;" v-model="param.searchCondition.pharmacyId" filterable placeholder="药店">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in pharmacys.data"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input style="width: 120px;" v-model="param.searchCondition.amount" class="filter-item" placeholder="账户余额">
      </el-input>
      <el-select style="width: 120px;" v-model="param.searchCondition.currencyCode" placeholder="请选择币种">
        <el-option label="全部" :value="null"></el-option>
        <el-option
          v-for="item in dictionaryItems"
          :key="item.id"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select v-model="param.searchCondition.status" placeholder="请选择账户状态">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="启用" :value="true"></el-option>
        <el-option label="禁用" :value="false"></el-option>
      </el-select>
      <el-select v-model="param.searchCondition.withdrawable" placeholder="请选择是否可提现">
        <el-option label="全部" :value="null"></el-option>
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
      <el-button class="filter-item" @click="getFinanceAccountList()" type="primary" icon="el-icon-search">搜索
      </el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-setting" @click="payGet()">支付开通</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="edit()">新增</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteMulti()">批量删除</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="financeAccounts.data"
      v-loading="listLoading"
      border
      style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="pharmacyName" width="150" label="药店"></el-table-column>
      <el-table-column fixed prop="bankCard.cardNumber" width="150" label="银行卡"></el-table-column>
      <el-table-column prop="bankCard.cardTypeName" width="120" label="银行卡类型"></el-table-column>
      <el-table-column prop="amount" width="150" label="账户余额"></el-table-column>
      <el-table-column prop="currencyName" width="100" label="币种"></el-table-column>
      <el-table-column prop="status" width="100" label="账户状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status">启用</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="withdrawable" width="70" label="可提现">
        <template slot-scope="scope">
          <span v-if="scope.row.withdrawable">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column width="152" prop="openDate" label="开户时间">
        <template slot-scope="scope">
          {{scope.row.openDate | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column width="152" prop="lastChargeTime" label="最后充值时间">
        <template slot-scope="scope">
          {{scope.row.lastChargeTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="creditLine" width="100" label="信用额度"></el-table-column>
      <el-table-column prop="payChannelStatusName" width="90" label="支付审核状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="216">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="charging(scope.row)">充值</el-button>
          <el-button type="danger" size="mini" @click="deleteFinanceAccount(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]"
                     :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="financeAccounts.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="mTitle"
      :close-on-click-modal=false
      :visible.sync="dialogVisible">
      <el-form :model="mObject" :rules="rules" ref="mObject" label-width="120px">
        <el-form-item label="药店" prop="pharmacyId">
          <el-select v-model="mObject.pharmacyId" filterable placeholder="请选择药店" :disabled="pharmacySelectDisabled">
            <el-option
              v-for="item in pharmacys.data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡类型" prop="cardTypeCode">
          <el-select v-model="mObject.bankCard.cardTypeCode" placeholder="请选择卡类型">
            <el-option
              v-for="item in cardTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡户名" prop="cardName">
          <el-input v-model="mObject.bankCard.cardName"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" prop="cardNumber">
          <el-input v-model="mObject.bankCard.cardNumber"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bankCard.bankName">
          <el-select v-model="mObject.bankCard.bankName" placeholder="请选择开户银行">
            <el-option
              v-for="item in banks.data"
              :key="item.bankName"
              :label="item.bankName"
              :value="item.bankName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省市区" prop="bankCard.province">
          <a-map :address-obj.sync="mObject.bankCard" v-if="dialogVisible"></a-map>
        </el-form-item>
        <el-form-item label="开户行支行" prop="bankCard.subBankCode">
          <el-autocomplete ref="subBankInput" v-model="mObject.bankCard.subBankName"
            style="width: 300px;"
            :fetch-suggestions="querySubBanks"
            @select="selectSubBank"
            ></el-autocomplete>
        </el-form-item>
        <el-form-item label="账户余额" prop="amount">
          <el-input v-model="mObject.amount" :disabled="amountDisabled" placeholder="0"></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="currencyCode">
          <el-select v-model="mObject.currencyCode" placeholder="请选择币种">
            <el-option
              v-for="item in dictionaryItems"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户状态" prop="status">
          <el-select v-model="mObject.status" placeholder="请选择账户状态">
            <el-option label="启用" :value="true"></el-option>
            <el-option label="禁用" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可提现" prop="withdrawable">
          <el-select v-model="mObject.withdrawable" placeholder="请选择是否可提现">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户时间" prop="openDate">
          <el-date-picker
            v-model="mObject.openDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="信用额度" prop="creditLine">
          <el-input v-model="mObject.creditLine"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="充值"
      :close-on-click-modal=false
      :visible.sync="chargingDialogVisible">
      <el-form :model="mCharging" :rules="chargingRules" ref="mCharging" label-width="120px">
        <el-form-item label="充值金额" prop="amount">
          <el-input v-model="mCharging.amount">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="说明" prop="memo">
          <el-input v-model="mCharging.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chargingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChargingForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--支付开通-->
    <el-dialog
      title="支付开通"
      :close-on-click-modal=false
      :visible.sync="payGetDialogVisible">
      <el-form :model="pharmacyInfo" :rules="payGetRules" ref="pharmacyInfo" label-width="120px">
        <el-form-item label="商户账户类型" prop="businessAccountTypeCode">
          <el-select v-model="pharmacyInfo.businessAccountTypeCode" placeholder="商户账户类型">
            <el-option
              v-for="item in businessAccountTypes"
              :key="item.id"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户负责人" prop="businessPerson">
          <el-input v-model="pharmacyInfo.businessPerson"></el-input>
        </el-form-item>
        <el-form-item label="商户负责人手机" prop="businessPersonTel">
          <el-input v-model="pharmacyInfo.businessPersonTel"></el-input>
        </el-form-item>
        <el-form-item label="营业执照号" prop="businessLicenseNum">
          <el-input v-model="pharmacyInfo.businessLicenseNum"></el-input>
        </el-form-item>
        <el-form-item label="营业执照" prop="businessLicensePic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadBusinessLicensePicSuccess"
            accept="image/*">
            <img v-if="pharmacyInfo.businessLicensePic" :src="pharmacyInfo.businessLicensePic"
                 class="businessLicensePic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="组织机构代码" prop="organizeNum">
          <el-input v-model="pharmacyInfo.organizeNum"></el-input>
        </el-form-item>
        <el-form-item label="组织机构照" prop="organizePic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadOrganizePicSuccess"
            accept="image/*">
            <img v-if="pharmacyInfo.organizePic" :src="pharmacyInfo.organizePic" class="organizePic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="开户许可证" prop="accountLicenseNum">
          <el-input v-model="pharmacyInfo.accountLicenseNum"></el-input>
        </el-form-item>
        <el-form-item label="开户许可证照" prop="accountLicensePic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadAccountLicensePicSuccess"
            accept="image/*">
            <img v-if="pharmacyInfo.accountLicensePic" :src="pharmacyInfo.accountLicensePic" class="accountLicensePic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="法人" prop="leader">
          <el-input v-model="pharmacyInfo.leader"></el-input>
        </el-form-item>
        <el-form-item label="法人联系电话" prop="leaderTel">
          <el-input v-model="pharmacyInfo.leaderTel"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证号" prop="leaderIdcardNum">
          <el-input v-model="pharmacyInfo.leaderIdcardNum"></el-input>
        </el-form-item>
        <el-form-item label="法人身份证正面照" prop="leaderIdcardFrontPic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadLeaderIdcardFrontPicSuccess"
            accept="image/*">
            <img v-if="pharmacyInfo.leaderIdcardFrontPic" :src="pharmacyInfo.leaderIdcardFrontPic"
                 class="leaderIdcardFrontPic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="法人身份证反面照" prop="leaderIdcardBackPic">
          <el-upload
            class="pic-uploader"
            :multiple="false"
            :show-file-list="false"
            :action="attachmentUploadUrl"
            :auto-upload="true"
            :data="upLoadData"
            :headers="headersData"
            :onSuccess="uploadLeaderIdcardBackImgSuccess"
            accept="image/*">
            <img v-if="pharmacyInfo.leaderIdcardBackPic" :src="pharmacyInfo.leaderIdcardBackPic"
                 class="leaderIdcardBackPic">
            <i v-else class="el-icon-plus logo-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="payGetDialogVisible = false">取 消</el-button>
        <el-button :disabled="payChannelStatusCode" type="primary" @click="submitPayGetForm">保 存</el-button>
        <el-button :disabled="payChannelStatusCode" type="primary" @click="submitPayGetFormAndAudit">提交审核</el-button>
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

  .businessLicensePic {
    width: 120px;
    height: 120px;
    display: block;
  }

  .organizePic {
    width: 120px;
    height: 120px;
    display: block;
  }

  .accountLicensePic {
    width: 120px;
    height: 120px;
    display: block;
  }

  .leaderIdcardFrontPic {
    width: 120px;
    height: 120px;
    display: block;
  }

  .leaderIdcardBackPic {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  import { getToken } from '@/utils/auth'
  import { getConstants } from '@/utils/constants'
  import AMap from '@/components/AMap'
  import AMapAddress from '@/components/AMap/address'
  export default {
    components: { AMap, AMapAddress },
    data() {
      return {
        pharmacySelectDisabled: false,
        listLoading: false,
        param: { page: 1, limit: 10, searchCondition: { bankCard: {}}, type: '' },
        dialogVisible: false,
        mObject: {
          bankCard: {}
        },
        mTitle: '',
        amountDisabled: false,
        mCharging: {},
        chargingDialogVisible: false,
        pharmacyInfo: {},
        payGetDialogVisible: false,
        attachmentUploadUrl: getConstants().ATTACHMENT_UPLOAD_URL,
        attachmentUrl: getConstants().ATTACHMENT_URL,
        payChannelStatusCode: false, // 是否允许保存/提交审核

        rules: {
          pharmacyId: [
            { required: true, message: '请选择药店', trigger: 'blur' }
          ],
          amount: [
            { required: true, message: '请输入账户余额', trigger: 'blur' }
          ],
          currencyCode: [
            { required: true, message: '请选择币种', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择账户状态', trigger: 'blur' }
          ],
          withdrawable: [
            { required: true, message: '请选择是否可提现', trigger: 'blur' }
          ],
          openDate: [
            { required: true, message: '请选择开户时间', trigger: 'blur' }
          ],
          creditLine: [
            { required: true, message: '请输入信用额度', trigger: 'blur' }
          ],
          'bankCard.province': [
            { required: true, message: '请选择省市区', trigger: 'blur' }
          ],
          'bankCard.bankName': [
            { required: true, message: '请输入开户行', trigger: 'blur' }
          ],
          'bankCard.subBankCode': [
            { required: true, message: '请输入开户行支行', trigger: 'blur' }
          ],
        },

        chargingRules: {
          amount: [
            { required: true, message: '请输入充值金额', trigger: 'blur' }
          ],
          memo: [
            { required: true, message: '请输入备注', trigger: 'blur' }
          ]
        },

        payGetRules: {
          businessPerson: [
            { required: true, message: '请输入商户负责人姓名', trigger: 'blur' }
          ],
          businessPersonTel: [
            { required: true, message: '请输入商户负责人手机号码', trigger: 'blur' }
          ],
          businessAccountTypeCode: [
            { required: true, message: '请选择商户账户类型', trigger: 'blur' }
          ],
          businessLicenseNum: [
            { required: true, message: '请输入营业执照号码', trigger: 'blur' }
          ],
          businessLicensePic: [
            { required: true, message: '请上传营业执照照片', trigger: 'blur' }
          ],
          organizeNum: [
            { required: true, message: '请输入组织机构代码', trigger: 'blur' }
          ],
          organizePic: [
            { required: true, message: '请上传组织机构照片', trigger: 'blur' }
          ],
          accountLicenseNum: [
            { required: true, message: '请输入开户许可证', trigger: 'blur' }
          ],
          accountLicensePic: [
            { required: true, message: '请上传照片', trigger: 'blur' }
          ],
          leader: [
            { required: true, message: '请输入法人', trigger: 'blur' }
          ],
          leaderTel: [
            { required: true, message: '请输入法人联系电话', trigger: 'blur' }
          ],
          leaderIdcardNum: [
            { required: true, message: '请输入法人身份证号码', trigger: 'blur' }
          ],
          leaderIdcardFrontPic: [
            { required: true, message: '请输入法人身份证正面照', trigger: 'blur' }
          ],
          leaderIdcardBackPic: [
            { required: true, message: '请输入法人身份证反面照', trigger: 'blur' }
          ]

        },

        upLoadData: {
          file_id: 0
        },
        headersData: { Authorization: getToken() }
      }
    },
    filters: {},
    created() {
      this.getFinanceAccountList()
      this.getCardTypeList()
      this.getBusinessAccountTypes()
      this.getPharmacyList()
      this.getBankNameList()
      this.getDictionaryItem()
    },
    computed: mapState({
      financeAccounts: state => state.financeAccount.financeAccounts,
      cardTypes: state => state.financeAccount.cardTypes,
      subBanks: state => state.financeAccount.subBanks,
      pharmacys: state => state.pharmacy.pharmacys,
      banks: state => state.financeAccount.banks,
      businessAccountTypes: state => state.financeAccount.businessAccountTypes,
      dictionaryItems: state => state.financeAccount.dictionaryItems
    }),
    methods: {
      getFinanceAccountList() {
        this.listLoading = true
        this.$store.dispatch('getFinanceAccountList', {
          params: this.param, callback: () => {
            this.listLoading = false
          }
        })
      },
      getCardTypeList() {
        this.$store.dispatch('getCardTypeList', { params: {}})
      },
      getBusinessAccountTypes() {
        this.$store.dispatch('getBusinessAccountTypes', { params: {}})
      },
      getDictionaryItem() {
        this.$store.dispatch('getDictionaryItem', { params: {}})
      },
      getPharmacyList() {
        this.$store.dispatch('getPharmacyList', { params: { page: 0, limit: 10000, searchCondition: {}}})
      },
      getBankNameList() {
        this.$store.dispatch('getBankNameList', { params: { page: 0, limit: 10000, searchCondition: {}}})
      },
      resetSearch() {
        this.param.searchCondition = {}
        this.getFinanceAccountList()
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getFinanceAccountList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getFinanceAccountList()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      // 支付开通
      payGet() {
        if (!this.selectedRows) {
          this.$message({
            type: 'error',
            message: '请先选择需要开通的药店!',
            duration: 3 * 1000
          })
          return false
        }

        if (this.selectedRows.length > 1) {
          this.$message({
            type: 'error',
            message: '只可选择一项!',
            duration: 3 * 1000
          })
          return false
        }
        const row = this.selectedRows[0]
        this.pharmacyInfo = Object.assign({
          businessLicensePic: '',
          organizePic: '',
          accountLicensePic: '',
          leaderIdcardFrontPic: '',
          leaderIdcardBackPic: ''
        }, row.pharmacyVO)
        if (!!this.pharmacyInfo.payChannelStatusName && (this.pharmacyInfo.payChannelStatusName === '0' || this.pharmacyInfo.payChannelStatusName === '1')) {
          this.payChannelStatusCode = true
        }
        this.payGetDialogVisible = true
        this.$nextTick(() => {
          this.$refs['pharmacyInfo'].clearValidate()
        })
      },
      // 保存开通支付通道所需要的资料
      submitPayGetForm() {
        this.$refs['pharmacyInfo'].validate((valid) => {
          if (valid) {
            if (this.pharmacyInfo.id) {
              this.$store.dispatch('submitAuditInfo', {
                data: this.pharmacyInfo, callback: () => {
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.payGetDialogVisible = false
                  this.getFinanceAccountList()
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 提交审核 开通支付通道
      submitPayGetFormAndAudit() {
        this.$refs['pharmacyInfo'].validate((valid) => {
          if (valid) {
            if (this.pharmacyInfo.id) {
              this.$store.dispatch('submitAudit', {
                data: this.pharmacyInfo, callback: () => {
                  this.$message({
                    message: '提交审核成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.payGetDialogVisible = false
                  this.getFinanceAccountList()
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      querySubBanks(queryString, cb) {
        const { bankCard } = this.mObject
        const bank = bankCard.bankName
        const { province, city } = bankCard
        this.$store.dispatch('getSubBanks', { bank, province, city, queryName: queryString }).then( response => {
          for (let item of response.data) {
            item.value = item.subBankName
          }
          cb(response.data)
        } )
      },
      selectSubBank(bank) {
        this.mObject.bankCard.subBankName = bank.subBankName
        this.mObject.bankCard.subBankCode = bank.bankCode
        this.$refs['subBankInput'].focus()
      },
      // 编辑/新增
      edit(row) {
        this.mTitle = '编辑'
        this.pharmacySelectDisabled = true
        if (!row) {
          this.mTitle = '新增'
          this.pharmacySelectDisabled = false
          row = {
            bankCard: {},
            currencyCode: 'CNY',
            withdrawable: false,
            status: true,
            creditLine: 0,
            amount: 0
          }
        } else {
          row.openDate = moment(row.openDate).format('YYYY-MM-DD')
        }
        this.mObject = Object.assign({}, row)
        if (this.mObject.amount === null) {
          this.amountDisabled = false
        } else {
          this.amountDisabled = true
        }
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['mObject'].clearValidate()
        })
      },
      // 删除角色
      deleteFinanceAccount(role) {
        this.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteFinanceAccount', {
            data: role, callback: () => {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 3 * 1000
              })
              this.getFinanceAccountList()
            }
          })
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
        this.deleteFinanceAccount({ id: idsArr.join(',') })
      },
      // 提交表单
      submitForm() {
        const amountReg = /^(([0-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/
        if (!amountReg.test(this.mObject.amount)) {
          this.$message({
            type: 'error',
            message: '请输入正确的账号余额!',
            duration: 3 * 1000
          })
          return false
        }
        if (!amountReg.test(this.mObject.creditLine)) {
          this.$message({
            type: 'error',
            message: '请输入正确的信用额度!',
            duration: 3 * 1000
          })
          return false
        }
        this.$refs['mObject'].validate((valid) => {
          if (valid) {
        //     console.log(this.mObject.bankCard.cardName,22)
            if(this.mObject.bankCard.cardNumber !== "" && this.mObject.bankCard.cardNumber !== null && this.mObject.bankCard.cardNumber !== undefined ){
              let reg = /^(\d{16}|\d{19})$/
              if(!reg.test(this.mObject.bankCard.cardNumber)){
                return this.$message({
                  type: 'error',
                  message: '请输入正确的银行卡号!',
                  duration: 3 * 1000
                })
              }
            }
            if(this.mObject.bankCard.cardName !== "" && this.mObject.bankCard.cardName !== null && this.mObject.bankCard.cardName !== undefined ){
              let reg = /^[\u4e00-\u9fa5]+$/
              if(!reg.test(this.mObject.bankCard.cardName)){
                return this.$message({
                  type: 'error',
                  message: '请输入汉字银行卡户名!',
                  duration: 3 * 1000
                })
              }
            }
            if (this.mObject.id) {
              this.$store.dispatch('editFinanceAccount', {
                data: this.mObject, callback: () => {
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.dialogVisible = false
                  this.getFinanceAccountList()
                }
              })
            } else {
              this.$store.dispatch('addFinanceAccount', {
                data: this.mObject, callback: () => {
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 3 * 1000
                  })
                  this.dialogVisible = false
                  this.getFinanceAccountList()
                }
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      charging(row) {
        this.mCharging = {
          financeAccountId: row.id
        }
        this.chargingDialogVisible = true
        this.$nextTick(() => {
          this.$refs['mCharging'].clearValidate()
        })
      },
      // 提交充值表单
      submitChargingForm() {
        const amountReg = /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/
        if (!amountReg.test(this.mCharging.amount)) {
          this.$message({
            type: 'error',
            message: '请输入正确的充值金额!',
            duration: 3 * 1000
          })
          return false
        }
        this.$refs['mCharging'].validate((valid) => {
          if (valid) {
            this.$store.dispatch('chargingAccount', {
              data: this.mCharging, callback: () => {
                this.$message({
                  message: '充值成功',
                  type: 'success',
                  duration: 3 * 1000
                })
                this.chargingDialogVisible = false
                this.getFinanceAccountList()
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },

      uploadBusinessLicensePicSuccess(response, file, fileList) {
        if (response.success) {
          this.pharmacyInfo.businessLicensePic = this.attachmentUrl + response.data
        }
      },
      uploadOrganizePicSuccess(response, file, fileList) {
        if (response.success) {
          this.pharmacyInfo.organizePic = this.attachmentUrl + response.data
        }
      },
      uploadAccountLicensePicSuccess(response, file, fileList) {
        if (response.success) {
          this.pharmacyInfo.accountLicensePic = this.attachmentUrl + response.data
        }
      },
      uploadLeaderIdcardFrontPicSuccess(response, file, fileList) {
        if (response.success) {
          this.pharmacyInfo.leaderIdcardFrontPic = this.attachmentUrl + response.data
        }
      },
      uploadLeaderIdcardBackImgSuccess(response, file, fileList) {
        if (response.success) {
          this.pharmacyInfo.leaderIdcardBackPic = this.attachmentUrl + response.data
        }
      }
    }
  }
</script>
