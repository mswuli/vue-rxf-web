<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <div class="clearfix top">
      <!--<router-link class="item custor" to="/">-->
      <!--首页-->
      <!--</router-link>-->
      <div class="item custor" @click="logout">退出</div>
      <el-button
        class="item message"
        @click="stockTips"
      >
        消息
        <el-badge :value="notificationNums" :max="5"></el-badge>
      </el-button>
      <!--<el-badge @click="stockTips" :value="notificationNums" class="item message">消息</el-badge>-->
      <div class="item">您好，{{ (accoount && accoount.name) || username }}</div>
      <div class="selected">
        <el-select v-model="titles" placeholder=""  @change="select">
          <el-option
            v-for="item in lists"
            :key="item.id"
            :label="item.name"
            :value="item.plateId">
          </el-option>
        </el-select>
      </div>
    </div>
    <sidebar class="sidebar-container" v-if="isRouterAlive" ></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
  import { AppMain, Navbar, Sidebar } from './components'
  import ResizeMixin from './mixin/ResizeHandler'
  import moment from 'moment'
  import { getTitle } from '@/utils/auth'
  import {getMenu } from '@/api/resourceManage'
  export default {
    inject: ["reload"],
    name: 'layout',
    data() {
      return {
        notificationNums: null,
        notificationList: {},
        titles: '处方流转',
        lists:[],
        isRouterAlive: true
      }
    },
    components: {
      Navbar,
      Sidebar,
      AppMain
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      },
    },
    created() {
      this.username = window.localStorage.username
      if (window.localStorage.account) {
        this.accoount = JSON.parse(window.localStorage.account)
        this.lists = this.accoount.orgPlateMappingVOList;
      }
      this.init();
      if (window.localStorage.urls){
        this.titles = window.localStorage.urls;
      }

    },
    methods: {
      init() {
        document.title = getTitle()
        this.getNotification()
        setInterval(() => {
          this.getNotification()
        }, 300000)
      },
      handleClickOutside() {
        this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
      },
      // 获取列表
      select(value){
        window.localStorage.urls = this.titles;
        getMenu({plateId:value}).then(resource => {
          window.localStorage.menu = JSON.stringify(resource)
          let url = '/'
          for (const m of resource) {
            if (m.name === 'CRM首页' || m.name === '药店首页') {
              url = m.vueName
            }
          }
          this.$router.push({ path: url });
          this.isRouterAlive = false;
          this.$nextTick(function() {
            this.isRouterAlive = true;
          });
        })
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          window.localStorage.urls = "";
          window.localStorage.roleType = "";
          location.reload()
        })
      },
      /**
       * 获取药店告警
       */
      getNotification() {
        this.$store
          .dispatch('getNotification', { pharmacyId: -1 }).then(response => {
          this.notificationList = response
          this.notificationNums = response.notificationNums
          if (this.notificationNums === 0) {
            this.notificationNums = null
          }
        })
      },
      stockTips() {
        if (this.notificationNums == null) {
          return
        }
        this.$notify.closeAll()
        if (this.notificationList.pharmacyBalanceNotification) {
          const h = this.$createElement
          //
          const notify1 = this.$notify({
            title: '余额告警',
            message: h('p', null, [
              h('p', { style: 'color:black;font-size:12px;' }, '截至' + moment(new Date()).format('MM月DD日') + '，您充值的账户余额已不足500元，请尽快充值，以免影响接单!'),
              h('a', {
                on: {
                  click: () => { this.checkBtn(notify1) }
                },
                style: 'color:red;float:right;'

              }, '去处理')
            ]),
            position: 'top-right',
            duration: 0,
            type: 'error',
            offset: 20
          })
        }
        if (this.notificationList.pharmacyItemInfoVOList) {
          let offsetSize = 140
          if (!this.notificationList.pharmacyBalanceNotification) {
            offsetSize = 20
          }
          const pharmacyItemInfoVOListLength = this.notificationList.pharmacyItemInfoVOList.length
          if (pharmacyItemInfoVOListLength > 0) {
            const h = this.$createElement
            // 您的药店有XX个药品库存不足，将影响接单，请尽快补货
            const notify2 = this.$notify({
              title: '库存告警',
              message: h('p', null, [
                h('p', { style: 'color:black;font-size:12px;' }, '截至' + moment(new Date()).format('MM月DD日') + '，您的药店有' + pharmacyItemInfoVOListLength + '个药品库存不足，请尽快补货，以免影响接单!'),
                h('a', {
                  on: {
                    click: () => { this.checkBtn(notify2) }
                  },
                  style: 'color:red;float:right;'

                }, '去处理')
              ]),
              position: 'top-right',
              duration: 0,
              type: 'error',
              offset: offsetSize
            })
          }
        }
        // this.notificationNums = null
      },
      checkBtn(notify) {
        notify.close()
        this.$router.push({
          path: 'home',
          name: 'PharmacyHome',
          component: () => import('@/views/pharmacy/manage/home')
        })
      }

    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .top {
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
    z-index: 3000;
    height: 30px;
    background: rgb(28, 43, 54);
    padding-right: 24px;
    .item {
      display: block;
      float: right;
      line-height: 30px;
      height: 30px;
      border-right: 1px solid #0d6364;
      padding: 0 20px;
      color: #fff;
      font-size: 12px;
      &:first-child {
        border-right: none;
      }
      &.custor {
        cursor: pointer;
      }
      &:nth-child(2) {
        background: #1c2b36;
        border: none;
        border-right: 1px solid #0d6364;
      }
    }
    /*.item >>> el-badge__content is-fixed{*/
    /*top:12px;*/
    /*}*/
    .message {
      color: #fff;
    }
  }
  .selected{
    /deep/ .el-select{
      float:right;
    }
    /deep/ .el-input__inner{
      height:30px;
      line-height:30px;
      background-color: #1c2b36;
      color:rgba(255, 152, 0, 1);
      border:none;
      font-size:12px;
      width:120px;
    }
    /deep/ .el-input{
      /*width:70%;*/
    }
    /deep/ .el-select-dropdown__item{
      color:rgba(255, 152, 0, 1)!important;
    }
    /deep/ .el-select .el-input .el-select__caret{
      color:#ffffff;
    }
  }
</style>
