<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 这里是头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

    <el-form :model="loginForm" :rules="loginFormRules"
    label-width="0px" class="login_form"
    ref="loginFormRef">

      <!-- 用户名 -->
      <el-form-item label="Name" prop="username">
        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="Password" prop="password">
        <el-input v-model="loginForm.password"
        type="password" prefix-icon="iconfont icon-3702mima"></el-input>
      </el-form-item>

      <el-form-item class="btns">
        <el-button type="primary"
        @click="login">登陆</el-button>

        <el-button type="info"
        @click="resetForm">重置</el-button>
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
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在6到10个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {

    resetForm () {
      console.log(this)
      console.log(this.$refs.loginFormRef)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 这里的vaild是表单校验结束之后返回的结果
      // 对整个表单进行校验的方法，参数为一个回调函数。
      // 该回调函数会在校验结束后被调用，
      // 并传入两个参数：是否校验成功和未通过校验的字段。
      // 若不传入回调函数，则会返回一个 promise
      this.$refs.loginFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('失败了')
        this.$message.success('成功！')
        window.sessionStorage.setItem('data', res.data.token)
        this.$router.push('/home')
      })
    }

  }
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
