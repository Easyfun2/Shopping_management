<template>
  <!-- <div>
    <h3>这里是users</h3>
  </div> -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

      <!-- 搜索与添加区域 -->
      <el-card >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input placeholder="请输入内容" >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary">添加用户</el-button>

          </el-col>
        </el-row>
      </el-card>
</div>

</template>

<script>
export default {
  data () {
    return {
      quertList: {
        query: '',
        pagenum: 1,
        pagesize: 2

      },
      userList: [],
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // const { data: res } = await this.$http.get('users', this.quertList)
      const { data: res } = await this.$http.get('users', { params: this.quertList })

      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      // console.log(res)
      this.userList = res.data.users
      // console.log('userlist', this.userList)
      this.total = res.data.total
    }
  }
}

</script>

<style lang="less" scoped>

</style>
