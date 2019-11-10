<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">

      <!-- <router-link v-if="hasOneShowingChildren(item.children)&&!item.alwaysShow" :to="item.path"
        :key="item.children[0].id">
        <el-menu-item :index="item.path+'/'+item.children[0].path" class="menu-icon" :class="{'submenu-title-noDropdown':!isNest}">
          <i v-if="item.children[0].meta&&item.children[0].meta.icon" :class="item.children[0].meta.icon"></i>
          <span v-if="item.children[0].name" slot="title">{{item.children[0].name}}</span>
        </el-menu-item>
      </router-link> -->

      <el-submenu v-if="item.children" :index="item.id||item.path" :key="item.id">
        <template slot="title">
          <i v-if="item.vueIcon" class="menu-icon" :class="item.vueIcon"></i>
          <span v-if="item.name" slot="title">{{item.name}}</span>
        </template>

        <template v-for="child in item.children" v-if="item.children && !child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

          <router-link v-else :to="item.vueName+'/'+child.vueName" :key="child.name">
            <el-menu-item :index="item.vueName+'/'+child.vueName">
              <i v-if="child.vueIcon" class="menu-icon" :class="child.vueIcon"></i>
              <span v-if="child.name" slot="title">{{child.name}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

      <router-link v-else :to="item.vueName" :key="item.name" :class="{'is-opened':!sidebar.opened}">
        <el-menu-item :index="item.vueName+'/'+item.vueName">
          <i v-if="item.vueIcon" class="menu-icon" :class="item.vueIcon"></i>
          <span v-if="item.name" slot="title">{{item.name}}</span>
        </el-menu-item>
      </router-link>

      <!-- <el-submenu :index="item.id" :key="item.id">
        <template slot="title">
          <i v-if="item.vueIcon" class="menu-icon" :class="item.vueIcon"></i>
          <span v-if="item.name" slot="title">{{item.name}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.id"></sidebar-item>

          <router-link v-else :to="child.vueName" :key="child.id">
            <el-menu-item :index="item.vueName">
              <i v-if="child.vueIcon" class="menu-icon" :class="child.vueIcon"></i>
              <span v-if="child.name" slot="title">{{child.name}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu> -->

    </template>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss">
  .is-opened{
    transform: translateX(-10px);
  }
</style>
