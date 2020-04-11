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
                      :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
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
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delect">删除</el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

        <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible"
      width="30%"
      @close="setRightdialogClosed"
      >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <!-- 这里是tree组件 -->
        <el-tree
          :data="userRightList"
          show-checkbox
          :props="treeProps"
          default-expand-all
          node-key="id"
          :default-checked-keys="defTreeKeys"
          ref="treeRef"
          >
        </el-tree>

        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      setRightdialogVisible: false,
      userRightList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defTreeKeys: [105, 116],
      roleId: []
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
    async removeRightById (role, righId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      // console.log('确认删除了，，')

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${righId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }

      // 这边是个亮点
      role.children = res.data
    },
    async setRight (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$$message.error('获取权限树失败')
      }
      this.userRightList = res.data
      // 开始
      this.getLeafKeys(role, this.defTreeKeys)
      this.setRightdialogVisible = true
      console.log(this.userRightList)
    },
    // 递归函数
    // 获取所有三级权限的id
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(ele => {
        this.getLeafKeys(ele, arr)
      })
    },
    setRightdialogClosed () {
      this.defTreeKeys = []
    },
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log('keys', keys)
      console.log('idstr', idStr)

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`,
        { rids: idStr })

      if (res.meta.status !== 200) {
        return this.$message.error('分配失败！！')
      }
      this.$message.success('分配成功！！')
      this.getRolesList()
      this.setRightdialogVisible = false
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
