<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            show-icon
            :closable="false">
        </el-alert>
        </el-col>
      </el-row>
      <el-row style="margin:20px 0">
        <el-col>
          <span style="font-size:15px">选择商品的分类：</span>
          <!-- 级联选择框 -->
           <el-cascader style="height:500px!"
            expand-trigger="hover"
            :options="cateList"
            :props="ccateProps"
            v-model="selectedCateKeys"
            @change="handleChanged"
            >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini"
          :disabled="isBtnDisabled"
          @click="adddialogVisible = true">添加参数</el-button>

          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 这里是一个展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(items, i) in scope.row.attr_vals"
                :key="i" closable @close="handClose(i,scope.row)">
                  {{items}}
                </el-tag>

                <!-- 输入的文本框 -->
                <el-input class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else
                class="button-new-tag" size="small"
                @click="showInput(scope.row)">+ New Tag</el-button>

              </template>

            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数说明" prop="attr_name" width="200px"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                 <el-button type="danger" icon="el-icon-edit" size="mini"
                 @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>

            </el-table-column>

          </el-table>
        </el-tab-pane>

        <!-- 添加静态参数的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini"
          :disabled="isBtnDisabled"
          @click="adddialogVisible = true">添加属性</el-button>

          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>

            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(items, i) in scope.row.attr_vals"
                :key="i" closable @close="handClose(i,scope.row)">
                  {{items}}
                </el-tag>

                <!-- 输入的文本框 -->
                <el-input class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else
                class="button-new-tag" size="small"
                @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name" width="200px"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                 @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                 <el-button type="danger" icon="el-icon-edit" size="mini"
                 @click="removeParams(scope.row.attr_id)">
                  删除
                </el-button>
              </template>

            </el-table-column>

          </el-table>

        </el-tab-pane>
      </el-tabs>

    </el-card>

    <!-- 添加参数的对话框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="adddialogVisible"
        width="55%"
        @close="adddialogClosed">

        <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="adddialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

    <!-- 修改参数的对话框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editdialogVisible"
        width="55%"
        @close="editdialogClosed">

        <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>

</div>
</template>

<script>
export default {
  data () {
    return {
      cateList: [],
      // 级联选择器的配置对象
      ccateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器双向数据绑定
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      adddialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      },
      editdialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {

    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！！')
      }
      this.cateList = res.data
      // console.log(this.cateList)
    },
    handleChanged () {
      this.getParamsDate()
    },
    handleTabClick () {
      this.getParamsDate()
    },
    async getParamsDate () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }

      // 根据所选的分类的ID，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！！')
      }
      this.$message.success('获取数据success！！')
      // console.log(res.data)

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      console.log('res.data', res.data)

      if (this.activeName === 'many') {
        this.manyTableData = res.data
        console.log('manyTableData', this.manyTableData)
      } else {
        this.onlyTableData = res.data
        console.log('onlyTableData', this.onlyTableData)
      }
    },
    adddialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加成功！！')
        this.adddialogVisible = false
        this.getParamsDate()
      })
    },
    async showEditDialog (id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}
      /attributes/${id}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        this.$message.error('失败了,返回值：', res.meta.msg)
      }
      this.editForm = res.data
      this.editdialogVisible = true
    },
    // 重置修改的表单
    editdialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          // $后面不能换行，否则会报错！！
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        )
        // console.log('this.editForm.attr_id', this.editForm.attr_id)
        // console.log('this.cateId', this.cateId)
        // console.log('editForm.attr_name', this.editForm.attr_name)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！返回值：', res.meta.msg)
        }

        this.$message.success('修改成功！')
        this.getParamsDate()
        this.editdialogVisible = false
      })
    },
    async removeParams (attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 用户取消了删除的操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      // 删除的业务逻辑
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }

      this.$message.success('删除参数成功！')
      this.getParamsDate()
    },
    // 文本框失去焦点
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作，保存到数据库
    async saveAttrVals (row) {
      // 需要发起请求，保存这次操作
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
    // 点击按钮，展示文本输入框
    showInput (row) {
      row.inputVisible = true
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的ID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 0 10px;
}

.input-new-tag {
  width:120px
}
</style>
