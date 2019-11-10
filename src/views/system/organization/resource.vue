<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="平台" name="first">
      <el-tree
        ref="ptResourceTree"
        default-expand-all
        v-loading="listLoading"
        :data="resources"
        show-checkbox
        node-key="id"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :default-checked-keys="selectedPTList"
        :props="defaultProps">
      </el-tree>
      <div class="button-container">
        <el-button type="primary" size="small" @click="savePTResource()">保存</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="医院" name="second">
      <el-tree
        ref="yyResourceTree"
        default-expand-all
        v-loading="listLoading"
        :data="resources"
        show-checkbox
        node-key="id"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :default-checked-keys="selectedYYList"
        :props="defaultProps">
      </el-tree>
      <div class="button-container">
        <el-button type="primary" size="small" @click="saveYYResource()">保存</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="药店" name="third">
      <el-tree
        ref="ydResourceTree"
        default-expand-all
        :data="resources"
        v-loading="listLoading"
        show-checkbox
        node-key="id"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        :default-checked-keys="selectedYDList"
        :props="defaultProps">
      </el-tree>
      <div class="button-container">
        <el-button type="primary" size="small" @click="saveYDResource()">保存</el-button>
      </div>
    </el-tab-pane>
      <el-tab-pane label="监管" name="four">
        <el-tree
          ref="jgResourceTree"
          default-expand-all
          :data="resources"
          v-loading="listLoading"
          show-checkbox
          node-key="id"
          :check-on-click-node="true"
          :expand-on-click-node="false"
          :default-checked-keys="selectedJGList"
          :props="defaultProps">
        </el-tree>
        <div class="button-container">
          <el-button type="primary" size="small" @click="saveJGResource()">保存</el-button>
        </div>
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.button-container {
  padding: 20px 0 0;
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      activeName: 'first',
      defaultProps: {
        children: 'children',
        label: (data, node) => `${data.name}  ${data.function}`
      }
    }
  },
  filters: {
  },
  created() {
    this.getResourceList()
  },
  computed: mapState({
    resources: state => state.resource.resources,
    selectedPTList: state => state.resource.selectedPTList,
    selectedYYList: state => state.resource.selectedYYList,
    selectedYDList: state => state.resource.selectedYDList,
    selectedJGList: state => state.resource.selectedJGList
  }),
  methods: {
    handleClick(tab, event) {
    },
    getResourceList() {
      this.listLoading = true
      this.$store.dispatch('getResourceList', { callback: () => {
        this.listLoading = false
      } })
    },
    savePTResource() {
      const nodes = this.$refs.ptResourceTree.getHalfCheckedNodes()
      const checkedNodes = this.$refs.ptResourceTree.getCheckedNodes()
      console.log(nodes)
      const rmlist = []
      const orgCode = 'PLATFORM'
      for (const node of nodes) {
        rmlist.push({
          orgCode: orgCode,
          resourceId: node.id
        })
      }
      for (const n of checkedNodes) {
        rmlist.push({
          orgCode: orgCode,
          resourceId: n.id
        })
      }
      const mObject = {
        orgCode: orgCode,
        orgResourcePoolList: rmlist
      }
      this.$store.dispatch('saveResourcePool', { data: mObject, callback: () => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 3 * 1000
        })
      } })
    },
    saveYYResource() {
      const nodes = this.$refs.yyResourceTree.getHalfCheckedNodes()
      const checkedNodes = this.$refs.yyResourceTree.getCheckedNodes()
      console.log(nodes)
      const rmlist = []
      const orgCode = 'HOSPITAL'
      for (const node of nodes) {
        rmlist.push({
          orgCode: orgCode,
          resourceId: node.id
        })
      }
      for (const n of checkedNodes) {
        rmlist.push({
          orgCode: orgCode,
          resourceId: n.id
        })
      }
      const mObject = {
        orgCode: orgCode,
        orgResourcePoolList: rmlist
      }
      this.$store.dispatch('saveResourcePool', { data: mObject, callback: () => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 3 * 1000
        })
      } })
    },
    saveYDResource() {
      const nodes = this.$refs.ydResourceTree.getHalfCheckedNodes()
      const checkedNodes = this.$refs.ydResourceTree.getCheckedNodes()
      console.log(nodes)
      const rmlist = []
      const orgCode = 'PHARMACY'
      for (const node of nodes) {
        rmlist.push({
          orgCode: orgCode,
          resourceId: node.id
        })
      }
      for (const n of checkedNodes) {
        rmlist.push({
          orgCode: orgCode,
          resourceId: n.id
        })
      }
      const mObject = {
        orgCode: orgCode,
        orgResourcePoolList: rmlist
      }
      this.$store.dispatch('saveResourcePool', { data: mObject, callback: () => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 3 * 1000
        })
      } })
    },
    saveJGResource() {
      const nodes = this.$refs.jgResourceTree.getHalfCheckedNodes()
      const checkedNodes = this.$refs.jgResourceTree.getCheckedNodes()
      console.log(nodes)
      const rmlist = []
      const orgCode = 'SUPERVISION'
      for (const node of nodes) {
        rmlist.push({
          orgCode: orgCode,
          resourceId: node.id
        })
      }
      for (const n of checkedNodes) {
        rmlist.push({
          orgCode: orgCode,
          resourceId: n.id
        })
      }
      const mObject = {
        orgCode: orgCode,
        orgResourcePoolList: rmlist
      }
      this.$store.dispatch('saveResourcePool', { data: mObject, callback: () => {
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 3 * 1000
          })
        } })
    }
  }
}
</script>
