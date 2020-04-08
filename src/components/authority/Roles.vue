<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"> 添加角色</el-button>
        </el-col>
      </el-row>

     <el-table stripe border
        :data="roleList"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']" v-for=" (item1, i1) in scope.row.children"
             :key="item1.id">
              <!-- {{scope.row}}{{i1}} -->
              <!-- 一级权限 -->
              <el-col :span="5" >
                <el-tag closable>
                {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 二级权限 -->
              <el-col :span="19">

                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop','vcenter']" v-for=" (item2,i2) in item1.children" :key="item2.id">

                  <el-col :span="6">
                    <el-tag type="success" closable>
                    {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                  <!-- <el-col :class="bdbottom1" :span="18" v-for="(item3,i3) in item2.children" :key="item3.id"> -->

                    <el-tag type="warning"
                     v-for="(item3,i3) in item2.children"
                      :key="item3.id" closable @close="removeRightById()">
                    <!-- <el-tag type="warning"> -->
                      {{i3}}
                    {{item3.authName}}
                    </el-tag>
                  </el-col>

                </el-row>
              </el-col>

            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <el-table-column
        type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述">
        </el-table-column>

          <el-table-column
          prop="level"
          label="操作" width="300px">
          <el-button size="mini" type="danger" icon="el-icon-delect">删除</el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>

        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.$message.success('获取成功')
      this.roleList = res.data
      console.log('this.roleList', this.roleList)
    },
    async removeRightById () {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      console.log('确认删除了，，')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}

.bdtop{
border-top: 1px solid #eee;
}

.bdbottom{
border-bottom: 1px solid #eee;

}

.bdbottom1{

background-color: red;
}

.vcenter{
  display: flex;
  align-items: center;
}
</style>
