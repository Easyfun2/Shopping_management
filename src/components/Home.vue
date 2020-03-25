<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <div class="logo">Neil</div>
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="quit" type="danger">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="40%">Aside</el-aside>
      <!-- 右侧内容主体 -->

      <el-main>Main</el-main>
    </el-container>

  </el-container>

</template>

<script>
export default {
  methods: {
    quit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
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
    font-size: 10px;
  }
.el-aside {
    background-color: #333744;
    color: #333;
    text-align: center;
    line-height: 200px;
    vertical-align: middle;
  }

.el-main {
    background-color: #EAEDF1;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>
