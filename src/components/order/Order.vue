<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入...">
           <el-button slot="append" icon="el-icon-search"></el-button>
           </el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-table :data="orderList">
          <el-table-column
          type="index"></el-table-column>
          <el-table-column
            label="订单编号"
            prop="order_number"></el-table-column>
          <el-table-column
            label="订单价格"
            prop="order_price"></el-table-column>
          <el-table-column
            label="付款状态"
            prop="order_pay"></el-table-column>
          <el-table-column
            label="是否发货"
            prop="is_send"></el-table-column>
          <el-table-column
            label="下单时间"
            prop="create_time"></el-table-column>
          <el-table-column
            label="操作"
            >
            </el-table-column>
        </el-table>
      </el-row>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="orderList.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="orderList.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
    </el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: 5,
        // 每页显示条数
        pagesize: 10,
        // 当前页码
        pagenum: 1
      },
      total: 0,
      orderList: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取订货列表失败！！')
      }
      this.$message.success('获取订单列表成功！！')
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log('this.orderList', this.orderList)
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    }

  }
}
</script>

<style lang="less" scoped>

</style>
