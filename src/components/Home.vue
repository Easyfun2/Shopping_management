<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <div class="block" v-for="size in sizeList" :key="size">
          <el-avatar :size="size" :src="circleUrl"></el-avatar>
        </div>
        <!-- <div class="logo">Neil</div> -->
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="quit" type="danger">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <div :style="isCollapse ? menuNavbar1 : menuNavbar" @click="control_menu">
          |||
        </div>
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group> -->
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
            >

            <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 一级菜单文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
            :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- <span> {{children_item}}</span> -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->

      <el-main>
         <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>

</template>

<script>
export default {
  data () {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      sizeList: ['medium'],
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      menuNavbar: {
        width: 'auto',
        lineHeight: '20px',
        textAlign: 'center',
        color: '#fff',
        fontSize: '15px',
        letterSpacing: '0.2em',
        // backgroundColor: 'grey',
        cursor: 'pointer',
        padding: '5px 0'

      },
      menuNavbar1: {
        width: 'auto',
        lineHeight: '20px',
        fontSize: '15px',
        textAlign: 'center',
        color: '#fff',
        letterSpacing: '0.1em',
        // backgroundColor: 'grey',
        cursor: 'pointer',
        transform: 'rotate(90deg)',
        transitionDuration: '0.3s',
        padding: '5px 0',
        transitionTimingFunction: 'ease-out',
        filter: 'progid: DXImageTransform.Microsoft.BasicImage(rotation=1)'
      },
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    quit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    control_menu () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>

.home-container{
  width: 100%;
  height: 100%;
}

.el-header{
    background-color: #373d41;
    color: #fff;
    font-size: 20px;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    > div{
      display: flex;
      align-items: center;
      span {
        margin-left: 20px;
      }
    }
  }

  .logo{
    width:50px;
    height: 50px;
    border-radius: 50%;
    background-color: burlywood;
    text-align: center;
    font-size: 12px;
    // line-height:50px;
    display: flex;
    align-items: center;
    justify-content: center;

    // vertical-align: middle;
  }

  .block{
    display: flex;
    align-items: center;
    justify-content: center;
  }
.el-aside {
    background-color: #333744;
    color: #333;
    text-align: center;
    line-height: 200px;
    margin: 0 auto;
    box-sizing: border-box;
    .el-menu {
      // box-sizing: border-box;
      border-right: none;

    }
  }

.el-main {
    background-color: #EAEDF1;
    color: #333;
    // text-align: center;
    // line-height: 160px;
  }
  .iconfont{
    margin-right: 10px;
  }

</style>
