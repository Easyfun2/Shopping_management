<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-alert
      title="消息提示的文案"
      type="info"
      center
      show-icon>
    </el-alert>

    <el-steps :space="200" :active="stepIndex - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <el-form :model="addForm"
    :rules="addFormrules" ref="addFormRef"
    label-width="100px"
    >
     <el-tabs tab-position="left"
      v-model="stepIndex" label-position="top"
      :before-leave="beforeTabLeave"
      @tab-click="tabClicked">
      <el-tab-pane label="基本信息" name="0">基本信息
        <el-form-item label="商品信息" prop="goods_name">
          <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price" type="number">
          <el-input v-model="addForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number" >
          <el-input v-model="addForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader expand-trigger="hover"
          :options="cateList" :props="cateProps"
          v-model="addForm.goods_cat" @change="handleChange">

          </el-cascader>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">商品参数
        <!-- 渲染表单的Item项 -->
        <el-form-item label="item.attr_name" v-for="item in mangTableDate"
        :key="item.attr_id">
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
   </el-tabs>
    </el-form>

</el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      stepIndex: '0',
      // 表单的所有内容
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: []
      },
      // 表单的验证规则
      addFormrules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请输入分类',
            trigger: 'blur'
          }
        ]
      },
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      mangTableDate: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败！！')
      }
      this.$message.success('获取数据成功！！')
      this.cateList = res.data
    },
    handleChange () {
      console.log('goods_cat', this.addForm.goods_cat)
      console.log('goods_cat的长度', this.addForm.goods_cat.length)
      console.log('goods_cat的类型', typeof this.addForm.goods_cat.length)

      // this.$message.success(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' &&
      this.addForm.goods_cat.length !== 3) {
        this.$message.error('还未选择商品分类！')
        return false
      }
      // console.log('即将离开的标签页,', oldActiveName)
      // console.log('去的标签页,', activeName)
    },
    async tabClicked () {
      // console.log(this.stepIndex)
      if (this.stepIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          })
        if (res.meta.status !== 200) {
          return this.$message.error('获取失败！')
        }
        this.$message.success('获取成功！！！')
        console.log('前', res.data)

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        console.log('后', res.data)

        this.mangTableDate = res.date
      }
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }

}
</script>

<style lang="less" scoped>

</style>
