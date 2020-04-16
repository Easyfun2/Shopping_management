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
            label="是否付款"
            prop="pay_status">
            <template slot-scope="scope">
              <!-- {{scope.row}} -->
              <el-tag type="primary" v-if="scope.row.pay_status === '0'">
                未付款
              </el-tag>
              <el-tag type="primary" v-if="scope.row.pay_status === '1'">
                已付款
              </el-tag>
            </template>
            </el-table-column>
          <el-table-column
            label="是否发货"
            prop="is_send"></el-table-column>
          <el-table-column
            label="下单时间"
            prop="create_time">
            <template slot-scope="scope">
              {{scope.row.create_time | dataFormat01 }}
            </template>
            </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              {{scope.row}}
              <el-button icon="el-icon-edit"
              type="primary" size="mini" @click="editAddressDialog"></el-button>

              <el-button icon="el-icon-location"
              type="success" size="mini" @click="showProgressBox(scope.row)"></el-button>

            </template>
            </el-table-column>
        </el-table>
      </el-row>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <el-dialog title="你可以修改地址了"
      :visible.sync="addressDialogVisible"
      width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" ref="addressRef" label-width="100px"
      :rules="addressRules">
        <el-form-item label="省市区/县" prop="address1">
        <el-cascader :options="cityData" v-model="addressForm.address1">
        </el-cascader>
        </el-form-item>
        <el-form-item label="详细信息" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
      <el-button @click="addressDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitAddressForm">确 定</el-button>
      </span>

    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index"
        :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
</div>
</template>

<script>
import cityData from './citydata.js'

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
      orderList: [],
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address1: [
          {
            require: true,
            message: '请选择省市区县',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            require: true,
            message: '请输入详细信息',
            trigger: 'blur'
          }
        ]
      },
      cityData: cityData,
      progressVisible: false,
      progressInfo: {}
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
    },
    editAddressDialog () {
      this.addressDialogVisible = true
    },
    submitAddressForm () {
      this.addressDialogVisible = false
    },
    addressDialogClosed () {
      this.$refs.addressRef.resetFields()
    },
    async showProgressBox (row) {
      this.progressVisible = true
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取快递数据失败')
      }
      this.$message.success('获取成功！')
      this.progressInfo = res.data
    }

  }
}
</script>

<style lang="less" scoped>
// @import '../../plugins/timeline/timeline.css';
// @import '../../plugins/timeline-items/timeline-items.css';

@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
</style>
