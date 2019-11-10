<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <div class="login-info">
      <div class="panel">
        <div class="photo">
          <img class="user-avatar" src="@/assets/profile.png">
          <span class="post-name">{{ (accoount && accoount.mgrTypeName) || '管理员' }}</span>
        </div>
        <div class="text">
          <div class="username">{{ (accoount && accoount.name) || username }}</div>
          <div class="login-date">
            <!-- <p>上次登录时间</p>
            <p>2018-09-29 11:02</p> -->
          </div>
        </div>
      </div>
    </div>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="true"
      background-color="#1c2b36"
      text-color="#ffffff"
      active-text-color="#33414a"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
.login-info {
  height: 206px;
  padding-bottom: 15px;
  .panel {
    padding: 70px 20px 0;
    .photo {
      position: relative;
      text-align: center;
      padding-bottom: 20px;
      .user-avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background:#1c2b36;
      }
      .post-name {
        display: inline-block;
        overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
        width: 70px;
        padding: 0 5px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #ff832e;
        color: #fff;
        border-radius: 5px;
        position: absolute;
        top: 52px;
        left: 50%;
        transform: translate(-50%, 0);
        font-size: 12px;
      }
    }
    .text {
      text-align: center;
      font-size: 14px;
      color: #fff;
      border-bottom: 1px solid #111111;
      .username {
        font-size: 16px;
      }
      p {
        margin: 0;
      }
      .login-date {
        padding: 10px 0;
        line-height: 20px;
      }
    }
  }
}
</style>


<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  created() {
    this.username = window.localStorage.username
    if (window.localStorage.account) {
      this.accoount = JSON.parse(window.localStorage.account)
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return JSON.parse(window.localStorage.menu)
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
