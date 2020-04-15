/* eslint-disable no-undef */
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
    label-position="top"
    >
     <el-tabs tab-position="left"
      v-model="stepIndex" label-position="top"
      :before-leave="beforeTabLeave"
      @tab-click="tabClicked">
      <el-tab-pane label="基本信息" name="0">
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
      <el-tab-pane label="商品参数" name="1">
        <!-- 渲染表单的Item项 -->
        <el-form-item :label="item.attr_name" v-for="item in mangTableData"
        :key="item.attr_id"
        >
        <!-- 复选框组 -->
        <el-checkbox-group v-model="item.attr_vals">
          <el-checkbox
          :label="cb" v-for="(cb, i) in item.attr_vals"
          :key="i" border></el-checkbox>
        </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item.attr_name"
        v-for="item in onlyTableData"
        :key="item.attr_id" width="300px">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>

      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3">
        <el-upload
          action="http://127.0.0.1:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
          :headers="headerObj"
          :on-success="handleSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4">
        <!-- 富文本 -->
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary" style="margin:20px 0"
        @click="add">添加商品</el-button>
        </el-tab-pane>
   </el-tabs>
    </el-form>

</el-card>

<el-dialog title="图片预览"
:visible.sync="previewVisible"
width="50%">
  <img :src="previewPath" alt="" class="previewImg">
</el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'
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
        goods_cat: [],
        pics: [],
        attrs: []

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
      mangTableData: [],
      onlyTableData: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem('data')
      },
      previewPath: '',
      previewVisible: false,
      goods_introduce: ''

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
        this.mangTableData = res.data
        console.log('看看mangTableData', this.mangTableData)
      }
      if (this.stepIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败！')
        }
        this.$message.success('获取静态属性成功！')
        console.log('获取静态属性失败', res.data)
        this.onlyTableData = res.data
      }
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x =>
        x.pic === filePath
      )
      this.addForm.pics.splice(i, 1)
    },
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log('response', response)
      console.log('this.addForm', this.addForm)
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        // eslint-disable-next-line no-undef
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.mangTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
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
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.previewImg{
  width: 100%;
}

</style>
