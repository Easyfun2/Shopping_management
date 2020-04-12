<template>
<div>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">增加分类</el-button>
        </el-col>
      </el-row>

        <!-- 下面是表格 -->
        <tree-table class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type='false'
        :expand-type='false'
        :show-index='true'
        index-text='#'
        border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if='scope.row.cat_deleted === false'
          style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

          <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          {{scope.j}}
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!-- 排序 -->
        <template slot="opt" slot-scope="scope">
          {{scope.j}}
          <el-button type="primary" icon="el-icon-edit"
          size="mini">编辑
          </el-button>

            <el-button type="danger" icon="el-icon-delete"
            size="mini">删除
          </el-button>
        </template>

        </tree-table>

        <!-- 下面是分页 -->
        <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
        </el-pagination>

    </el-card>

    <!-- 分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatdialogVisible"
      width="50%"
      @close="addCatdialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules"
      ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类：">
            <!-- options 用来指定数据源 -->
            <!-- props 用来指定配置对象 -->
          <el-cascader
          expand-trigger="hover"
          :options="parentCateList"
          :props="cascaderProps"
          v-model="selectedKeys"
          @change="parentCateChanged"
          clearable
          change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          // 表示当前这一列使用模版名称
          template: 'opt'
        }
      ],
      addCatdialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_lever: 0

      },
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分页的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的ID数组
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！！')
      }
      // console.log('1', res.data)
      // console.log(res.data.result)

      // this.catelist = res.data
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCatdialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await
      this.$http.get('categories', { params: { type: 2 } })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data
      // console.log(res.data)
    },
    // 选择项发生变化，触发函数
    parentCateChanged () {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_lever = this.selectedKeys.length
        // return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_lever = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCatdialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_lever = 0
      this.addCateForm.cat_pid = 0
    }

  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
  margin-bottom: 10px
}
el-cascader{
  width: 100%;
}

</style>
