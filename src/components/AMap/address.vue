<template>
  <el-input @focus="createMap" id="address" v-model="addressObj.address"></el-input>
</template>
<style lang="scss">
.amap-sug-result{
  position:absolute;
  z-index:10024;
  background-color:#fefefe;
  border:1px solid #d1d1d1;
  border-radius: 5px;
  bottom:auto
}
.auto-item:hover{
  background-color:#cae1ff
}
.auto-item{
  white-space:nowrap;
  font-size:12px;
  cursor:pointer;
  padding:6px 4px
}
.auto-item-span{
  color:#c1c1c1;
  padding-left:4px
}
</style>

<script>
  import { RSAMAP } from '@/utils/amap'
  export default {
    props: ['addressObj'],
    data() {
      return {
        autocomplete: null
      }
    },

    created() {
      setTimeout(() => {
        RSAMAP().then(AMap => {
          let city = this.addressObj.cityCode
          this.autocomplete = new AMap.Autocomplete({
            input: 'address',
            city
          })
          AMap.event.addListener(this.autocomplete, 'select', (e) => {
            this.addressObj.address = e.poi.name
            if (e.poi && e.poi.location) {
              this.addressObj.longitude = e.poi.location.lng
              this.addressObj.latitude = e.poi.location.lat
            }
            this.$emit('update:addressObj', this.addressObj)
          })
        })
      }, 1000)
    },
    methods: {
      createMap() {
        let city = this.addressObj.cityCode
        this.autocomplete.setCity(city)
      }
    }
  }
</script>