<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 这里是头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

    <el-form :model="loginForm" label-width="0px" class="login_form">
      <el-form-item label="Name">
        <el-input v-model="loginForm.name" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>

      <el-form-item label="Password">
        <el-input v-model="loginForm.password"
        type="password" prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>

      <el-form-item class="btns">
        <el-button type="primary">登陆</el-button>
        <el-button type="info">重置</el-button>
      </el-form-item>
    </el-form>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        name: '',
        password: '22'
      }
    }
  }
  // alert(data.form.name)
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box{
  width:450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  box-shadow: 0 0 10px #ddd;
}

.avatar_box{
  height: 130px;
  width:130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.btns{
  display: flex;
  justify-content: flex-end
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // overflow: hidden;
  box-sizing: border-box;
}
</style>
