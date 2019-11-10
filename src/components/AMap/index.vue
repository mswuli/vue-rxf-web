<template>
  <el-cascader
    style="width: 80%"
    :options="address"
    placeholder="请选择省/市/区"
    @active-item-change="changeItem"
    @change="changeAddress"
    :props="props"
    v-model="selectedAddress"
    >
  </el-cascader>
</template>

<script>
  import { RSAMAP } from '@/utils/amap'
  export default {
    props: ['addressObj'],
    data() {
      return {
        address: [],
        areaList: [],
        pIndex: 0,
        props: {
          value: 'adcode',
          label: 'name',
          children: 'districtList'
        },
        district: null,
        selectedAddress: []
      }
    },

    created() {
      RSAMAP().then(AMap => {
        console.log('init map')
        const opts = {
          subdistrict: 1,
          showbiz: false
        }
        this.district = new AMap.DistrictSearch(opts)
        this.district.search('中国', (status, result) => {
          if (status === 'complete') {
            for (const addr of result.districtList[0].districtList) {
              addr['districtList'] = []
            }
            this.address = result.districtList[0].districtList
            if (this.addressObj.provinceCode) {
              this.selectedAddress = [this.addressObj.provinceCode]
              this.changeItem([this.addressObj.provinceCode], () => {
                if (this.addressObj.cityCode) {
                  this.selectedAddress.push(this.addressObj.cityCode)
                  this.changeItem([this.addressObj.provinceCode, this.addressObj.cityCode], () => {
                    if (this.addressObj.areaCode) {
                      this.selectedAddress.push(this.addressObj.areaCode)
                    }
                  })
                }
              })
            }
          }
        })
      })
    },
    methods: {
      changeItem(val, callback) {
        const cVal = val[val.length - 1]
        this.district.search(cVal, (status, result) => {
          if (status === 'complete') {
            const rDistrictList = result.districtList[0].districtList
            if (val.length === 1) {
              for (const addr of rDistrictList) {
                addr['districtList'] = []
              }
              this.address.map((addr, index) => {
                if (addr.adcode === cVal) {
                  this.addressObj.provinceCode = addr.adcode
                  this.addressObj.province = addr.name
                  this.pIndex = index
                  addr.districtList = rDistrictList
                }
              })
            } else if (val.length === 2) {
              for (const addr of this.address[this.pIndex].districtList) {
                if (addr.adcode === cVal) {
                  this.addressObj.cityCode = addr.adcode
                  this.addressObj.city = addr.name
                  addr.districtList = rDistrictList
                  this.areaList = rDistrictList
                }
              }
            }
            callback && callback()
          }
        })
      },
      changeAddress(val) {
        const cVal = val[val.length - 1]
        for (const addr of this.areaList) {
          if (addr.adcode === cVal) {
            this.addressObj.areaCode = addr.adcode
            this.addressObj.area = addr.name
          }
        }
        this.$emit('update:addressObj', this.addressObj)
      }
    }
  }
</script>