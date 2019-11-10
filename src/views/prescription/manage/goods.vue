<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 180px;" v-model="param.searchCondition.goodsBarcode" class="filter-item"
                placeholder="药品编码" @keyup.enter.native="search">
      </el-input>
      <el-select style="width:200px;" v-model="param.searchCondition.itemName" placeholder="药品名称" clearable filterable
                 remote
                 :remote-method="getDrugName" :loading="drugLoading" @change="search">
        <el-option
          v-for="item in drugName"
          :key="item.id"
          :label="item.itemName"
          :value="item.itemName">
        </el-option>
      </el-select>
      <el-input style="width: 180px;" v-model="param.searchCondition.itemBrand" class="filter-item" placeholder="药品品牌"
                @keyup.enter.native="search">
      </el-input>
      <el-input style="width: 280px;" v-model="param.searchCondition.manufacturer" class="filter-item"
                placeholder="生产厂家" @keyup.enter.native="search">
      </el-input>
      <el-button class="filter-item" @click="search()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-button class="filter-item" @click="resetSearch()" type="danger" icon="el-icon-refresh">重置</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      :data="pharmacyGoods.data"
      v-loading="listLoading"
      border
      style="width: 100%"
      @cell-click="alert"
    >
      <el-table-column fixed="left" prop="itemName" width="150" label="药品名称"></el-table-column>
      <el-table-column  prop="medical"  label="医保药"></el-table-column>
      <el-table-column prop="goodsBarcode" width="150" label="药品编码"></el-table-column>
      <el-table-column prop="itemBrand" width="120" label="品牌"></el-table-column>
      <el-table-column prop="spec" width="120" label="规格"></el-table-column>
      <el-table-column prop="lotNumber" width="150" label="产品批号"></el-table-column>
      <el-table-column prop="manufacturer" width="300" label="厂家"></el-table-column>
      <el-table-column prop="store" label="库存">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            v-model="scope.row.storevisible">
            <el-form class="pop-form" :inline="true">
              <el-input class="input" v-model="restore" ></el-input>
              <!--@keyup.enter.native="savePop(scope.row, 'store')"-->
              <el-button class="btn" @click="savePop(scope.row, 'store')" size="mini" type="primary">保存
              </el-button>
              <el-button class="btn" @click="hidePop(scope.row, 'store')" size="mini">取消</el-button>
            </el-form>
            <span class="show-text" @click="showPop(scope.row, 'store')"
                  slot="reference">{{ scope.row.store || 0 }}</span>
          </el-popover>
          <!--<el-popover-->
            <!--placement="top"-->
            <!--width="160"-->
            <!--v-model="visible2">-->
            <!--<p>这是一段内容这是一段内容确定删除吗？</p>-->
            <!--<div style="text-align: right; margin: 0">-->
              <!--<el-button size="mini" type="text" @click="visible2 = false">取消</el-button>-->
              <!--<el-button type="primary" size="mini" @click="visible2 = false">确定</el-button>-->
            <!--</div>-->
            <!--<el-button slot="reference">删除</el-button>-->
          <!--</el-popover>-->
        </template>
      </el-table-column>
      <el-table-column prop="tinyStore" label="散装库存">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            v-model="scope.row.tinyStorevisible">
            <el-form class="pop-form" :inline="true">
              <el-input class="input" v-model="restore"></el-input>
              <!--@keyup.enter.native="savePop(scope.row, 'tinyStore')"-->
              <el-button class="btn" @click="savePop(scope.row, 'tinyStore')" size="mini" type="primary">
                保存
              </el-button>
              <el-button class="btn" @click="hidePop(scope.row, 'tinyStore')" size="mini">取消</el-button>
            </el-form>
            <span class="show-text" @click="showPop(scope.row, 'tinyStore')" slot="reference">{{ scope.row.tinyStore || 'Empty' }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价"></el-table-column>
      <el-table-column prop="marketableTime" width="152" label="上架时间">
        <template slot-scope="scope">
          {{scope.row.marketableTime | dateFormat}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="marketable" label="上架状态">
        <template slot-scope="scope">
          <div v-if="scope.row.marketable === true">
            上架
          </div>
          <div v-else>
            下架
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="142">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="showItem(scope.row)">拆零明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="param.page" :page-sizes="[10,20,30, 50]" :page-size="param.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="pharmacyGoods.total">
      </el-pagination>
    </div>

    <el-dialog
      title="拆零明细"
      :close-on-click-modal=false
      :visible.sync="itemDialogVisible"
      v-loading="itemLoading">
      <el-table
        :data="itemTinyRates.data"
        v-loading="listLoading"
        border
        style="width: 100%">
        <el-table-column prop="unitCode" label="单位"></el-table-column>
        <el-table-column prop="amount" label="最小单位换算比例"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
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

  /*.el-select-dropdown__item{*/
    /*.hover {*/
      /*background-color: #0088cc;*/
    /*}*/
  /*}*/

  .el-select-dropdown__item:hover{
    background-color: #409EFF;
    color: white;
  }
</style>

<script>
  import { mapState } from 'vuex'
  import { getConstants } from '@/utils/constants'
  import { download } from '@/utils/export'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        visible2:false,
        listLoading: false,
        drugLoading: false,
        itemLoading: false,
        param: { page: 1, limit: 10, searchCondition: { pharmacyId: -1 }},
        dialogVisible: false,
        itemDialogVisible: false,
        marketableTime: null,
        mTitle: '',
        mObject: {},
        restore: 0,
        rules: {
          itemName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        },
        drugNameSearch: ''
      }
    },
    filters: {},
    created() {
      this.getPharmacyGoodsList()
    },
    computed: mapState({
      pharmacyGoods: state => state.pharmacyGoods.pharmacyGoods,
      itemTinyRates: state => state.goodsSku.itemTinyRates,
      drugName: state => state.prescription.drugName
    }),
    methods: {
      alert(row, column, cell, event) {
        // console.log(column,222)
        if (column.label === '库存') {
          this.showPop(row, 'store')
        } else if (column.label === '散装库存') {
          // @click="showPop(scope.row, 'tinyStore')"
          this.showPop(row, 'tinyStore')
        }
      },
      search() {
        this.param.page = 1
        this.getPharmacyGoodsList()
      },
      getPharmacyGoodsList() {
        this.listLoading = true
        this.$store.dispatch('getPharmacyGoodsList', {
          params: this.param,
          callback: () => {
            this.listLoading = false
          }
        })
      },
      getDrugName(query) {
        this.$store.dispatch('clearDrugName')
        if (query !== '') {
          this.drugLoading = true
          this.$store.dispatch('drugName', {
            drugNameSearch: query,
            callback: () => {
              this.drugLoading = false
            }
          })
        }
      },
      resetSearch() {
        this.marketableTime = null
        this.param.page = 1
        this.param.searchCondition = { pharmacyId: -1 }
        this.getPharmacyGoodsList()
      },
      handleSizeChange(size) {
        this.param.limit = size
        this.getPharmacyGoodsList()
      },
      handleCurrentChange(page) {
        this.param.page = page
        this.getPharmacyGoodsList()
      },
      handleSelectionChange(val) {
        this.selectedRows = val
      },
      showItem(row) {
        this.itemDialogVisible = true
        this.getItemTinyRate(row)
      },
      getItemTinyRate(row) {
        this.itemLoading = true
        this.$store.dispatch('getItemTinyRate', {
          params: { id: row.skuId },
          callback: () => {
            this.itemLoading = false
          }
        })
      },
      showPop(row, key) {
        row[key + 'visible'] = true
        this.restore = row[key]
        // console.log(this.restore,222)
        let flag = true;
        this.$nextTick(()=>{
          let element = document.querySelectorAll('body>.el-popover')
          for (let i = 0;i<element.length;i++ ){
            if ( flag && element[i].style.display != 'none') {
              flag = false
            }else if(!flag){
              element[i].style.display = 'none'
            }
          }
        })
      },
      hidePop(row, key) {
        row[key + 'visible'] = false
      },
      savePop(row, key) {
        row[key + 'visible'] = false
        row[key] = this.restore
        this.updPharmacyItemStore(row, key)
      },
      updPharmacyItemStore(row, key) {
        this.$store.dispatch('updPharmacyItemStore', row).then(() => {
          row[key] = this.restore
          if (key === 'itemTinyRateId') {
            this.getPharmacyGoodsList()
          }
        })
      }
    }
  }
</script>
