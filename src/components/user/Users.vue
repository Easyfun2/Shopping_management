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
            <el-input placeholder="请输入内容" v-model="queryList.query"
            clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addUser">添加用户</el-button>
          </el-col>
        </el-row>
         <!-- 列表区域 -->
        <el-table
        :data="userList"
        border stripe>
          <el-table-column
            type="index"
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
            label="状态">

            <!--作用域插槽  -->
            <template slot-scope="scope">
              <!-- userlist的数据，用scope.row去获取 -->
              <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
            </template>

          </el-table-column>

          <el-table-column
            prop="address"
            label="操作" width="210px">
              <template slot-scope="scope">
                <!-- {{scope.row.id}} -->
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="showEditDialog(scope.row.id)"></el-button>

                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="delectUserInfor(scope.row.id)"></el-button>

                <!-- 分配按钮 -->
                <el-tooltip effect="light" content="分配角色" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
              </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[1, 5, 10, 20]"
          :current-page="queryList.pagenum"
          :page-size="queryList.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>

      <el-dialog
        title="ADD USERS"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
        <el-form :model="addForm" :rules="addFromRules" ref="addFormRef" label-width="100px">
          <el-form-item label="Usernane" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="phone" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="CHANGE USERS"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
        >
        <el-form :model="editFrom" :rules="addFromRules" ref="editFormRef"
        label-width="70px">
          <el-form-item label="Username">
            <el-input v-model="editFrom.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="editFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="phone" prop="mobile">
            <el-input v-model="editFrom.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditForm">确 定</el-button>
        </span>
      </el-dialog>
</div>

</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryList: {
        query: '',
        pagenum: 1,
        pagesize: 5

      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFromRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在6到10个字符', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入移动手机',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editFrom: {
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // const { data: res } = await this.$http.get('users', this.quertList)
      const { data: res } = await this.$http.get('users', { params: this.queryList })

      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      // console.log(res)
      this.userList = res.data.users
      console.log('userlist', this.userList)
      this.total = res.data.total
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      console.log('每页', val, '条')
      this.queryList.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.queryList.pagesize = val
      this.getUserList()
    },
    async userStateChanged (val) {
      console.log(val)
      const { data: res } = await this.$http.put(
        `users/${val.id}/state/${val.mg_state}`
      )
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新成功')
    },
    addUser () {
      this.addDialogVisible = true
    },
    // dialog中点击按钮增加新用户
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    submitForm () {
      this.$refs.addFormRef.validate(async valid => {
        console.log('test,valid', valid)

        if (!valid) {
          return this.$message.error('表单验证失败')
        }

        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('上传表单失败')
        }
        console.log('this.addFrom02', this.addForm)
        this.addDialogVisible = false
        this.getUserList()
        this.$message.success('上传表单success')
      })
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        // 这里的return 有终止的意思
        return this.$message.error('查询用户信息失败！')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
      // console.log(res.data.id)
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    submitEditForm () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('表单验证失败')
        }
        const { data: res } = await this.$http.put('users/' + this.editFrom.id,
          {
            email: this.editFrom.email,
            mobile: this.editFrom.mobile
          })
        if (res.meta.status !== 200) {
          return this.$message.error('提交修改调单失败')
        }

        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('成功功！！！')
      })
    },
    delectUserInfor (id) {
      // 这部分有问题
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}

</script>

<style lang="less" scoped>

.el-table{
  margin-top: 20px;
}

</style>
