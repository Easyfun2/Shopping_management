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
         <!-- 列表区域 -->
      <el-table
      :data="userList"
       border stripe>
        <el-table-column
          prop="id"
          label="#"
          >
        </el-table-column>

        <el-table-column
          prop="username"
          label="姓名"
          >
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>

        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>

        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>

        <el-table-column
          prop="mg_state"
          label="状态">
            <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
        </el-table-column>

        <el-table-column
          prop="address"
          label="操作">
        </el-table-column>
    </el-table>
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
      console.log('userlist', this.userList)
      this.total = res.data.total
    }
  }
}

</script>

<style lang="less" scoped>

.el-table{
  margin-top: 20px;
}

</style>
