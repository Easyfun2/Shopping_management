<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
          clearable @click="getGoodsList">
            <el-button slot="append" icon="el-icon-search"
            @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-row>
        <el-table
        :data="goodsList"
        border stripe>
          <el-table-column
          type="index">
          </el-table-column>

          <el-table-column label="商品名称"
          prop="goods_name">
          </el-table-column>

          <el-table-column label="商品价格（元）"
          prop="goods_price" width="120px">
          </el-table-column>

          <el-table-column label="商品重量"
          prop="goods_weight" width="120px">
          </el-table-column>

          <el-table-column label="创建时间"
          prop="add_time" width="140px">
            <template slot-scope="scope">
              {{formatDate(scope.row.add_time)}}
              <!-- {{scope.row.add_time | dataFormat}} -->

            </template>
          </el-table-column>

          <el-table-column label="操作"
          width="130px"
          >
          <template slot-scope="scope">
            <el-button type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editById(scope.row)"
            ></el-button>

            <el-button type="danger"
            icon="el-icon-delete"
            size="mini" @click="removeById(scope.row)"></el-button>
          </template>

          </el-table-column>

        </el-table>
      </el-row>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>

  </el-card>

    <!-- 修改商品名称的对话框 -->
    <el-dialog
      title="开始编辑"
      :visible.sync="editDialogVisible"
      width="80%"
      >
      <el-form :model="editForm" ref="editFormRef"
      label-position="right" label-width="100px"
      :rules="editFormRules">
        <el-form-item label="商品名称" prop="goods_name" >
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>

        <el-form-item label="商品价格" prop="goods_price" >
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 增加商品的对话框 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0,
      editDialogVisible: false,
      editForm: {
        goods_number: '',
        goods_name: '',
        goods_price: ''
      },
      editFormRules: {
        goods_name: [
          {
            require: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在3到10个字符',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            require: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在3到10个字符',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            require: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在3到10个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败!!')
      }
      this.$message.success('获取PO数据成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    formatDate (timestamp) {
      const newDate = new Date()
      newDate.setTime(timestamp * 1000)
      return newDate.toLocaleString()
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById (row) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      const { data: res } = await this.$http.delete(
        `goods/${row.goods_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }

      this.$message.success('删除参数成功！')
      this.getGoodsList()
    },
    async editById (row) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) {
        // console.log('res.data', res.data)
        // console.log('res.meta.status', res.meta.status)
        return this.$message.error('获取修改数据失败！！')
      }
      this.$message.success('获取修改数据成功！！')
      this.editForm = res.data
      console.log('this.editForm', this.editForm)
    },
    addGoods () {
      this.$router.push('/goods/add')
    },
    handleClose () {},
    submitForm () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log('vaild', valid)
        // console.log('看一下this', this)
        if (!valid) {
          return this.$message.error('获取失败了！！')
        }
        const { data: res } = await this.$http.put(`goods/${this.editForm.goods_id}`, {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_number: this.editForm.goods_number,
          goods_weight: this.editForm.goods_weight
        })

        if (res.meta.status !== 201) {
          console.log('res.meta.status', res.meta)
          console.log('this.editFomr', this.editForm)
          return this.$message.error('提交表单失败！')
        }
        this.$message.success('提交表单成功！！')
        this.getGoodsList()
        this.editDialogVisible = false
      })
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
  }
}
</script>

<style lang="less" scoped>

</style>
